import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingFormSection from './components/BookingFormSection';

export default function BookNowPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <BookingFormSection />
      <Footer />
    </main>
  );
}