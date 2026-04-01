import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
});

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="cta" className="py-20 md:py-28" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto px-5">
        <motion.div {...fade(0)} className="rounded-3xl p-8 md:p-12 text-center" style={{ background: "#F7F8FA", border: "1px solid #ECEEF0" }}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: "#2F3437" }}>
            Stop guessing. Start improving.
          </h2>
          <p className="text-base mb-8" style={{ color: "#6B7378" }}>
            Join the early access list and be first to try StriveHub.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: "#4CAF84" }}>
              <CheckCircle2 className="w-5 h-5" /> You're on the list! We'll be in touch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-12 px-5 rounded-full text-sm border focus:outline-none focus:ring-2"
                style={{ borderColor: "#E0E3E6", background: "#fff", color: "#2F3437" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-7 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #4CAF84, #3d9a72)" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Get early access <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          <p className="text-xs mt-4" style={{ color: "#9CA3A8" }}>Early users will help shape the product.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
