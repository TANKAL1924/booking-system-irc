import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactHeroSection from './components/ContactHeroSection';
import ContactInfoSection from './components/ContactInfoSection';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <ContactInfoSection />
      <Footer />
    </main>
  );
}