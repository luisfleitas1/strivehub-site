import { motion } from "framer-motion";
import { BarChart3, Puzzle, HelpCircle } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const cards = [
  { icon: BarChart3, title: "Too much fragmented data", desc: "Your sleep is in one app. Your training is in another. Your nutrition is somewhere else." },
  { icon: Puzzle, title: "Too many point solutions", desc: "Wearables, workout apps, recovery apps, food tracking. Each gives you part of the story, not the whole picture." },
  { icon: HelpCircle, title: "Too little real progress", desc: "You can run more, lift more, or track more, but if sleep and nutrition are off, progress still stalls." },
];

const ProblemSection = () => (
  <section className="py-20 md:py-28" style={{ background: "#fff" }}>
    <div className="max-w-5xl mx-auto px-5">
      {/* Core positioning */}
      <motion.div {...fade(0)} className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: "#2F3437" }}>
          Your fitness data is fragmented.
        </h2>
        <p className="text-lg font-semibold" style={{ color: "#4CAF84" }}>
          Your decisions shouldn't be.
        </p>
        <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: "#6B7378" }}>
          Garmin tracks one thing. Nutrition apps track another. Workout apps track another.
          <br />StriveHub helps you see the big picture.
        </p>
      </motion.div>

      <motion.h2 {...fade(0)} className="text-3xl md:text-4xl font-bold text-center tracking-tight mb-4" style={{ color: "#2F3437" }}>
        Most fitness tools help you track one thing.
      </motion.h2>
      <motion.p {...fade(0)} className="text-center text-base mb-2" style={{ color: "#6B7378" }}>
        Very few help you understand the whole picture.
      </motion.p>
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
        StriveHub was built to turn fragmented fitness signals into one clear daily decision.
      </motion.p>
    </div>
  </section>
);

export default ProblemSection;
