import { NavLink, useLocation } from "react-router-dom";
import { Home, Dumbbell, UtensilsCrossed, Lightbulb, Clock } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/today", icon: Clock, label: "Today" },
  { to: "/workout", icon: Dumbbell, label: "Workout" },
  { to: "/meal", icon: UtensilsCrossed, label: "Meal" },
  { to: "/insights", icon: Lightbulb, label: "Insights" },
];

const hiddenPaths = ["/auth", "/onboarding", "/settings", "/profile", "/log-workout", "/log-cardio", "/history", "/import-help", "/score", "/landing"];

const BottomNav = () => {
  const location = useLocation();
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
    <div className="max-w-md mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Icon className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
  );
};

export default BottomNav;
