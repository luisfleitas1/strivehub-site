import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { meal_name, ingredients, meal_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = ingredients
      ? `Analyze this meal. Meal type: ${meal_type || "Meal"}. Ingredients: ${ingredients}.`
      : `Analyze this meal: ${meal_name || "Unknown meal"}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a nutrition analysis engine for the StriveHub fitness app. Given a meal description or ingredients, return a structured nutrition estimate. Be realistic and use standard portion sizes when not specified. Always return the tool call, never plain text.`,
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "meal_analysis",
              description: "Return structured nutrition analysis of a meal",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    description: "Detected food items",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Food item name" },
                        category: { type: "string", enum: ["Protein", "Carbs", "Veggies", "Fat", "Dairy", "Fruit"] },
                        emoji: { type: "string", description: "Single emoji representing the food" },
                        calories: { type: "number", description: "Estimated calories" },
                        protein_g: { type: "number", description: "Estimated protein in grams" },
                        carbs_g: { type: "number", description: "Estimated carbs in grams" },
                        fat_g: { type: "number", description: "Estimated fat in grams" },
                      },
                      required: ["name", "category", "emoji", "calories", "protein_g", "carbs_g", "fat_g"],
                      additionalProperties: false,
                    },
                  },
                  total_calories: { type: "number" },
                  total_protein_g: { type: "number" },
                  total_carbs_g: { type: "number" },
                  total_fat_g: { type: "number" },
                  feedback: { type: "string", description: "One short sentence of nutritional feedback" },
                },
                required: ["items", "total_calories", "total_protein_g", "total_carbs_g", "total_fat_g", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "meal_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Could not analyze meal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("meal-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
