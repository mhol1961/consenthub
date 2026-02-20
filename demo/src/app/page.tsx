import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import Pricing from "@/components/landing/Pricing";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/landing/ScrollProgress";

/* ------------------------------------------------------------------
   SVG Wave Dividers — three slightly different curves for variety
   ------------------------------------------------------------------ */

function WaveDivider1({ className }: { className?: string }) {
  return (
    <div className={`relative z-10 w-full overflow-hidden leading-[0] ${className ?? ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="block h-12 w-full md:h-16 lg:h-20"
      >
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function WaveDivider2({ className }: { className?: string }) {
  return (
    <div className={`relative z-10 w-full overflow-hidden leading-[0] ${className ?? ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="block h-12 w-full md:h-16 lg:h-20"
      >
        <path
          d="M0,40 C150,90 350,10 500,50 C650,90 850,10 1050,70 C1150,90 1180,40 1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function WaveDivider3({ className }: { className?: string }) {
  return (
    <div className={`relative z-10 w-full overflow-hidden leading-[0] ${className ?? ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="block h-12 w-full md:h-16 lg:h-20"
      >
        <path
          d="M0,80 C300,20 500,100 700,40 C900,0 1100,80 1200,30 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        {/* Wave: Hero → ProblemSolution (fills with ProblemSolution bg color) */}
        <WaveDivider1 className="-mt-px text-slate-50 dark:text-slate-900/50" />
        <ProblemSolution />
        <Features />
        {/* Wave: Features → HowItWorks (fills with HowItWorks bg) */}
        <WaveDivider2 className="-mt-px text-slate-50 dark:text-slate-900/50" />
        <HowItWorks />
        {/* Wave: HowItWorks → InteractiveDemo */}
        <WaveDivider3 className="-mt-px text-white dark:text-slate-950" />
        <InteractiveDemo />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
