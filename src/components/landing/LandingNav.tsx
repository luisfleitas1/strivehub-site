import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingNav = ({ onCTA }: { onCTA: () => void }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{ background: "rgba(247,248,250,0.85)", borderColor: "#ECEEF0" }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight" style={{ color: "#2F3437" }}>
          StriveHub
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/auth")} className="text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-black/5" style={{ color: "#6B7378" }}>
            Sign in
          </button>
          <button onClick={onCTA} className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #4CAF84, #3d9a72)" }}>
            Get early access
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNav;
