import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import AppImage from '@/components/ui/AppImage';

interface Event {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  pic_link: string | null;
}

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatDateRange = (start: string, end: string | null) => {
    if (!end || end === start) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {event.pic_link && (
          <img src={event.pic_link} alt={event.name} className="w-full object-contain max-h-[80vh]" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-black text-xl leading-tight">{event.name}</h3>
          <p className="text-white text-xs font-bold uppercase tracking-widest mt-1">
            {formatDateRange(event.start_date, event.end_date)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function AnnouncementsSection() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Event | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      supabase.from('announcement').select('ann_link').eq('id', 1).maybeSingle(),
      supabase.from('events').select('*').gte('start_date', today).order('start_date', { ascending: true }).limit(3),
    ]).then(([ann, evts]) => {
      setImageUrl(ann.data?.ann_link ?? null);
      if (evts.data) setEvents(evts.data);
      setLoading(false);
    });
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatDateRange = (start: string, end: string | null) => {
    if (!end || end === start) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  if (loading || (!imageUrl && events.length === 0)) return null;

  return (
    <section className="py-20 px-6">
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="mb-12">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
              News
            </span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
              ANNOUNCEMENT<br />
              <span className="gradient-text-brand">& UPCOMING EVENT</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Announcement */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Announcement</p>
              <div className="glass-card rounded-2xl overflow-hidden">
                <AppImage src={imageUrl} alt="Announcement" className="w-full object-contain" />
              </div>
            </motion.div>
          )}

          {/* Right: Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Upcoming Events</p>
            {events.length === 0 ? (
              <p className="text-white/40 text-sm">No upcoming events at the moment. Check back soon.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {events.map((ev, idx) => (
                  <motion.div
                    key={ev.id}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex gap-4 items-center"
                    onClick={() => ev.pic_link && setSelected(ev)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
                  >
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-white/5">
                      {ev.pic_link ? (
                        <img
                          src={ev.pic_link}
                          alt={ev.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xl font-black opacity-30">
                          IRC
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-black text-white leading-tight mb-1">{ev.name}</h3>
                      <p className="text-white text-xs font-bold uppercase tracking-widest">
                        {formatDateRange(ev.start_date, ev.end_date)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

