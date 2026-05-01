import { APP_URL } from "@/config";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/strivehub-logo-new.png";

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
	<div className="flex items-center">
 	 <img
  src={logo}
  alt="StriveHub logo"
  className="h-9 sm:h-11 w-auto mr-2 flex-shrink-0"
/>
	</div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => window.location.href = APP_URL}
            className="text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-colors hover:bg-black/5 whitespace-nowrap"
            style={{ color: "#6B7378" }}
          >
            Sign in
          </button>

<button
  onClick={onCTA}
  className="text-sm font-semibold px-3 sm:px-5 py-2 rounded-full text-white transition-all whitespace-nowrap"
  style={{ background: "linear-gradient(135deg, #4CAF84, #3d9a72)" }}
>
  <span className="hidden sm:inline">Get early access</span>
  <span className="sm:hidden">Early access</span>
</button>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNav;
