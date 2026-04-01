import { useState } from "react";
import { motion } from "framer-motion";
import { Beef, Wind, Moon, Droplets, Lightbulb, BedDouble, Activity, Heart } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { generateSleepData, generateHrvData, generateRestingHrData, type Timeframe } from "@/components/workout/cardioData";
import WorkoutChartTooltip from "@/components/workout/WorkoutChartTooltip";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const coachingInsights = [
  {
    icon: Beef,
    title: "Increase protein intake",
    desc: "Your average is 95g/day — aim for 130g to support muscle recovery. Add a protein source at breakfast.",
    color: "text-accent",
    bg: "bg-accent/8",
  },
  {
    icon: Wind,
    title: "Add more Zone 2 training",
    desc: "Only 1 easy cardio session last week. Two 30-min sessions at 130–145 bpm will improve aerobic base.",
    color: "text-coach-blue",
    bg: "bg-coach-blue/8",
  },
  {
    icon: Moon,
    title: "Prioritize sleep on training days",
    desc: "Sleep drops to 6.5h on heavy training days. Aim for 7.5h+ to maximize strength gains.",
    color: "text-coach-violet",
    bg: "bg-coach-violet/8",
  },
  {
    icon: Droplets,
    title: "Stay hydrated during long runs",
    desc: "Heart rate spikes in the last 15 min of your runs suggest dehydration. Try 200ml every 20 min.",
    color: "text-coach-blue",
    bg: "bg-coach-blue/8",
  },
];

const recoveryInsights = [
  "Sleep dropped this week — consider a lighter workout day",
  "Good recovery — suitable for higher intensity training",
  "Consistent sleep is supporting your strength progress",
];

const timeframes: { value: Timeframe; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

const hasData = true;

const InsightsPage = () => {
  const [sleepTimeframe, setSleepTimeframe] = useState<Timeframe>("7d");
  const sleepData = generateSleepData(sleepTimeframe);
  const avgSleep = (sleepData.reduce((s, d) => s + d.hours, 0) / sleepData.length);
  const avgHours = Math.floor(avgSleep);
  const avgMins = Math.round((avgSleep - avgHours) * 60);
  const daysOver7 = sleepData.filter((d) => d.hours >= 7).length;
  const hrvData = generateHrvData(sleepTimeframe);
  const rhrData = generateRestingHrData(sleepTimeframe);

  if (!hasData) {
    return (
      <div className="max-w-md mx-auto px-5 pt-14 pb-28 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <motion.div {...fade(0)}>
          <div className="w-16 h-16 rounded-full bg-coach-blue/10 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-7 h-7 text-coach-blue" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold">Insights coming soon</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Log a few workouts or meals to unlock insights
          </p>
        </motion.div>
      </div>
    );
  }

  const axisStyle = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };
  const gridStroke = "hsl(var(--border))";

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)}>
        <p className="text-muted-foreground text-sm font-medium">Your Coach</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Insights</h1>
      </motion.div>

      {/* Coaching Insights */}
      <div className="space-y-3">
        {coachingInsights.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              {...fade(i + 1)}
              className="bg-card rounded-2xl p-5 border border-border space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${item.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recovery Section */}
      <motion.div {...fade(5)}>
        <h2 className="text-lg font-semibold tracking-tight mb-3">Recovery</h2>
      </motion.div>

      {/* Sleep Summary */}
      <motion.div {...fade(6)} className="bg-card rounded-2xl p-4 border border-border space-y-2">
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-coach-violet" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Sleep Summary</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{avgHours}h {avgMins}m</p>
          <span className="text-xs text-muted-foreground">avg / night</span>
        </div>
        <p className="text-xs text-muted-foreground">Consistent sleep this week</p>
        <p className="text-[10px] text-muted-foreground/60">Data from Garmin / Apple Health</p>
      </motion.div>

      {/* Sleep Timeframe */}
      <motion.div {...fade(7)} className="flex gap-1.5">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setSleepTimeframe(tf.value)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              sleepTimeframe === tf.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </motion.div>

      {/* Sleep Chart */}
      <motion.div {...fade(8)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-coach-violet" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Sleep Trend</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={28} unit="h" domain={[5, 10]} />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Bar dataKey="hours" fill="hsl(var(--coach-violet))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sleep Consistency */}
      <motion.div {...fade(9)} className="bg-muted rounded-2xl p-4">
        <p className="text-sm text-foreground">
          You slept 7+ hours on <span className="font-semibold">{daysOver7} of the last {sleepData.length} days</span>
        </p>
      </motion.div>

      {/* HRV Trend */}
      <motion.div {...fade(10)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-coach-rose" strokeWidth={1.8} />
            <h3 className="text-sm font-semibold">HRV Trend</h3>
          </div>
          <span className="text-[10px] text-muted-foreground/60">Garmin / Apple Health</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hrvData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={28} unit="ms" />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line type="monotone" dataKey="hrv" stroke="hsl(var(--coach-rose))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--coach-rose))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Resting Heart Rate */}
      <motion.div {...fade(11)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" strokeWidth={1.8} />
            <h3 className="text-sm font-semibold">Resting Heart Rate</h3>
          </div>
          <span className="text-[10px] text-muted-foreground/60">Garmin / Apple Health</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rhrData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} unit=" bpm" />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line type="monotone" dataKey="rhr" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--accent))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recovery Insights */}
      <motion.div {...fade(12)} className="space-y-2">
        {recoveryInsights.map((insight, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InsightsPage;
