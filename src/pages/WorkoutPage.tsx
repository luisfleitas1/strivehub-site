import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Dumbbell, Plus, ChevronRight, Calendar, Activity, X, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import CardioTrends from "@/components/workout/CardioTrends";
import WorkoutChartTooltip from "@/components/workout/WorkoutChartTooltip";
import { mockCardioHistory, type Timeframe } from "@/components/workout/cardioData";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

type Tab = "trends" | "history";
type TrendsMode = "strength" | "cardio";

const timeframes: { value: Timeframe; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

const exercises = ["Bench Press", "Squat", "Deadlift"];

const generateStrengthData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 8 : tf === "90d" ? 12 : 12;
  const base: Record<string, number> = { "Bench Press": 70, Squat: 90, Deadlift: 110 };
  return exercises.reduce((acc, ex) => {
    acc[ex] = Array.from({ length: points }, (_, i) => ({
      week: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
      weight: Math.round(base[ex] + i * (2 + Math.random() * 2)),
    }));
    return acc;
  }, {} as Record<string, { week: string; weight: number }[]>);
};

const generateVolumeData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    volume: Math.round(3000 + Math.random() * 4000),
  }));
};

const generateFrequencyData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    count: Math.floor(2 + Math.random() * 4),
  }));
};

const mockStrengthHistory = [
  { id: "1", title: "Upper Body", exercises: 5, date: "Mar 28", detail: "Bench 85kg, OHP 50kg, Rows 70kg" },
  { id: "2", title: "Leg Day", exercises: 4, date: "Mar 26", detail: "Squat 110kg, Leg press 160kg" },
  { id: "3", title: "Pull Day", exercises: 5, date: "Mar 24", detail: "Deadlift 130kg, Pull-ups, Curls" },
  { id: "4", title: "Push Day", exercises: 4, date: "Mar 22", detail: "Bench 82kg, Dips, Lateral raises" },
  { id: "5", title: "Full Body", exercises: 6, date: "Mar 20", detail: "Squat 105kg, Bench 80kg, Rows" },
  { id: "6", title: "Upper Body", exercises: 5, date: "Mar 18", detail: "OHP 48kg, Bench 80kg, Rows 68kg" },
];

const hasData = true;

const axisStyle = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };
const gridStroke = "hsl(var(--border))";

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("trends");
  const [trendsMode, setTrendsMode] = useState<TrendsMode>("strength");
  const [timeframe, setTimeframe] = useState<Timeframe>("90d");
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");
  const [showLogMenu, setShowLogMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowLogMenu(false);
    };
    if (showLogMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLogMenu]);

  const strengthData = generateStrengthData(timeframe);
  const volumeData = generateVolumeData(timeframe);
  const frequencyData = generateFrequencyData(timeframe);

  if (!hasData) {
    return (
      <div className="max-w-md mx-auto px-5 pt-14 pb-28 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <motion.div {...fade(0)}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold">No workouts yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">Log workouts to see your progress over time</p>
          <button onClick={() => navigate("/log-workout")} className="mt-4 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">
            Log first workout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-5">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Progress</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Workouts</h1>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLogMenu(!showLogMenu)}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
          >
            {showLogMenu ? <X className="w-4.5 h-4.5" /> : <Plus className="w-4.5 h-4.5" />}
          </button>
          <AnimatePresence>
            {showLogMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]"
              >
                <button
                  onClick={() => { setShowLogMenu(false); navigate("/log-workout"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Dumbbell className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  Strength
                </button>
                <button
                  onClick={() => { setShowLogMenu(false); navigate("/log-cardio"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors border-t border-border"
                >
                  <Footprints className="w-4 h-4 text-accent" strokeWidth={1.8} />
                  Cardio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Segmented Control: Trends / History */}
      <motion.div {...fade(1)} className="flex bg-muted rounded-xl p-1">
        {(["trends", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "trends" ? "Trends" : "History"}
          </button>
        ))}
      </motion.div>

      {tab === "trends" ? (
        <>
          {/* Strength / Cardio Toggle */}
          <motion.div {...fade(1.5)} className="flex bg-muted rounded-xl p-1">
            {(["strength", "cardio"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTrendsMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  trendsMode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "strength" ? <Dumbbell className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                {m === "strength" ? "Strength" : "Cardio"}
              </button>
            ))}
          </motion.div>

          {trendsMode === "strength" ? (
            <>
              {/* Timeframe */}
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

              {/* Strength Progression */}
              <motion.div {...fade(3)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.8} />
                    <h3 className="text-sm font-semibold">Strength Progression</h3>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {exercises.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setSelectedExercise(ex)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                        selectedExercise === ex ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strengthData[selectedExercise]}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} unit=" kg" />
                      <Tooltip content={<WorkoutChartTooltip />} />
                      <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Weekly Volume */}
              <motion.div {...fade(4)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-coach-blue" strokeWidth={1.8} />
                  <h3 className="text-sm font-semibold">Weekly Volume</h3>
                </div>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
                      <Tooltip content={<WorkoutChartTooltip />} />
                      <Bar dataKey="volume" fill="hsl(var(--coach-blue))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Workout Frequency */}
              <motion.div {...fade(5)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" strokeWidth={1.8} />
                  <h3 className="text-sm font-semibold">Workout Frequency</h3>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                      <Tooltip content={<WorkoutChartTooltip />} />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          ) : (
            <CardioTrends timeframe={timeframe} setTimeframe={setTimeframe} />
          )}
        </>
      ) : (
        /* History */
        <motion.div {...fade(2)} className="space-y-2">
          {/* Strength History */}
          {mockStrengthHistory.map((item) => (
            <button
              key={item.id}
              className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center gap-3 hover:border-primary/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}

          {/* Cardio History */}
          {mockCardioHistory.map((item) => (
            <button
              key={item.id}
              className="w-full bg-card rounded-xl p-4 border border-border text-left flex items-center gap-3 hover:border-primary/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-accent" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.type}</p>
                <p className="text-xs text-muted-foreground truncate">{item.distance} · {item.duration}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutPage;
