import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Pencil, RotateCcw, Sparkles, UtensilsCrossed, ChevronRight, Beef, Leaf, Loader2, MessageSquare } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AIChatScreen from "@/components/AIChatScreen";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

type MainTab = "trends" | "history" | "log";
type Timeframe = "7d" | "30d" | "90d" | "1y";
type LogMode = "choose" | "structured" | "camera" | "analyzing" | "result";

const timeframes: { value: Timeframe; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

const generateProteinData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 30 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] : tf === "30d" ? `${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    protein: Math.round(80 + Math.random() * 60),
  }));
};

const generateMealConsistency = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7] : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    meals: Math.floor(2 + Math.random() * 2),
  }));
};

const macroDistribution = { protein: 32, carbs: 43, fats: 25 };

interface AnalyzedItem {
  name: string;
  category: string;
  emoji: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface MealAnalysis {
  items: AnalyzedItem[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  feedback: string;
}

const categoryColors: Record<string, string> = {
  Protein: "bg-primary/10 text-primary",
  Carbs: "bg-coach-amber/15 text-coach-amber",
  Veggies: "bg-primary/10 text-primary",
  Fat: "bg-coach-violet/15 text-coach-violet",
  Dairy: "bg-coach-blue/15 text-coach-blue",
  Fruit: "bg-accent/10 text-accent",
};

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const feedbackMessages = ["Good protein intake today", "Balanced meal — nice choice!", "You're on track"];

const mockMealHistory = [
  { id: "1", type: "Lunch", items: "Chicken, rice, broccoli", date: "Mar 28", emoji: "🍗" },
  { id: "2", type: "Dinner", items: "Salmon, vegetables, quinoa", date: "Mar 27", emoji: "🐟" },
  { id: "3", type: "Breakfast", items: "Oats, banana, protein shake", date: "Mar 27", emoji: "🥣" },
  { id: "4", type: "Lunch", items: "Turkey wrap, salad", date: "Mar 26", emoji: "🌯" },
  { id: "5", type: "Dinner", items: "Steak, sweet potato", date: "Mar 26", emoji: "🥩" },
  { id: "6", type: "Breakfast", items: "Eggs, toast, avocado", date: "Mar 25", emoji: "🥑" },
];

const hasData = true;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{payload[0].value}{payload[0].dataKey === "protein" ? "g" : ""}</p>
    </div>
  );
};

const MealPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") as MainTab | null;
  const [mainTab, setMainTab] = useState<MainTab>(initialTab === "log" || initialTab === "history" ? initialTab : "trends");
  const [timeframe, setTimeframe] = useState<Timeframe>("90d");
  const [logMode, setLogMode] = useState<LogMode>("choose");
  const [mealType, setMealType] = useState("Lunch");
  const [ingredients, setIngredients] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAI, setShowAI] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);

  const proteinData = generateProteinData(timeframe);
  const consistencyData = generateMealConsistency(timeframe);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      toast.error("Add some ingredients first");
      return;
    }
    setLogMode("analyzing");
    try {
      const { data, error } = await supabase.functions.invoke("meal-analyze", {
        body: { ingredients, meal_type: mealType },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data as MealAnalysis);
      setLogMode("result");
    } catch (e) {
      console.error("Meal analysis failed:", e);
      toast.error("Could not analyze meal. Please try again.");
      setLogMode("structured");
    }
  };

  const handleConfirm = () => {
    const msg = analysis?.feedback || feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    toast.success(msg);
    setMainTab("trends");
    setLogMode("choose");
    setAnalysis(null);
    setIngredients("");
  };

  if (!hasData) {
    return (
      <div className="max-w-md mx-auto px-5 pt-14 pb-28 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <motion.div {...fade(0)}>
          <div className="w-16 h-16 rounded-full bg-coach-amber/10 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-7 h-7 text-coach-amber" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold">No meals logged</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">Log meals to see nutrition trends</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-5">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Nutrition</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Meals</h1>
        </div>
        <button
          onClick={() => { setMainTab("log"); setLogMode("choose"); setAnalysis(null); }}
          className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </motion.div>

      {mainTab !== "log" && (
        <motion.div {...fade(1)} className="flex bg-muted rounded-xl p-1">
          {(["trends", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mainTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "trends" ? "Trends" : "History"}
            </button>
          ))}
        </motion.div>
      )}

      {mainTab === "trends" && (
        <>
          <motion.div {...fade(2)} className="flex gap-1.5">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  timeframe === tf.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </motion.div>

          <motion.div {...fade(3)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
            <div className="flex items-center gap-2">
              <Beef className="w-4 h-4 text-accent" strokeWidth={1.8} />
              <h3 className="text-sm font-semibold">Protein Intake</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight">108g</span>
              <span className="text-xs text-muted-foreground">avg/day</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={proteinData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 93%)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} width={28} unit="g" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="protein" stroke="hsl(16, 60%, 62%)" strokeWidth={2} dot={{ r: 2.5, fill: "hsl(16, 60%, 62%)" }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div {...fade(4)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-coach-blue" strokeWidth={1.8} />
              <h3 className="text-sm font-semibold">Meal Consistency</h3>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consistencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 93%)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="meals" fill="hsl(210, 50%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div {...fade(5)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
            <h3 className="text-sm font-semibold">Nutrition Balance</h3>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden">
              <div className="bg-primary rounded-l-full" style={{ width: `${macroDistribution.protein}%` }} />
              <div className="bg-coach-amber" style={{ width: `${macroDistribution.carbs}%` }} />
              <div className="bg-coach-violet rounded-r-full" style={{ width: `${macroDistribution.fats}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Protein {macroDistribution.protein}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-coach-amber" />
                <span className="text-muted-foreground">Carbs {macroDistribution.carbs}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-coach-violet" />
                <span className="text-muted-foreground">Fats {macroDistribution.fats}%</span>
              </div>
            </div>
          </motion.div>

          <motion.div {...fade(6)} className="bg-primary/5 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" strokeWidth={1.8} />
              <h3 className="text-sm font-semibold">Whole Foods</h3>
            </div>
            <p className="text-sm text-muted-foreground">Vegetables included in <span className="font-semibold text-foreground">4 of last 7 days</span></p>
          </motion.div>
        </>
      )}

      {mainTab === "history" && (
        <motion.div {...fade(2)} className="space-y-2">
          {mockMealHistory.map((item) => (
            <button
              key={item.id}
              className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center gap-3 hover:border-primary/20 transition-colors"
            >
              <span className="text-xl shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.type}</p>
                <p className="text-xs text-muted-foreground truncate">{item.items}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </motion.div>
      )}

      {mainTab === "log" && (
        <AnimatePresence mode="wait">
          {logMode === "choose" && (
            <motion.div key="choose" {...fade(1)} exit={{ opacity: 0 }} className="space-y-3">
              <button onClick={() => setLogMode("structured")} className="w-full bg-card rounded-2xl p-5 border border-border text-left space-y-2 hover:border-primary/30 transition-colors">
                <p className="text-sm font-medium">Manual entry</p>
                <p className="text-xs text-muted-foreground">Add meal type, ingredients, and details</p>
              </button>
              <button onClick={() => setLogMode("camera")} className="w-full bg-card rounded-2xl p-5 border border-border text-left space-y-2 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Take a photo</p>
                </div>
                <p className="text-xs text-muted-foreground">AI will detect your meal items</p>
              </button>
              <button onClick={() => setShowAI(true)} className="w-full bg-card rounded-2xl p-5 border border-border text-left space-y-2 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium">Describe with AI</p>
                </div>
                <p className="text-xs text-muted-foreground">Chat with AI to log and analyze your meal</p>
              </button>
              <button onClick={() => setMainTab("trends")} className="w-full py-2 text-xs text-muted-foreground">Cancel</button>
            </motion.div>
          )}

          {logMode === "structured" && (
            <motion.div key="structured" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Meal type</label>
                <div className="flex gap-2 flex-wrap">
                  {mealTypes.map((t) => (
                    <button key={t} onClick={() => setMealType(t)} className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${mealType === t ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ingredients or meal name</label>
                <Input placeholder="e.g. chicken, rice, broccoli" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="rounded-xl" />
                <p className="text-[10px] text-muted-foreground">Separate items with commas, or type a meal name</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setLogMode("choose")} className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground">Back</button>
                <button onClick={handleAnalyze} disabled={!ingredients.trim()} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Analyze
                </button>
              </div>
            </motion.div>
          )}

          {logMode === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Analyzing your meal</p>
                <p className="text-xs text-muted-foreground mt-1">Estimating nutrition from ingredients</p>
              </div>
            </motion.div>
          )}

          {logMode === "camera" && (
            <motion.div key="camera" {...fade(1)} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
              <div className="relative aspect-[4/3] bg-muted rounded-2xl overflow-hidden flex items-center justify-center border border-border">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-muted-foreground">Point camera at your meal</p>
                </div>
                <div className="absolute inset-6">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setLogMode("choose")} className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground">Back</button>
                <button onClick={() => setLogMode("result")} className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-transform active:scale-[0.98]">Take Photo</button>
              </div>
            </motion.div>
          )}

          {logMode === "result" && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {analysis ? (
                <>
                  {/* AI Analysis Results */}
                  <div className="space-y-2.5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Detected Items</h2>
                    {analysis.items.map((item) => (
                      <div key={item.name} className="bg-card rounded-xl p-3.5 border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.emoji}</span>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}>{item.category}</span>
                              <span className="text-[10px] text-muted-foreground">{item.calories} cal</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nutrition Estimate</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{analysis.total_calories}</p>
                        <p className="text-[10px] text-muted-foreground">Calories</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{analysis.total_protein_g}g</p>
                        <p className="text-[10px] text-muted-foreground">Protein</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-coach-amber">{analysis.total_carbs_g}g</p>
                        <p className="text-[10px] text-muted-foreground">Carbs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-coach-violet">{analysis.total_fat_g}g</p>
                        <p className="text-[10px] text-muted-foreground">Fat</p>
                      </div>
                    </div>
                    {analysis.feedback && (
                      <p className="text-xs text-muted-foreground text-center pt-1 border-t border-border">{analysis.feedback}</p>
                    )}
                  </div>
                </>
              ) : (
                /* Fallback for camera result (mock) */
                <div className="space-y-2.5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Detected Items</h2>
                  {[
                    { name: "Grilled Chicken", category: "Protein", emoji: "🍗" },
                    { name: "Brown Rice", category: "Carbs", emoji: "🍚" },
                    { name: "Broccoli", category: "Veggies", emoji: "🥦" },
                    { name: "Olive Oil", category: "Fat", emoji: "🫒" },
                  ].map((item) => (
                    <div key={item.name} className="bg-card rounded-xl p-3.5 border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>{item.category}</span>
                        </div>
                      </div>
                      <button className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setLogMode("choose"); setAnalysis(null); }} className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium flex items-center justify-center gap-2 text-muted-foreground">
                  <RotateCcw className="w-4 h-4" /> Redo
                </button>
                <button onClick={handleConfirm} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                  <Check className="w-4 h-4" /> Confirm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {showAI && <AIChatScreen context="meal" onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default MealPage;
