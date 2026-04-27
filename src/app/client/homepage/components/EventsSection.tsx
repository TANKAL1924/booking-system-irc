import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Event {
  id: number;
  name: string;
  date: string;
  pic_link: string | null;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .limit(3)
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
              Latest
            </span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
              UPCOMING<br />
              <span className="gradient-text-brand">EVENTS</span>
            </h2>
          </div>
          <Link
            to="/the-arena"
            className="flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest hover:gap-4 transition-all shrink-0"
          >
            All Events
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        </motion.div>

        {events.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-12">No events at the moment. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev, idx) => (
              <motion.div
                key={ev.id}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              >
              <div className="relative h-52 overflow-hidden bg-white/5">
                  {ev.pic_link ? (
                    <img
                      src={ev.pic_link}
                      alt={ev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-5xl font-black">
                      IRC
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-white mb-2 leading-tight">{ev.name}</h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{formatDate(ev.date)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}