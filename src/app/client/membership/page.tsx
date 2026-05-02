import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MembershipTiersSection from './components/MembershipTiersSection';
import SportSection from './components/SportSection';

export default function MembershipPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <MembershipTiersSection />
      <SportSection />
      <Footer />
    </main>
  );
}