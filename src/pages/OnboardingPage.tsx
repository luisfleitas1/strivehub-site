import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Upload, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const GOALS = ["Build muscle", "Improve endurance", "Improve overall health", "Maintain fitness", "Lose fat"];
const ACTIVITY_LEVELS = ["1–2 days/week", "3–4 days/week", "5+ days/week"];
const SEX_OPTIONS = ["Male", "Female", "Prefer not to say"];

const fade = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.3 },
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState("");
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [targetWeight, setTargetWeight] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [targetBodyFat, setTargetBodyFat] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const totalSteps = 6; // intro, basics, goal, activity, data sources, optional

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const canProceed = () => {
    switch (step) {
      case 1: return age && sex && height && weight;
      case 2: return goals.length > 0;
      case 3: return !!activityLevel;
      default: return true;
    }
  };

  const handleComplete = async () => {
    if (!user?.id) return;
    setSaving(true);

    const payload = {
      age: age ? parseInt(age) : null,
      sex: sex || null,
      height_cm: height ? parseFloat(height) : null,
      weight_kg: weight ? parseFloat(weight) : null,
      goal: goals,
      training_focus: [],
      activity_level: activityLevel || null,
      data_sources: dataSources,
      target_weight: targetWeight ? parseFloat(targetWeight) : null,
      protein_target: proteinTarget ? parseInt(proteinTarget) : null,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
      target_body_fat: targetBodyFat ? parseFloat(targetBodyFat) : null,
      onboarding_completed: true,
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload as any)
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save profile");
      return;
    }

    queryClient.setQueryData(["profile-onboarding", user.id], (prev: any) => ({
      ...prev,
      ...payload,
      onboarding_completed: true,
    }));
    queryClient.setQueryData(["profile", user.id], (prev: any) => ({
      ...prev,
      ...payload,
      onboarding_completed: true,
    }));

    navigate("/", { replace: true });
  };

  const next = () => {
    if (step === totalSteps - 1) {
      handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const ProgressBar = () => (
    <div className="flex gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= step ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );

  // Completion screen
  if (step === totalSteps) {
    return (
      <div className="max-w-md mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-7 h-7 text-primary" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">You're all set</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto mb-8">
            StriveHub will now tailor your daily guidance, scores, and insights to your profile and goals.
          </p>
          <button
            onClick={() => {
              queryClient.setQueryData(["profile-onboarding", user?.id], (prev: any) => ({
                ...prev,
                onboarding_completed: true,
              }));
              queryClient.setQueryData(["profile", user?.id], (prev: any) => ({
                ...prev,
                onboarding_completed: true,
              }));
              navigate("/", { replace: true });
            }}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-transform active:scale-[0.98]"
          >
            Open my plan
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-14 pb-10 min-h-screen flex flex-col">
      {step > 0 && (
        <div className="mb-6">
          <ProgressBar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Step 0: Intro */}
          {step === 0 && (
            <motion.div key="intro" {...fade} className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Let's personalize StriveHub</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mb-2">
                Answer a few quick questions so your recovery, training, cardio, and nutrition guidance fits you better.
              </p>
              <p className="text-[11px] text-muted-foreground/60 mb-8">Takes less than 1 minute</p>
              <button
                onClick={next}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-transform active:scale-[0.98]"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 1: Basics */}
          {step === 1 && (
            <motion.div key="basics" {...fade} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">About you</h2>
                <p className="text-sm text-muted-foreground mt-1">Basic info for personalized guidance</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sex</label>
                  <div className="flex gap-2">
                    {SEX_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSex(s)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          sex === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Body fat % <span className="normal-case tracking-normal font-normal text-muted-foreground/50">(optional)</span></label>
                  <Input value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="%" type="number" className="rounded-xl" />
                  <p className="text-[11px] text-muted-foreground/60">
                    {sex === "Female" ? "Healthy range for women: 20–30%" : "Healthy range for men: 10–20%"}. Athletes are typically lower.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <motion.div key="goal" {...fade} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Main goals</h2>
                <p className="text-sm text-muted-foreground mt-1">Tap in order of priority</p>
              </div>
              <div className="space-y-2">
                {GOALS.map((g) => {
                  const rank = goals.indexOf(g);
                  const isSelected = rank !== -1;
                  return (
                    <button
                      key={g}
                      onClick={() => setGoals(isSelected ? goals.filter((v) => v !== g) : [...goals, g])}
                      className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-colors flex items-center justify-between ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
                      }`}
                    >
                      {g}
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                          {rank + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {goals.length > 0 && (
                <p className="text-[11px] text-muted-foreground/60">
                  #{1} = top priority. Tap again to remove.
                </p>
              )}
            </motion.div>
          )}


          {/* Step 3: Activity level */}
          {step === 3 && (
            <motion.div key="activity" {...fade} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Training frequency</h2>
                <p className="text-sm text-muted-foreground mt-1">How often do you train?</p>
              </div>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setActivityLevel(a)}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-colors ${
                      activityLevel === a
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Data sources & connections */}
          {step === 4 && (
            <motion.div key="sources" {...fade} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Connect your data</h2>
                <p className="text-sm text-muted-foreground mt-1">Import existing data so your Home is personalized from day one.</p>
              </div>

              {/* Import Strong data */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Import workout history</p>
                <label
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                    csvFile
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileUp className={`w-4 h-4 ${csvFile ? "text-primary-foreground/70" : "text-muted-foreground"}`} strokeWidth={1.8} />
                    <div>
                      <p className="font-medium">{csvFile ? csvFile.name : "Import from Strong App"}</p>
                      <p className={`text-[11px] mt-0.5 ${csvFile ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {csvFile ? `${(csvFile.size / 1024).toFixed(0)} KB — ready to import` : "Tap to select your CSV export"}
                      </p>
                    </div>
                  </div>
                  {csvFile ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4 text-muted-foreground/50" />}
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCsvFile(file);
                        if (!dataSources.includes("Strong App CSV")) {
                          setDataSources([...dataSources, "Strong App CSV"]);
                        }
                        toast.success("CSV selected — it will be imported after setup");
                      }
                    }}
                  />
                </label>
              </div>

              {/* Device connections */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Device connections</p>
                {[
                  { name: "Garmin", desc: "Sync workouts, sleep & heart rate", soon: true },
                  { name: "Apple Health", desc: "Sync activity, sleep & vitals", soon: true },
                ].map((d) => (
                  <button
                    key={d.name}
                    onClick={() => !d.soon && setDataSources(toggleArray(dataSources, d.name))}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-colors flex items-center justify-between ${
                      dataSources.includes(d.name)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    } ${d.soon ? "opacity-60" : ""}`}
                  >
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className={`text-[11px] mt-0.5 ${dataSources.includes(d.name) ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{d.desc}</p>
                    </div>
                    {d.soon ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Soon</span>
                    ) : dataSources.includes(d.name) ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                  </button>
                ))}
              </div>

              {/* Manual */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Other</p>
                <button
                  onClick={() => setDataSources(toggleArray(dataSources, "Manual logging"))}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-colors flex items-center justify-between ${
                    dataSources.includes("Manual logging")
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <div>
                    <p className="font-medium">Manual logging</p>
                    <p className={`text-[11px] mt-0.5 ${dataSources.includes("Manual logging") ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Log workouts and meals manually</p>
                  </div>
                  {dataSources.includes("Manual logging") && <Check className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground/50 text-center">You can always connect more sources later in Settings.</p>
            </motion.div>
          )}

          {/* Step 5: Optional */}
          {step === 5 && (
            <motion.div key="optional" {...fade} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Optional details</h2>
                <p className="text-sm text-muted-foreground mt-1">These help improve your recommendations</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Target weight (kg)</label>
                  <Input value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="Optional" type="number" className="rounded-xl" />
                  <p className="text-[11px] text-muted-foreground/60">Healthy BMI range: 18.5–24.9. For a height of {height ? `${height} cm` : "175 cm"}, that's roughly {height ? `${Math.round(18.5 * (parseFloat(height)/100)**2)}–${Math.round(24.9 * (parseFloat(height)/100)**2)}` : "57–76"} kg.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Daily protein target (g)</label>
                  <Input value={proteinTarget} onChange={(e) => setProteinTarget(e.target.value)} placeholder="Optional" type="number" className="rounded-xl" />
                  <p className="text-[11px] text-muted-foreground/60">Research suggests 1.6–2.2 g/kg body weight for active adults. {weight ? `For you, that's roughly ${Math.round(parseFloat(weight) * 1.6)}–${Math.round(parseFloat(weight) * 2.2)} g/day.` : ""}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Target body fat %</label>
                  <Input value={targetBodyFat} onChange={(e) => setTargetBodyFat(e.target.value)} placeholder="Optional" type="number" className="rounded-xl" />
                  <p className="text-[11px] text-muted-foreground/60">
                    {sex === "Female" ? "Athletic: 14–20% · Fit: 21–24% · Average: 25–31%" : "Athletic: 6–13% · Fit: 14–17% · Average: 18–24%"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step > 0 && step < totalSteps && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={back}
            className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={!canProceed() && step !== 5 && step !== 6}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === totalSteps - 1 ? (
              <>Complete</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
