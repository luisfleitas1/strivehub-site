import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Scores {
  recovery: number;
  strength: number;
  cardio: number;
  nutrition: number;
}

function fallback(scores: Scores): { primary_action: string; supporting_reason: string } {
  if (scores.recovery < 60) {
    return { primary_action: "Rest / recovery day", supporting_reason: "Your body needs recovery today" };
  }
  const lowest = Object.entries(scores)
    .filter(([k]) => k !== "recovery")
    .reduce((a, b) => (a[1] < b[1] ? a : b));

  if (lowest[0] === "cardio" && scores.cardio < scores.strength) {
    return { primary_action: "Cardio session (30-40 min)", supporting_reason: "Cardio consistency will unlock progress" };
  }
  if (lowest[0] === "nutrition") {
    return { primary_action: "Focus on nutrition today", supporting_reason: "Protein intake needs attention" };
  }
  if (scores.recovery > 70) {
    return { primary_action: "Strength training (45-60 min)", supporting_reason: "Recovery is solid and strength momentum is strong" };
  }
  return { primary_action: "Light training day", supporting_reason: "Moderate recovery — keep effort controlled" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { scores, profile } = await req.json() as {
      scores: Scores;
      profile: { goal?: string[]; activity_level?: string };
    };

    // Check cache first
    const today = new Date().toISOString().split("T")[0];
    const { data: cached } = await supabase
      .from("daily_recommendations")
      .select("primary_action, supporting_reason")
      .eq("user_id", user.id)
      .eq("recommendation_date", today)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try AI, fallback on failure
    let result: { primary_action: string; supporting_reason: string };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      result = fallback(scores);
    } else {
      try {
        const systemPrompt = `You are a fitness coach decision engine. Given user scores and profile, return exactly one daily action.
Rules:
- If recovery < 60: recommend rest/recovery
- If recovery >= 60 and strength is strong: recommend strength training
- If cardio is lowest: recommend cardio
- If nutrition is lowest: recommend nutrition focus
- Only ONE action per day
- Be calm, confident, concise — no emojis, no paragraphs`;

        const userPrompt = `Scores: Recovery ${scores.recovery}, Strength ${scores.strength}, Cardio ${scores.cardio}, Nutrition ${scores.nutrition}.
Profile: Goals: ${(profile.goal || []).join(", ") || "general fitness"}. Activity level: ${profile.activity_level || "moderate"}.
Return the daily recommendation.`;

        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "daily_recommendation",
                  description: "Return the single daily recommendation",
                  parameters: {
                    type: "object",
                    properties: {
                      primary_action: { type: "string", description: "The one action for today, e.g. 'Strength training (45-60 min)'" },
                      supporting_reason: { type: "string", description: "One-line reason, e.g. 'Recovery is solid and strength momentum is strong'" },
                    },
                    required: ["primary_action", "supporting_reason"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "daily_recommendation" } },
          }),
        });

        if (!aiResp.ok) {
          console.error("AI gateway error:", aiResp.status);
          result = fallback(scores);
        } else {
          const aiData = await aiResp.json();
          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            result = JSON.parse(toolCall.function.arguments);
          } else {
            result = fallback(scores);
          }
        }
      } catch (e) {
        console.error("AI call failed:", e);
        result = fallback(scores);
      }
    }

    // Cache result
    await supabase.from("daily_recommendations").insert({
      user_id: user.id,
      recommendation_date: today,
      primary_action: result.primary_action,
      supporting_reason: result.supporting_reason,
      scores,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-recommendation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
