import { motion } from "framer-motion";
import { BarChart3, Puzzle, HelpCircle } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const cards = [
  { icon: BarChart3, title: "Too much data", desc: "Sleep, HRV, workouts, calories — but no clear answer on what to do today." },
  { icon: Puzzle, title: "Too many disconnected tools", desc: "One app for lifting. Another for running. Another for nutrition. Nothing works together." },
  { icon: HelpCircle, title: "Too much guessing", desc: "You're left deciding whether to train, recover, run, or eat better — without a clear system." },
];

const ProblemSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#fff" }}>
    <div className="max-w-5xl mx-auto px-5">
      {/* Core positioning */}
      <motion.div {...fade(0)} className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: "#2F3437" }}>
          StriveHub doesn't just track your fitness.
        </h2>
        <p className="text-lg font-semibold" style={{ color: "#4CAF84" }}>
          It tells you what to do with it.
        </p>
      </motion.div>

      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-4" style={{ color: "#2F3437" }}>
        Most fitness apps give you data — not direction.
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} {...fade(i + 1)} className="rounded-2xl p-6 border" style={{ background: "#FAFBFC", borderColor: "#ECEEF0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#F0F1F3" }}>
                <Icon className="w-5 h-5" style={{ color: "#6B7378" }} strokeWidth={1.8} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "#2F3437" }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7378" }}>{c.desc}</p>
            </motion.div>
          );
        })}
      </div>
      <motion.p {...fade(4)} className="text-center text-sm mt-10 max-w-lg mx-auto" style={{ color: "#6B7378" }}>
        StriveHub turns scattered fitness signals into one clear daily decision.
      </motion.p>
    </div>
  </section>
);

export default ProblemSection;
