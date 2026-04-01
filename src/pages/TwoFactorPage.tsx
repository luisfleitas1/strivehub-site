import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const TwoFactorPage = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setEnabled(!enabled);
      setLoading(false);
      toast.success(enabled ? "2FA disabled" : "2FA enabled");
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h1>
      </motion.div>

      <motion.div {...fade(1)} className="space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.8} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Two-factor authentication adds an extra layer of protection to your account. When enabled, you may be asked for a verification code when signing in on a new device.
        </p>
      </motion.div>

      <motion.div {...fade(2)} className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-xs text-muted-foreground mt-0.5">{enabled ? "Currently enabled" : "Currently disabled"}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {enabled ? "On" : "Off"}
          </span>
        </div>
      </motion.div>

      <motion.div {...fade(3)}>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-full py-3 rounded-2xl text-sm font-semibold transition-opacity disabled:opacity-50 ${
            enabled ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {loading ? "Processing…" : enabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </motion.div>
    </div>
  );
};

export default TwoFactorPage;
