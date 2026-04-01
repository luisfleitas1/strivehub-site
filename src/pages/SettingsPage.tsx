import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bell, Database, Link2, Settings2, Trash2, ChevronRight,
  Palette, LogOut, Shield, ScanFace, ShieldCheck, KeyRound, MonitorSmartphone,
  Download, Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.4 },
});

const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [faceId, setFaceId] = useState(false);

  const handleFaceIdToggle = (checked: boolean) => {
    if (checked) {
      toast.success("Face ID enabled for faster login");
    } else {
      toast("Face ID disabled");
    }
    setFaceId(checked);
  };

  const handleLogoutAll = () => {
    toast.success("Signed out from all other devices");
  };

  const handleExportData = () => {
    toast.success("Your data export is being prepared");
  };

  const handleDeleteAccount = () => {
    toast.error("Please contact support to delete your account");
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-14 pb-28 space-y-6">
      <motion.div {...fade(0)} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fade(1)} className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-4 h-4" strokeWidth={1.8} />
          <h2 className="text-xs font-semibold uppercase tracking-widest">Notifications</h2>
        </div>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Daily reminder</span>
            <Switch checked={dailyReminder} onCheckedChange={setDailyReminder} />
          </div>
          {dailyReminder && (
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Reminder time</span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="text-sm font-medium bg-transparent text-foreground"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div {...fade(2)} className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Palette className="w-4 h-4" strokeWidth={1.8} />
          <h2 className="text-xs font-semibold uppercase tracking-widest">Appearance</h2>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-sm font-medium mb-3">Theme</p>
          <div className="flex gap-2">
            {(["system", "light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  theme === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div {...fade(3)} className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings2 className="w-4 h-4" strokeWidth={1.8} />
          <h2 className="text-xs font-semibold uppercase tracking-widest">Preferences</h2>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-sm font-medium mb-3">Units</p>
          <div className="flex gap-2">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  units === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {u === "metric" ? "kg / km" : "lbs / miles"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Security & Privacy */}
      <motion.div {...fade(4)} className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="w-4 h-4" strokeWidth={1.8} />
          <h2 className="text-xs font-semibold uppercase tracking-widest">Security & Privacy</h2>
        </div>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {/* Face ID */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <ScanFace className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-medium">Use Face ID</p>
                <p className="text-xs text-muted-foreground">Biometric login for faster access</p>
              </div>
            </div>
            <Switch checked={faceId} onCheckedChange={handleFaceIdToggle} />
          </div>

          {/* 2FA */}
          <button onClick={() => navigate("/settings/two-factor")} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Extra layer of account protection</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Off</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>

          {/* Reset Password */}
          <button onClick={() => navigate("/settings/reset-password")} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-medium">Reset Password</p>
                <p className="text-xs text-muted-foreground">Update your password for security</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Logout all */}
          <button onClick={handleLogoutAll} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-medium">Log Out of All Devices</p>
                <p className="text-xs text-muted-foreground">Sign out from all active sessions</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Data & Connections */}
      <motion.div {...fade(5)} className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="w-4 h-4" strokeWidth={1.8} />
          <h2 className="text-xs font-semibold uppercase tracking-widest">Data & Connections</h2>
        </div>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <button onClick={() => navigate("/import-help")} className="w-full flex items-center justify-between p-4 text-left">
            <span className="text-sm font-medium">Import from Strong App (CSV)</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Garmin</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Coming soon</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Apple Health</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Coming soon</span>
          </div>
          <button onClick={handleExportData} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
              <span className="text-sm font-medium">Export My Data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div {...fade(6)} className="space-y-3">
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <button
            onClick={async () => { await signOut(); navigate("/auth", { replace: true }); }}
            className="w-full flex items-center gap-2 p-4 text-sm font-medium text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
        <div className="bg-card rounded-2xl border border-destructive/20 p-4">
          <button onClick={handleDeleteAccount} className="flex items-center gap-2 text-destructive text-sm font-medium">
            <Trash2 className="w-4 h-4" />
            Delete account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
