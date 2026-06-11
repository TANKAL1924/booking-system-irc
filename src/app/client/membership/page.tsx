import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MembershipTiersSection from './components/MembershipTiersSection';
import SEOHead from '@/components/SEOHead';

export default function MembershipPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Membership"
        description="Join Arena IRC as a member and enjoy exclusive benefits, discounted court rates, and priority booking. Choose from multiple membership tiers."
        url="https://arena-irc.com.my/membership"
        keywords="Arena IRC membership, sports membership Malaysia, badminton membership, futsal membership, court discount"
      />
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <MembershipTiersSection />
      <Footer />
    </main>
  );
}