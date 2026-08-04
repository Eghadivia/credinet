import Home2Header from '@/features/home-2/home-2-header';
import Home2Faq from '@/features/home-2/home-2-faq';
import Home2Footer from '@/features/home-2/home-2-footer';
import Home2Hero from '@/features/home-2/home-2-hero';
import Home2HowItWorks from '@/features/home-2/home-2-how-it-works';
import Home2Reviews from '@/features/home-2/home-2-reviews';
import Home2Security from '@/features/home-2/home-2-security';
import Home2Services from '@/features/home-2/home-2-services';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8ff] text-[#111111]">
      <Home2Header />
      <Home2Hero />
      <Home2Services />
      <Home2HowItWorks />
      <Home2Security />
      <Home2Reviews />
      <Home2Faq />
      <Home2Footer />
    </main>
  );
}
