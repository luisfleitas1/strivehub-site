import { motion } from "framer-motion";
import { Activity, Clock, MapPin, Zap, Heart } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import WorkoutChartTooltip from "./WorkoutChartTooltip";
import {
  type Timeframe,
  generateCardioFrequencyData,
  generateCardioDurationData,
  generateCardioDistanceData,
  generateCardioPaceData,
  generateVo2MaxData,
} from "./cardioData";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const timeframes: { value: Timeframe; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

interface CardioTrendsProps {
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
}

const CardioTrends = ({ timeframe, setTimeframe }: CardioTrendsProps) => {
  const freqData = generateCardioFrequencyData(timeframe);
  const durationData = generateCardioDurationData(timeframe);
  const distanceData = generateCardioDistanceData(timeframe);
  const paceData = generateCardioPaceData(timeframe);
  const vo2Data = generateVo2MaxData(timeframe);

  const totalSessions = freqData.reduce((s, d) => s + d.sessions, 0);
  const totalMinutes = durationData.reduce((s, d) => s + d.minutes, 0);

  const axisStyle = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };
  const gridStroke = "hsl(var(--border))";

  return (
    <>
      {/* Timeframe */}
      <motion.div {...fade(0)} className="flex gap-1.5">
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

      {/* Summary Card */}
      <motion.div {...fade(1)} className="bg-card rounded-2xl p-4 border border-border space-y-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Cardio Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Sessions</p>
            <p className="text-lg font-semibold mt-0.5">{totalSessions}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Total</p>
            <p className="text-lg font-semibold mt-0.5">{totalMinutes} min</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Consistency improving compared to last week</p>
      </motion.div>

      {/* Cardio Frequency */}
      <motion.div {...fade(2)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Cardio Frequency</h3>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={freqData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Duration Trend */}
      <motion.div {...fade(3)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-coach-blue" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Total Duration</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} unit=" m" />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Bar dataKey="minutes" fill="hsl(var(--coach-blue))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Distance Trend */}
      <motion.div {...fade(4)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Distance Trend</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} unit=" km" />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line type="monotone" dataKey="distance" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--accent))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pace Trend */}
      <motion.div {...fade(5)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-coach-violet" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">Pace Trend</h3>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} unit=" m/k" reversed />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line type="monotone" dataKey="pace" stroke="hsl(var(--coach-violet))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--coach-violet))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* VO2 Max Summary */}
      <motion.div {...fade(6)} className="bg-card rounded-2xl p-4 border border-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" strokeWidth={1.8} />
            <h3 className="text-sm font-semibold">VO2 Max</h3>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{vo2Data[vo2Data.length - 1]?.vo2max}</p>
          <span className="text-xs text-muted-foreground">ml/kg/min</span>
        </div>
        <p className="text-xs text-muted-foreground">Stable over the last 4 weeks</p>
        <p className="text-[10px] text-muted-foreground/60">Data from Garmin / Apple Health</p>
      </motion.div>

      {/* VO2 Max Chart */}
      <motion.div {...fade(7)} className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold">VO2 Max Trend</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vo2Data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip content={<WorkoutChartTooltip />} />
              <Line type="monotone" dataKey="vo2max" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--accent))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
};

export default CardioTrends;
