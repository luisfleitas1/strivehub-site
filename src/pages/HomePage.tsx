import { motion } from "framer-motion";
import { TrendingUp, User, Settings, Clock, Dumbbell, Activity, UtensilsCrossed, BedDouble, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const scores = [
  { key: "recovery", label: "Recovery", value: 78, status: "Good", hint: "Ready for training", icon: BedDouble, color: "text-coach-violet", bg: "bg-coach-violet/10" },
  { key: "strength", label: "Strength", value: 82, status: "Good", hint: "Progressing well", icon: Dumbbell, color: "text-primary", bg: "bg-primary/10" },
  { key: "cardio", label: "Cardio", value: 61, status: "Moderate", hint: "Add 1-2 sessions", icon: Activity, color: "text-coach-blue", bg: "bg-coach-blue/10" },
  { key: "nutrition", label: "Nutrition", value: 65, status: "Moderate", hint: "Protein slightly low", icon: UtensilsCrossed, color: "text-accent", bg: "bg-accent/10" },
];

function localFallback() {
  const recovery = scores.find(s => s.key === "recovery")!;
  const strength = scores.find(s => s.key === "strength")!;
  const cardio = scores.find(s => s.key === "cardio")!;
  const nutrition = scores.find(s => s.key === "nutrition")!;

  if (recovery.value < 60) return { action: "Rest / recovery day", reason: "Body needs recovery today" };
  const lowest = [cardio, nutrition].reduce((a, b) => a.value < b.value ? a : b);
  if (lowest.key === "cardio" && cardio.value < strength.value) return { action: "Cardio session (30-40 min)", reason: "Consistency will unlock progress" };
  if (lowest.key === "nutrition") return { action: "Focus on nutrition today", reason: "Protein intake is slightly low" };
  return { action: "Strength training (45-60 min)", reason: "Recovery is solid — push today" };
}

const CACHE_KEY_PREFIX = "strivehub_daily_rec_";

function getCachedRecommendation(): { action: string; reason: string } | null {
  const today = new Date().toISOString().split("T")[0];
  const key = CACHE_KEY_PREFIX + today;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }
  return null;
}

function setCachedRecommendation(rec: { action: string; reason: string }) {
  const today = new Date().toISOString().split("T")[0];
  const key = CACHE_KEY_PREFIX + today;
  try {
    // Clean old entries
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(CACHE_KEY_PREFIX) && k !== key) localStorage.removeItem(k);
    }
    localStorage.setItem(key, JSON.stringify(rec));
  } catch { /* ignore */ }
}

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, goal, activity_level")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: aiRecommendation } = useQuery({
    queryKey: ["daily-recommendation", user?.id, new Date().toISOString().split("T")[0]],
    queryFn: async () => {
      // Check local cache first for instant display
      const cached = getCachedRecommendation();
      if (cached) return cached;

      try {
        const scorePayload = {
          recovery: scores.find(s => s.key === "recovery")!.value,
          strength: scores.find(s => s.key === "strength")!.value,
          cardio: scores.find(s => s.key === "cardio")!.value,
          nutrition: scores.find(s => s.key === "nutrition")!.value,
        };

        const { data, error } = await supabase.functions.invoke("daily-recommendation", {
          body: {
            scores: scorePayload,
            profile: {
              goal: profile?.goal || [],
              activity_level: profile?.activity_level || "moderate",
            },
          },
        });

        if (error) throw error;
        if (data?.primary_action) {
          const rec = { action: data.primary_action, reason: data.supporting_reason };
          setCachedRecommendation(rec);
          return rec;
        }
      } catch (e) {
        console.error("AI recommendation failed, using fallback:", e);
      }

      // Fallback
      const fb = localFallback();
      setCachedRecommendation(fb);
      return fb;
    },
    enabled: !!user?.id,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 24 * 60 * 60 * 1000,
    placeholderData: getCachedRecommendation() || localFallback(),
  });

  const todayAction = aiRecommendation || localFallback();

  const firstName = profile?.display_name?.split(" ")[0] || user?.email?.split("@")[0] || "";
  const hours = new Date().getHours();
  const timeGreeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const hasData = true;

  if (!hasData) {
    return (
      <div className="max-w-md mx-auto px-5 pt-14 pb-28 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <motion.div {...fade(0)}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold">Welcome to StriveHub</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Log your first workout or meal to start getting insights
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      {/* Greeting */}
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            {timeGreeting}{firstName ? `, ${firstName}` : ""}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Your plan today</h1>
          <p className="text-xs text-muted-foreground mt-1">You're on track this week</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/history")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="History">
            <Clock className="w-5 h-5" strokeWidth={1.8} />
          </button>
          <button onClick={() => navigate("/profile")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Profile">
            <User className="w-5 h-5" strokeWidth={1.8} />
          </button>
          <button onClick={() => navigate("/settings")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>
      </motion.div>

      {/* Today — AI-driven primary action */}
      <motion.div {...fade(1)} className="bg-card rounded-2xl p-5 border border-border space-y-1.5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Today</h2>
        </div>
        <p className="text-[15px] font-semibold text-foreground">{todayAction.action}</p>
        <p className="text-xs text-muted-foreground">{todayAction.reason}</p>
      </motion.div>

      {/* Scores */}
      <motion.div {...fade(2)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Week</h2>
        <div className="grid grid-cols-2 gap-3">
          {scores.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => navigate(`/score/${s.key}`)}
                className="bg-card rounded-2xl p-4 border border-border text-left hover:border-primary/20 transition-colors space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.8} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <span className="text-[10px] text-muted-foreground font-medium">{s.status}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">{s.hint}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
