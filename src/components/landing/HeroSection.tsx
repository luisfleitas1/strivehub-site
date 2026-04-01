import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.12, duration: 0.5 },
});

const HeroSection = ({ onCTA }: { onCTA: () => void }) => (
  <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 text-center md:text-left">
        <motion.p {...fade(0)} className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: "#4CAF84" }}>
          Daily Fitness Guidance
        </motion.p>
        <motion.h1 {...fade(1)} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]" style={{ color: "#2F3437" }}>
          Know exactly what to do today.
        </motion.h1>
        <motion.p {...fade(2)} className="text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0" style={{ color: "#6B7378" }}>
          StriveHub turns your recovery, strength, cardio, and nutrition into one clear daily decision — so you can stop guessing and start improving.
        </motion.p>
        <motion.p {...fade(2)} className="text-sm max-w-lg mx-auto md:mx-0" style={{ color: "#6B7378" }}>
          A personalized daily plan based on your body, your training, and your habits.
        </motion.p>
        <motion.div {...fade(3)} className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button onClick={onCTA} className="px-7 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #4CAF84, #3d9a72)" }}>
            Join early access
          </button>
          <a href="#how-it-works" className="px-7 py-3.5 rounded-full font-semibold text-sm border transition-all hover:scale-[1.02]" style={{ color: "#2F3437", borderColor: "#E0E3E6" }}>
            See how it works <ArrowRight className="inline w-4 h-4 ml-1" />
          </a>
        </motion.div>
        <motion.p {...fade(4)} className="text-xs font-medium pt-1" style={{ color: "#6B7378" }}>
          Start training with clarity
        </motion.p>
      </div>
      <motion.div {...fade(2)} className="flex justify-center">
        <img src={heroMockup} alt="StriveHub app showing daily fitness recommendation and health scores" width={480} height={480} className="w-full max-w-[420px] drop-shadow-2xl" />
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
