import { motion } from "framer-motion";
import { Link2, BarChart3, Target } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const steps = [
  { num: "1", icon: Link2, title: "Connect your data", desc: "Use Garmin, manual logs, or simple inputs to give StriveHub context." },
  { num: "2", icon: BarChart3, title: "Understand your body", desc: "Your recovery, strength, cardio, and nutrition are translated into a system you can actually use." },
  { num: "3", icon: Target, title: "Follow your plan", desc: "Open the app and instantly know what matters most today." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 md:py-28" style={{ background: "#fff" }}>
    <div className="max-w-5xl mx-auto px-5">
      <motion.p {...fade(0)} className="text-center text-sm font-medium mb-3" style={{ color: "#4CAF84" }}>
        From data → to direction
      </motion.p>
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-14" style={{ color: "#2F3437" }}>
        How StriveHub works
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.num} {...fade(i + 1)} className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #4CAF84, #3d9a72)" }}>
                <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4CAF84" }}>Step {s.num}</div>
              <h3 className="font-semibold text-lg" style={{ color: "#2F3437" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#6B7378" }}>{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
