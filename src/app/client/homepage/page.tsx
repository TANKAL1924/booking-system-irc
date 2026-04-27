import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutBentoSection from './components/AboutBentoSection';
import EventsSection from './components/EventsSection';
import { supabase } from '@/lib/supabase';

const ANN_SEEN_KEY = 'ann_seen_url';

export default function HomepagePage() {
  const [annUrl, setAnnUrl] = useState<string | null>(null);
  const [annOpen, setAnnOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('announcement')
      .select('ann_link')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data?.ann_link) return;
        const seen = localStorage.getItem(ANN_SEEN_KEY);
        if (seen === data.ann_link) return;
        setAnnUrl(data.ann_link);
        setAnnOpen(true);
      });
  }, []);

  const closeAnn = () => {
    if (annUrl) localStorage.setItem(ANN_SEEN_KEY, annUrl);
    setAnnOpen(false);
  };

  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <AboutBentoSection />
      <EventsSection />
      <Footer />

      {annOpen && annUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeAnn}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAnn}
              className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all text-lg font-bold"
            >
              ×
            </button>
            <img
              src={annUrl}
              alt="Announcement"
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </main>
  );
}