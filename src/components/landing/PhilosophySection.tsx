import { motion } from "framer-motion";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const PhilosophySection = () => (
  <section className="py-20 md:py-28" style={{ background: "#F7F8FA" }}>
    <div className="max-w-3xl mx-auto px-5 text-center">
      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold tracking-tight mb-5" style={{ color: "#2F3437" }}>
        Fitness guidance for people who already care
      </motion.h2>
      <motion.p {...fade(1)} className="text-base leading-relaxed mb-6" style={{ color: "#6B7378" }}>
        StriveHub is built for people who already care about their health and performance, but are tired of piecing together recovery, training, cardio, and nutrition across multiple apps and devices.
      </motion.p>
    </div>
  </section>
);

export default PhilosophySection;
