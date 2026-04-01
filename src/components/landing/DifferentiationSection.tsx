import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const points = [
  "Tracking everything",
  "Understanding nothing",
  "Guessing every day",
];

const DifferentiationSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#fff" }}>
    <div className="max-w-3xl mx-auto px-5 text-center">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: "#2F3437" }}>
        Not another tracker
      </motion.h2>
      <motion.p {...fade(1)} className="text-base leading-relaxed mb-4" style={{ color: "#6B7378" }}>
        Garmin gives you metrics. MyFitnessPal gives you logging. Whoop gives you recovery data. <span className="font-semibold" style={{ color: "#2F3437" }}>StriveHub gives you a decision.</span>
      </motion.p>
      <motion.p {...fade(1)} className="text-sm font-medium mb-10" style={{ color: "#2F3437" }}>
        Built for people who are tired of:
      </motion.p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {points.map((p, i) => (
          <motion.div key={p} {...fade(i + 2)} className="rounded-2xl px-6 py-4 border" style={{ background: "#FAFBFC", borderColor: "#ECEEF0" }}>
            <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#2F3437" }}>
              <ArrowRight className="w-4 h-4" style={{ color: "#4CAF84" }} /> {p}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DifferentiationSection;
