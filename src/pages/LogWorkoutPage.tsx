import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AIChatScreen from "@/components/AIChatScreen";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

type Exercise = { name: string; sets: string; reps: string; weight: string };

const emptyExercise = (): Exercise => ({ name: "", sets: "", reps: "", weight: "" });

const feedbackMessages = [
  "Nice — consistency matters 💪",
  "Great work today!",
  "You're building momentum 🔥",
  "One step closer to your goal",
];

const LogWorkoutPage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise()]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAI, setShowAI] = useState(false);

  const updateExercise = (i: number, field: keyof Exercise, value: string) => {
    const updated = [...exercises];
    updated[i] = { ...updated[i], [field]: value };
    setExercises(updated);
  };

  const addExercise = () => setExercises([...exercises, emptyExercise()]);
  const removeExercise = (i: number) => {
    if (exercises.length > 1) setExercises(exercises.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    const msg = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    toast.success(msg);
    navigate("/workout");
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Log Workout</h1>
      </motion.div>

      {/* Date */}
      <motion.div {...fade(1)}>
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl mt-1.5" />
      </motion.div>

      {/* Exercises */}
      {exercises.map((ex, i) => (
        <motion.div key={i} {...fade(i + 2)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Exercise {i + 1}</span>
            {exercises.length > 1 && (
              <button onClick={() => removeExercise(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Input placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} className="rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Sets" type="number" value={ex.sets} onChange={(e) => updateExercise(i, "sets", e.target.value)} className="rounded-xl" />
            <Input placeholder="Reps" type="number" value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} className="rounded-xl" />
            <Input placeholder="Weight" type="number" value={ex.weight} onChange={(e) => updateExercise(i, "weight", e.target.value)} className="rounded-xl" />
          </div>
        </motion.div>
      ))}

      {/* Add exercise */}
      <button
        onClick={addExercise}
        className="w-full py-3 rounded-2xl border border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add another exercise
      </button>

      {/* AI option */}
      <button onClick={() => setShowAI(true)} className="w-full py-2.5 text-sm text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground transition-colors">
        <Sparkles className="w-4 h-4" /> Describe workout with AI
      </button>

      {showAI && <AIChatScreen context="workout" onClose={() => setShowAI(false)} />}

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-transform active:scale-[0.98]"
      >
        Save workout
      </button>
    </div>
  );
};

export default LogWorkoutPage;
