import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const cardioTypes = ["Run", "Bike", "Walk", "Swim"];
const feedbackMessages = [
  "Great cardio session! 🏃",
  "Your aerobic base is growing",
  "Consistency is key — nice work",
];

const LogCardioPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("Run");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
        <h1 className="text-2xl font-semibold tracking-tight">Log Cardio</h1>
      </motion.div>

      {/* Type */}
      <motion.div {...fade(1)} className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Type</label>
        <div className="flex gap-2">
          {cardioTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                type === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Fields */}
      <motion.div {...fade(2)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Duration</label>
            <Input placeholder="minutes" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Distance</label>
            <Input placeholder="km" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Heart rate (optional)</label>
          <Input placeholder="avg bpm" type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} className="rounded-xl" />
        </div>
      </motion.div>

      {/* Save */}
      <motion.div {...fade(3)}>
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-transform active:scale-[0.98]"
        >
          Save cardio
        </button>
      </motion.div>
    </div>
  );
};

export default LogCardioPage;
