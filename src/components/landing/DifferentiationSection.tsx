import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const points = [
  "One source of truth for your fitness inputs",
  "One clear recommendation for today",
  "One system that helps the pieces work together",
];

const available = ["Apple Health", "Strava", "Strong", "AI Meal Logging"];
const upcoming = ["Garmin", "Whoop", "MyFitnessPal", "Oura"];

const DifferentiationSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#fff" }}>
    <div className="max-w-3xl mx-auto px-5 text-center">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: "#2F3437" }}>
        Not another tracker
      </motion.h2>
      <motion.p {...fade(1)} className="text-base leading-relaxed mb-4" style={{ color: "#6B7378" }}>
        Your data already lives in different apps. <span className="font-semibold" style={{ color: "#2F3437" }}>StriveHub brings it together and tells you what matters today.</span>
      </motion.p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        {points.map((p, i) => (
          <motion.div key={p} {...fade(i + 2)} className="rounded-2xl px-6 py-4 border" style={{ background: "#FAFBFC", borderColor: "#ECEEF0" }}>
            <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#2F3437" }}>
              <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "#4CAF84" }} /> {p}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Integrations roadmap */}
      <motion.div {...fade(5)} className="mt-14 space-y-5">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#4CAF84" }}>Available today</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {available.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border" style={{ background: "#E8F5EE", borderColor: "#C7E6D4", color: "#2F3437" }}>
                <Check className="w-3 h-3" style={{ color: "#4CAF84" }} /> {a}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3A8" }}>Coming soon</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {upcoming.map((u) => (
              <span key={u} className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium border" style={{ background: "#FAFBFC", borderColor: "#ECEEF0", color: "#6B7378" }}>
                {u}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DifferentiationSection;
