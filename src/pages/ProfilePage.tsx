import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const GOALS = ["Build muscle", "Improve endurance", "Improve overall health", "Maintain fitness", "Lose fat"];
const TRAINING_FOCUS = ["Strength training", "Cardio / running", "General fitness", "Nutrition / body comp"];
const ACTIVITY_LEVELS = ["1–2 days/week", "3–4 days/week", "5+ days/week"];
const DATA_SOURCES = ["Garmin", "Apple Health", "Manual logging", "Strong App CSV"];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoalsState] = useState<string[]>([]);
  const [trainingFocus, setTrainingFocus] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState("");
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [targetWeight, setTargetWeight] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [targetBodyFat, setTargetBodyFat] = useState("");

  useEffect(() => {
    if (profile && !initialized) {
      const p = profile as any;
      const dn = p.display_name || "";
      setName(dn.includes("@") ? "" : dn);
      setAge(p.age?.toString() || "");
      setSex(p.sex || "");
      setHeight(p.height_cm?.toString() || "");
      setWeight(p.weight_kg?.toString() || "");
      setGoalsState(p.goal || []);
      setTrainingFocus(p.training_focus || []);
      setActivityLevel(p.activity_level || "");
      setDataSources(p.data_sources || []);
      setTargetWeight(p.target_weight?.toString() || "");
      setProteinTarget(p.protein_target?.toString() || "");
      setBodyFat(p.body_fat?.toString() || "");
      setTargetBodyFat(p.target_body_fat?.toString() || "");
      setInitialized(true);
    }
  }, [profile, initialized]);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: name || null,
        age: age ? parseInt(age) : null,
        sex: sex || null,
        height_cm: height ? parseFloat(height) : null,
        weight_kg: weight ? parseFloat(weight) : null,
        goal: goals,
        training_focus: trainingFocus,
        activity_level: activityLevel || null,
        data_sources: dataSources,
        target_weight: targetWeight ? parseFloat(targetWeight) : null,
        protein_target: proteinTarget ? parseInt(proteinTarget) : null,
        body_fat: bodyFat ? parseFloat(bodyFat) : null,
        target_body_fat: targetBodyFat ? parseFloat(targetBodyFat) : null,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      </motion.div>

      {/* Avatar */}
      <motion.div {...fade(1)} className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
            {name ? name[0].toUpperCase() : "?"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Basic info */}
      <motion.div {...fade(2)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Age</label>
            <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="years" type="number" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Height</label>
            <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="cm" type="number" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Weight</label>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" type="number" className="rounded-xl" />
          </div>
        </div>
      </motion.div>

      {/* Goal */}
      <motion.div {...fade(3)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fitness goals (tap to rank)</h2>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const rank = goals.indexOf(g);
            const isSelected = rank !== -1;
            return (
              <button
                key={g}
                onClick={() => setGoalsState(isSelected ? goals.filter((v) => v !== g) : [...goals, g])}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors relative ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
                }`}
              >
                {g}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center text-[10px] font-bold">
                    {rank + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Training focus */}
      <motion.div {...fade(4)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Training focus</h2>
        <div className="grid grid-cols-2 gap-2">
          {TRAINING_FOCUS.map((t) => (
            <button
              key={t}
              onClick={() => setTrainingFocus(toggleArray(trainingFocus, t))}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                trainingFocus.includes(t) ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Activity level */}
      <motion.div {...fade(5)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Activity level</h2>
        <div className="flex gap-2">
          {ACTIVITY_LEVELS.map((a) => (
            <button
              key={a}
              onClick={() => setActivityLevel(a)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activityLevel === a ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Data sources */}
      <motion.div {...fade(6)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Data sources</h2>
        <div className="grid grid-cols-2 gap-2">
          {DATA_SOURCES.map((d) => (
            <button
              key={d}
              onClick={() => setDataSources(toggleArray(dataSources, d))}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                dataSources.includes(d) ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Optional */}
      <motion.div {...fade(7)} className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Optional</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Body fat %</label>
            <Input value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="—" type="number" className="rounded-xl" />
            <p className="text-[11px] text-muted-foreground/60">{sex === "Female" ? "Healthy range for women: 20–30%" : "Healthy range for men: 10–20%"}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Target body fat %</label>
            <Input value={targetBodyFat} onChange={(e) => setTargetBodyFat(e.target.value)} placeholder="—" type="number" className="rounded-xl" />
            <p className="text-[11px] text-muted-foreground/60">{sex === "Female" ? "Athletic: 14–20% · Fit: 21–24% · Avg: 25–31%" : "Athletic: 6–13% · Fit: 14–17% · Avg: 18–24%"}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Target weight (kg)</label>
            <Input value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="—" type="number" className="rounded-xl" />
            <p className="text-[11px] text-muted-foreground/60">Healthy BMI range: 18.5–24.9. {height ? `For ${height} cm, that's ~${Math.round(18.5 * (parseFloat(height)/100)**2)}–${Math.round(24.9 * (parseFloat(height)/100)**2)} kg.` : ""}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Protein target (g/day)</label>
            <Input value={proteinTarget} onChange={(e) => setProteinTarget(e.target.value)} placeholder="—" type="number" className="rounded-xl" />
            <p className="text-[11px] text-muted-foreground/60">Recommended: 1.6–2.2 g/kg for active adults. {weight ? `For you: ~${Math.round(parseFloat(weight) * 1.6)}–${Math.round(parseFloat(weight) * 2.2)} g/day.` : ""}</p>
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div {...fade(8)}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? "Saving…" : "Save profile"}
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
