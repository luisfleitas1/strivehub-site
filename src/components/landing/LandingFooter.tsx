import logo from "@/assets/strivehub-logo.png";

const LandingFooter = () => (
  <footer className="py-10 border-t" style={{ background: "#F7F8FA", borderColor: "#ECEEF0" }}>
    <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <img src={logo} alt="StriveHub" className="h-8 w-auto" />
      <div className="flex items-center gap-5 text-xs" style={{ color: "#6B7378" }}>
        <a href="https://app.strivehub.ai/privacy" className="hover:opacity-70">Privacy</a>
        <a href="https://app.strivehub.ai/support" className="hover:opacity-70">Support</a>
        <a href="mailto:support@strivehub.ai" className="hover:opacity-70">Contact</a>
      </div>
      <p className="text-xs" style={{ color: "#9CA3A8" }}>© {new Date().getFullYear()} StriveHub. All rights reserved.</p>
    </div>
  </footer>
);

export default LandingFooter;
