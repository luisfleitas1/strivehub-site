import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

const questions = [
  {
    question: "How do you feel today?",
    options: ["Great 😊", "Good 🙂", "Okay 😐", "Tired 😴", "Sore 😣"],
  },
  {
    question: "Energy level?",
    options: ["High ⚡", "Normal 🔋", "Low 🪫"],
  },
  {
    question: "Sleep quality last night?",
    options: ["Excellent 😴", "Good 👍", "Poor 😵‍💫"],
  },
  {
    question: "Training intensity today?",
    options: ["Rest day 🧘", "Light 🚶", "Moderate 🏃", "Hard 🔥"],
  },
];

const CheckInPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = step >= questions.length;

  const select = (option: string) => {
    setAnswers([...answers, option]);
    setTimeout(() => setStep(step + 1), 300);
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm font-medium">Daily</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Quick Check-in</h1>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < step ? "bg-primary" : i === step ? "bg-primary/40" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">{questions[step].question}</h2>
            <div className="space-y-2.5">
              {questions[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => select(opt)}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border border-border bg-card text-sm font-medium flex items-center justify-between transition-all hover:border-primary/30 active:scale-[0.98]"
                >
                  {opt}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-10"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-primary" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Check-in complete</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                You're feeling {answers[0]?.split(" ")[0]?.toLowerCase()} with {answers[1]?.split(" ")[0]?.toLowerCase()} energy. 
                Your coach will factor this into today's recommendations.
              </p>
            </div>
            <button
              onClick={() => { setStep(0); setAnswers([]); }}
              className="text-sm text-primary font-medium mt-4"
            >
              Redo check-in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInPage;
