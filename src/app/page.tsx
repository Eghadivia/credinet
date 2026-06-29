import HomeFooter from '@/features/home/home-footer';
import HomeHeader from '@/features/home/home-header';
import HeroSection from '@/features/home/hero-section';
import {
  CtaSection,
  FaqSection,
  HowItWorksSection,
  ReviewsSection,
  SecuritySection,
  ServicesSection,
  StatsSection,
} from '@/features/home/landing-sections';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] text-[#171717]">
      <HomeHeader />
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <HowItWorksSection />
      <SecuritySection />
      <ReviewsSection />
      <FaqSection />
      <CtaSection />
      <HomeFooter />
    </main>
  );
}
