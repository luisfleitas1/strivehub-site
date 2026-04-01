import { motion } from "framer-motion";
import { BedDouble, Dumbbell, Activity, UtensilsCrossed } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const features = [
  { icon: BedDouble, title: "Recovery", desc: "Know when to push and when to pull back based on sleep, HRV, and readiness trends.", color: "#7B61FF", bg: "rgba(123,97,255,0.08)" },
  { icon: Dumbbell, title: "Strength", desc: "See whether your training is building momentum or needs adjustment.", color: "#4CAF84", bg: "rgba(76,175,132,0.08)" },
  { icon: Activity, title: "Cardio", desc: "Stay consistent and improve endurance without overcomplicating your week.", color: "#4A90E2", bg: "rgba(74,144,226,0.08)" },
  { icon: UtensilsCrossed, title: "Nutrition", desc: "Get simple guidance that helps you stay on track without calorie obsession.", color: "#F5A623", bg: "rgba(245,166,35,0.08)" },
];

const FeaturesSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#F7F8FA" }}>
    <div className="max-w-5xl mx-auto px-5">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-14" style={{ color: "#2F3437" }}>
        Built to help you improve, not just track
      </motion.h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.title} {...fade(i + 1)} className="rounded-2xl p-6 bg-white border shadow-sm" style={{ borderColor: "#ECEEF0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                <Icon className="w-5 h-5" style={{ color: f.color }} strokeWidth={1.8} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "#2F3437" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7378" }}>{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
