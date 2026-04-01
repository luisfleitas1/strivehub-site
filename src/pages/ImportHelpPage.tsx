import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const steps = [
  "Open Strong app on your phone",
  "Go to Settings → Export Data",
  "Choose CSV format and export",
  "Upload the CSV file below",
];

const ImportHelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Import from Strong</h1>
      </motion.div>

      {/* Steps */}
      <motion.div {...fade(1)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">How to export</h2>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-card rounded-xl p-3.5 border border-border">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What gets imported */}
      <motion.div {...fade(2)} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What gets imported</h2>
        <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
          {["Exercises", "Sets, reps & weight", "Dates"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upload */}
      <motion.div {...fade(3)}>
        <label className="flex flex-col items-center gap-3 py-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Upload CSV file</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap to select file</p>
          </div>
          <input type="file" accept=".csv" className="hidden" />
        </label>
      </motion.div>

      {/* Note */}
      <motion.div {...fade(4)} className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3.5">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This is a one-time or occasional import until direct integrations are available.
        </p>
      </motion.div>
    </div>
  );
};

export default ImportHelpPage;
