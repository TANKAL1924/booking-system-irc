import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementsSection from './components/AnnouncementsSection';
import SportSection from '@/app/client/homepage/components/SportSection';
import HeaderSliderSection from './components/HeaderSliderSection';
import SEOHead from '@/components/SEOHead';

export default function HomepagePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Arena IRC — Book Badminton Courts & Futsal Fields in Negeri Sembilan"
        description="Arena IRC in Bandar Sri Sendayan, Negeri Sembilan. Book badminton courts and futsal fields online. Flexible memberships, exclusive promos, and easy online booking."
        url="https://arena-irc.com.my/"
        keywords="Arena IRC, badminton court booking, futsal field rental, sports facility Negeri Sembilan, Bandar Sri Sendayan, court booking Malaysia, sports complex"
        noSuffix
      />
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <HeaderSliderSection />
      <AnnouncementsSection />
      <SportSection />
      <Footer />
    </main>
  );
}