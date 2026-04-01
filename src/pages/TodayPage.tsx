import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Camera, MessageCircle, Lightbulb, Plus, UtensilsCrossed, X, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const timelineItems = [
  { time: "7:30 AM", icon: MessageCircle, label: "Check-in", desc: "Feeling good, high energy", color: "text-coach-violet", bg: "bg-coach-violet/10" },
  { time: "8:15 AM", icon: Camera, label: "Breakfast", desc: "Oats, banana, protein shake", color: "text-coach-amber", bg: "bg-coach-amber/10" },
  { time: "10:00 AM", icon: Dumbbell, label: "Upper Body", desc: "Bench 85kg, OHP 50kg, Rows 70kg", color: "text-primary", bg: "bg-primary/10" },
  { time: "1:00 PM", icon: Camera, label: "Lunch", desc: "Chicken, rice, broccoli", color: "text-coach-amber", bg: "bg-coach-amber/10" },
  { time: "3:00 PM", icon: Lightbulb, label: "Insight", desc: "Protein on track — 95g so far today", color: "text-coach-blue", bg: "bg-coach-blue/10" },
];

const TodayPage = () => {
  const navigate = useNavigate();
  const [showLogMenu, setShowLogMenu] = useState(false);

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Timeline</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Today</h1>
        </div>
        <button
          onClick={() => setShowLogMenu(!showLogMenu)}
          className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
        >
          {showLogMenu ? <X className="w-4 h-4" /> : <Plus className="w-4.5 h-4.5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {showLogMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-3 overflow-hidden"
          >
            <button
              onClick={() => navigate("/log-workout")}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium">Strength</span>
            </button>
            <button
              onClick={() => navigate("/log-cardio")}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-coach-blue/10 hover:bg-coach-blue/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-coach-blue/15 flex items-center justify-center">
                <Footprints className="w-4 h-4 text-coach-blue" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium">Cardio</span>
            </button>
            <button
              onClick={() => navigate("/meal?tab=log")}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-coach-amber/10 hover:bg-coach-amber/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-coach-amber/15 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-coach-amber" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium">Meal</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        {timelineItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} {...fade(i + 1)} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.8} />
                </div>
                {i < timelineItems.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
              </div>
              <div className="pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.time}</p>
                <p className="text-sm font-medium mt-0.5">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayPage;
