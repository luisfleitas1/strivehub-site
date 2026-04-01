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
  { icon: BarChart2, title: "Personalized scoring", desc: "Understand your recovery, strength, cardio, and nutrition at a glance." },
  { icon: Zap, title: "Simple, actionable guidance", desc: "No bloated dashboards. No overthinking. Just the next best step." },
];

const scores = [
  { label: "Recovery", value: 78, color: "#7B61FF" },
  { label: "Strength", value: 82, color: "#4CAF84" },
  { label: "Cardio", value: 61, color: "#4A90E2" },
  { label: "Nutrition", value: 65, color: "#F5A623" },
];

const SolutionSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#F7F8FA" }}>
    <div className="max-w-5xl mx-auto px-5">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-3" style={{ color: "#2F3437" }}>
        One app. One clear plan.
      </motion.h2>
      <motion.p {...fade(1)} className="text-center text-sm font-medium mb-2" style={{ color: "#4CAF84" }}>
        From scattered data → to one clear decision
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

      {/* Score cards visual */}
      <motion.div {...fade(5)} className="flex justify-center gap-4 flex-wrap">
        {scores.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 w-[140px] bg-white border shadow-sm text-center" style={{ borderColor: "#ECEEF0" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#6B7378" }}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SolutionSection;
