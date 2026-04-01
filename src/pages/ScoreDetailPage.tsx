import { motion } from "framer-motion";
import { ArrowLeft, BedDouble, Heart, Activity, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import WorkoutChartTooltip from "@/components/workout/WorkoutChartTooltip";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.3 },
});

const scoreDetails: Record<string, {
  title: string;
  value: number;
  label: string;
  color: string;
  coachingLine: string;
  basis: string;
  factors: { name: string; bold: string; trend: string; icon: typeof Heart }[];
  improvements: string[];
  chartData: { label: string; value: number }[];
}> = {
  recovery: {
    title: "Recovery",
    value: 78,
    label: "Good",
    color: "text-coach-violet",
    coachingLine: "Your body is ready for training",
    basis: "Based on sleep, HRV, and resting heart rate",
    factors: [
      { name: "Sleep averaging ", bold: "7h 15m", trend: "Stable", icon: BedDouble },
      { name: "HRV ", bold: "↑ +8%", trend: "Improving", icon: Heart },
      { name: "Resting HR at ", bold: "58 bpm", trend: "Good", icon: Activity },
    ],
    improvements: [
      "Aim for +30–45 min sleep tonight",
      "Keep training intensity moderate today",
      "Try a 10-min wind-down before bed",
    ],
    chartData: Array.from({ length: 7 }, (_, i) => ({
      label: ["M", "T", "W", "T", "F", "S", "S"][i],
      value: Math.round(70 + Math.random() * 15),
    })),
  },
  strength: {
    title: "Strength",
    value: 82,
    label: "Good",
    color: "text-primary",
    coachingLine: "You're building strong momentum",
    basis: "Based on consistency, overload, and volume",
    factors: [
      { name: "Sessions this week: ", bold: "4 of 4", trend: "Good", icon: Activity },
      { name: "Bench press ", bold: "↑ +5%", trend: "Improving", icon: TrendingUp },
      { name: "Volume ", bold: "↑ +12%", trend: "Improving", icon: Activity },
    ],
    improvements: [
      "Maintain 4 sessions per week",
      "Increase load slightly on key lifts",
      "Prioritize compound movements",
    ],
    chartData: Array.from({ length: 7 }, (_, i) => ({
      label: ["M", "T", "W", "T", "F", "S", "S"][i],
      value: Math.round(75 + Math.random() * 12),
    })),
  },
  cardio: {
    title: "Cardio",
    value: 61,
    label: "Needs improvement",
    color: "text-coach-blue",
    coachingLine: "You're close — consistency will unlock progress",
    basis: "Based on frequency, duration, and effort",
    factors: [
      { name: "Sessions this week: ", bold: "2 of 3", trend: "Needs improvement", icon: Activity },
      { name: "Avg duration ", bold: "32 min", trend: "Stable", icon: Activity },
      { name: "VO2 max at ", bold: "48", trend: "Stable", icon: Heart },
    ],
    improvements: [
      "Add 1 more session this week",
      "Focus on Zone 2 for 30–40 minutes",
      "Try a weekend run or bike ride",
    ],
    chartData: Array.from({ length: 7 }, (_, i) => ({
      label: ["M", "T", "W", "T", "F", "S", "S"][i],
      value: Math.round(55 + Math.random() * 15),
    })),
  },
  nutrition: {
    title: "Nutrition",
    value: 65,
    label: "Needs improvement",
    color: "text-accent",
    coachingLine: "You're on track, just slightly under target",
    basis: "Based on protein, meals, and balance",
    factors: [
      { name: "Protein: ", bold: "95g/day", trend: "Needs improvement", icon: Activity },
      { name: "Meals logged: ", bold: "3/day", trend: "Good", icon: Activity },
      { name: "Vegetables in ", bold: "4 of 7 days", trend: "Stable", icon: Activity },
    ],
    improvements: [
      "Increase protein by ~30g per day",
      "Add vegetables to at least 2 meals today",
      "Consider a high-protein snack between meals",
    ],
    chartData: Array.from({ length: 7 }, (_, i) => ({
      label: ["M", "T", "W", "T", "F", "S", "S"][i],
      value: Math.round(58 + Math.random() * 18),
    })),
  },
};

const trendStyle = (trend: string) => {
  switch (trend) {
    case "Good": return "bg-primary/[0.08] text-primary/70";
    case "Improving": return "bg-coach-violet/[0.08] text-coach-violet/70";
    case "Needs improvement": return "bg-accent/[0.08] text-accent/70";
    default: return "bg-muted/50 text-muted-foreground/50";
  }
};

const axisStyle = { fontSize: 9, fill: "hsl(var(--muted-foreground) / 0.4)" };

const ScoreDetailPage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const detail = scoreDetails[type || "recovery"];

  if (!detail) {
    navigate("/");
    return null;
  }

  const colorMap: Record<string, string> = {
    "text-coach-violet": "hsl(var(--coach-violet) / 0.6)",
    "text-primary": "hsl(var(--primary) / 0.6)",
    "text-coach-blue": "hsl(var(--coach-blue) / 0.6)",
    "text-accent": "hsl(var(--accent) / 0.6)",
  };
  const strokeColor = colorMap[detail.color] || "hsl(var(--primary) / 0.6)";
  const lastIdx = detail.chartData.length - 1;

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-2xl bg-muted/40 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-muted-foreground/70" />
        </button>
        <h1 className="text-base font-medium tracking-tight text-foreground/80">{detail.title}</h1>
      </motion.div>

      {/* Score hero */}
      <motion.div {...fade(1)} className="text-center mb-1 space-y-1">
        <p className={`text-7xl font-bold tracking-tighter ${detail.color}`}>{detail.value}</p>
        <p className="text-[11px] font-medium text-muted-foreground/55 uppercase tracking-[0.15em]">{detail.label}</p>
      </motion.div>

      {/* Coaching line */}
      <motion.div {...fade(2)} className="text-center mb-4">
        <p className="text-sm font-light text-foreground/50 leading-snug tracking-wide">{detail.coachingLine}</p>
      </motion.div>

      {/* Basis */}
      <motion.div {...fade(3)} className="mb-5">
        <p className="text-[10px] text-muted-foreground/30 text-center tracking-wide">{detail.basis}</p>
      </motion.div>

      {/* Key Factors */}
      <motion.div {...fade(4)} className="mb-5 space-y-2">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">Key Factors</h3>
        <div className="space-y-1">
          {detail.factors.map((f, i) => (
            <div key={i} className="bg-card/40 rounded-xl px-3.5 py-3 border border-border/20 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                <f.icon className="w-3 h-3 text-muted-foreground/30" strokeWidth={1.4} />
              </div>
              <p className="flex-1 min-w-0 text-[12.5px] text-foreground/60 leading-snug">
                {f.name}<span className="font-semibold text-foreground/80">{f.bold}</span>
              </p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${trendStyle(f.trend)}`}>
                {f.trend}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div {...fade(5)} className="mb-5">
        <div className="h-px bg-border/15" />
      </motion.div>

      {/* How to Improve */}
      <motion.div {...fade(5)} className="mb-5 space-y-2">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">How to improve</h3>
        <div className="space-y-1.5">
          {detail.improvements.map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 px-1">
              <span className="mt-[6px] w-1 h-1 rounded-full bg-foreground/20 shrink-0" />
              <p className="text-[12.5px] font-normal text-foreground/65 leading-snug">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trend Chart */}
      <motion.div {...fade(6)} className="bg-card/30 rounded-2xl p-4 border border-border/15 space-y-3">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">Last 7 days</h3>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={detail.chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border) / 0.2)" vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} domain={[0, 100]} />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={1.5}
                dot={(props: any) => {
                  if (props.index === lastIdx) {
                    return (
                      <circle
                        key={props.index}
                        cx={props.cx}
                        cy={props.cy}
                        r={3.5}
                        fill={strokeColor}
                        stroke="hsl(var(--card))"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={0} />;
                }}
                activeDot={{ r: 3.5, fill: strokeColor, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreDetailPage;
