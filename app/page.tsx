import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import WhyUs from "@/components/why-us";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import CtaBanner from "@/components/cta-banner";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 1. Navbar: Sticky blur navigation & mobile drawer */}
      <Navbar />

      <main>
        {/* 2. Hero Section: Headline, CTA, floating 3D elements & simulated GIS radar */}
        <Hero />

        {/* 3. Mengapa MitraPanen: Problem vs Solution with 3D hover cards */}
        <WhyUs />

        {/* 4. Fitur Unggulan: Zigzag layout with GIS Map & WhatsApp Bot Tailwind mockups */}
        <Features />

        {/* 5. Cara Kerja: 3 Langkah dengan panah penghubung desktop */}
        <HowItWorks />

        {/* 6. Call to Action Banner: UMKM & Petani conversion block */}
        <CtaBanner />
      </main>

      {/* 7. Footer: Branding, links, and system status */}
      <Footer />
    </div>
  );
}
