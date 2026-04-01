const LandingFooter = () => (
  <footer className="py-10 border-t" style={{ background: "#F7F8FA", borderColor: "#ECEEF0" }}>
    <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-sm font-bold" style={{ color: "#2F3437" }}>StriveHub</span>
      <p className="text-xs" style={{ color: "#9CA3A8" }}>© {new Date().getFullYear()} StriveHub. All rights reserved.</p>
    </div>
  </footer>
);

export default LandingFooter;
