import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, Camera, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

type Filter = "all" | "workouts" | "meals" | "cardio";

const mockHistory = [
  { type: "workouts" as const, label: "Bench Press – 85kg", date: "Mar 28", icon: Dumbbell, color: "text-primary" },
  { type: "meals" as const, label: "Lunch – Chicken & Rice", date: "Mar 28", icon: Camera, color: "text-coach-amber" },
  { type: "cardio" as const, label: "Run – 5.2km, 32min", date: "Mar 27", icon: Heart, color: "text-coach-rose" },
  { type: "workouts" as const, label: "Squat – 110kg", date: "Mar 27", icon: Dumbbell, color: "text-primary" },
  { type: "meals" as const, label: "Dinner – Salmon & Veggies", date: "Mar 27", icon: Camera, color: "text-coach-amber" },
  { type: "workouts" as const, label: "Deadlift – 130kg", date: "Mar 26", icon: Dumbbell, color: "text-primary" },
  { type: "cardio" as const, label: "Bike – 12km, 40min", date: "Mar 26", icon: Heart, color: "text-coach-rose" },
];

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "workouts", label: "Workouts" },
  { value: "meals", label: "Meals" },
  { value: "cardio", label: "Cardio" },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? mockHistory : mockHistory.filter((h) => h.type === filter);

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade(1)} className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              {...fade(i + 2)}
              className="bg-card rounded-xl p-3.5 border border-border flex items-center gap-3"
            >
              <Icon className={`w-4.5 h-4.5 ${item.color} shrink-0`} strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{item.date}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
