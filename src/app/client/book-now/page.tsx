import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingFormSection from './components/BookingFormSection';
import SEOHead from '@/components/SEOHead';

export default function BookNowPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Book Now"
        description="Book your badminton court or futsal field at Arena IRC online. Choose your sport, pick a time slot, and pay securely in minutes."
        url="https://arena-irc.com.my/book-now"
      />
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <BookingFormSection />
      <Footer />
    </main>
  );
}