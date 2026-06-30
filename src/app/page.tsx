'use client';

import HeroSection from '@/components/portfolio/HeroSection';
import MarqueeSection from '@/components/portfolio/MarqueeSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ServicesSection from '@/components/portfolio/ServicesSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0C0C0C] text-[#D7E2EA]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
