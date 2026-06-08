import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactInfoSection from './components/ContactInfoSection';
import SEOHead from '@/components/SEOHead';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Contact Us"
        description="Get in touch with Arena IRC. Find our location, operating hours, and contact details. We're here to help with bookings, enquiries, and feedback."
        url="https://arena-irc.com.my/contact"
      />
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <ContactInfoSection />
      <Footer />
    </main>
  );
}