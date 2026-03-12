import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Problem from "@/components/Problem";
import SocialProof from "@/components/SocialProof";
import Solution from "@/components/Solution";
import UseCases from "@/components/UseCases";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(212,164,55,0.12),transparent_60%),radial-gradient(800px_400px_at_90%_0%,rgba(11,31,58,0.08),transparent_65%)]" />
        <Navbar />
        <main id="main" className="relative">
          <Hero />
          <SocialProof />
          <Problem />
          <Solution />
          <Features />
          <HowItWorks />
          <UseCases />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
