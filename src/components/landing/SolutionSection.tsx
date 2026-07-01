import { motion } from "framer-motion";
import { Compass, BarChart2, Zap } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const cards = [
  { icon: Compass, title: "Daily direction", desc: "Get one clear recommendation based on how your body is doing today." },
  { icon: BarChart2, title: "Personalized guidance", desc: "See what matters today based on your goals, training, recovery, and habits." },
  { icon: Zap, title: "Actionable guidance", desc: "Not more dashboards. Not more guesswork. Just the next best step." },
];

const goals = [
  { label: "Recovery",  value: "7h 15m", sub: "last night",  color: "#594CF7" },
  { label: "Nutrition", value: "147g",   sub: "of 140g",     color: "#2FC7B5" },
  { label: "Strength",  value: "1 / 2",  sub: "sessions",    color: "#1291F3" },
  { label: "Cardio",    value: "2 / 2",  sub: "sessions",    color: "#FFB716" },
];

const SolutionSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#F7F8FA" }}>
    <div className="max-w-5xl mx-auto px-5">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-3" style={{ color: "#2F3437" }}>
        One app. One clear plan.
      </motion.h2>
      <motion.p {...fade(1)} className="text-center text-sm font-medium mb-2" style={{ color: "#4CAF84" }}>
        From fragmented inputs → to one clear next step
      </motion.p>
      <motion.p {...fade(1)} className="text-center text-base max-w-xl mx-auto mb-12" style={{ color: "#6B7378" }}>
        StriveHub combines your recovery, training, cardio, and nutrition into a simple daily recommendation you can actually follow.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} {...fade(i + 2)} className="rounded-2xl p-6 bg-white border shadow-sm" style={{ borderColor: "#ECEEF0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#E8F5EE" }}>
                <Icon className="w-5 h-5" style={{ color: "#4CAF84" }} strokeWidth={1.8} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "#2F3437" }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7378" }}>{c.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...fade(5)} className="flex justify-center gap-4 flex-wrap">
        {goals.map((g) => (
          <div key={g.label} className="rounded-2xl p-5 w-[140px] bg-white border shadow-sm text-center" style={{ borderColor: "#ECEEF0" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#6B7378" }}>{g.label}</p>
            <p className="text-2xl font-bold leading-tight" style={{ color: g.color }}>{g.value}</p>
            <p className="text-xs mt-1" style={{ color: "#9CA3A8" }}>{g.sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SolutionSection;
