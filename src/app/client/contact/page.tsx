import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactInfoSection from './components/ContactInfoSection';
import SEOHead from '@/components/SEOHead';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Contact Us"
        description="Contact Arena IRC at Persiaran 1, Sendayan Bayu, Bandar Sri Sendayan, Negeri Sembilan. Call +60129851855. Open daily 9am–6pm."
        url="https://arena-irc.com.my/contact"
        keywords="Arena IRC contact, Arena IRC location, sports facility Bandar Sri Sendayan, Arena IRC phone number"
      />
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <ContactInfoSection />
      <Footer />
    </main>
  );
}