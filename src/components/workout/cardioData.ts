export type Timeframe = "7d" | "30d" | "90d" | "1y";

export const generateCardioFrequencyData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    sessions: Math.floor(1 + Math.random() * 4),
  }));
};

export const generateCardioDurationData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    minutes: Math.round(20 + Math.random() * 60),
  }));
};

export const generateCardioDistanceData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    distance: Math.round((3 + Math.random() * 8) * 10) / 10,
  }));
};

export const generateCardioPaceData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    pace: Math.round((6.5 - i * 0.05 + Math.random() * 0.4) * 10) / 10,
  }));
};

export const generateVo2MaxData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    vo2max: Math.round((45 + i * 0.3 + Math.random() * 1.5) * 10) / 10,
  }));
};

export const generateSleepData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    hours: Math.round((6.5 + Math.random() * 2) * 10) / 10,
  }));
};

export const generateHrvData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    hrv: Math.round(45 + Math.random() * 25),
  }));
};

export const generateRestingHrData = (tf: Timeframe) => {
  const points = tf === "7d" ? 7 : tf === "30d" ? 4 : tf === "90d" ? 12 : 12;
  return Array.from({ length: points }, (_, i) => ({
    label: tf === "7d" ? `D${i + 1}` : tf === "1y" ? `M${i + 1}` : `W${i + 1}`,
    rhr: Math.round(56 + Math.random() * 8),
  }));
};

export const mockCardioHistory = [
  { id: "c1", type: "Run", distance: "5 km", duration: "28 min", date: "Mar 28" },
  { id: "c2", type: "Bike", distance: "15 km", duration: "45 min", date: "Mar 27" },
  { id: "c3", type: "Run", distance: "3.2 km", duration: "18 min", date: "Mar 25" },
  { id: "c4", type: "Walk", distance: "4 km", duration: "40 min", date: "Mar 23" },
  { id: "c5", type: "Run", distance: "7 km", duration: "38 min", date: "Mar 21" },
];
