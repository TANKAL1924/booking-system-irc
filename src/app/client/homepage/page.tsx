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
        title="Arena IRC | Home to IRC Negeri Sembilan Club"
        description="Arena IRC is a premier sports and event facilities in Negeri Sembilan, offers online booking for football fields, hockey turf, multi-sports facilities, and halls for all occasions."
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