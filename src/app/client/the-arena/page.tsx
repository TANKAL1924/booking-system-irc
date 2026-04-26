import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FacilitiesGridSection from './components/FacilitiesGridSection';

export default function TheArenaPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <FacilitiesGridSection />
      <Footer />
    </main>
  );
}