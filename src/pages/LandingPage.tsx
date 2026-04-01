import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DifferentiationSection from "@/components/landing/DifferentiationSection";
import PhilosophySection from "@/components/landing/PhilosophySection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

const scrollToCTA = () => {
  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
};

const LandingPage = () => (
  <div className="min-h-screen" style={{ background: "#F7F8FA", fontFamily: "'DM Sans', sans-serif" }}>
    <LandingNav onCTA={scrollToCTA} />
    <HeroSection onCTA={scrollToCTA} />
    <ProblemSection />
    <SolutionSection />
    <HowItWorksSection />
    <FeaturesSection />
    <DifferentiationSection />
    <PhilosophySection />
    <CTASection />
    <LandingFooter />
  </div>
);

export default LandingPage;
