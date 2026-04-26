import React from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/components/ui/AppImage';

const events = [
{
  id: 1,
  title: 'NS State Hockey Championship 2026',
  date: 'June 1, 2026',
  category: 'Tournament',
  img: "https://images.unsplash.com/photo-1614500952905-1cbbeb14044f",
  alt: 'Hockey players competing on green turf field, dark stadium environment, dramatic floodlights overhead',
  badge: 'Upcoming',
  badgeColor: 'bg-accent text-black'
},
{
  id: 2,
  title: 'Arena IRC Graduation Package 2026',
  date: 'July 15–20, 2026',
  category: 'Events',
  img: "https://images.unsplash.com/photo-1650436795840-3a216e498894",
  alt: 'Graduation ceremony in large banquet hall, dim atmospheric lighting, rows of seats with decorations',
  badge: 'Open Booking',
  badgeColor: 'bg-primary text-white'
},
{
  id: 3,
  title: 'Veteran Soccer League Season 4',
  date: 'May 10, 2026',
  category: 'Sports',
  img: "https://images.unsplash.com/photo-1519932067260-478c655454f9",
  alt: 'Soccer players on grass field at night, stadium floodlights illuminating the pitch, dark sky background',
  badge: 'Registration Open',
  badgeColor: 'bg-[#25D366] text-white'
}];


export default function EventsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
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
            className="flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest hover:gap-4 transition-all shrink-0">

            All Events
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events?.map((ev) =>
          <div key={ev?.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
              {/* Poster Image */}
              <div className="relative h-52 overflow-hidden">
                <AppImage
                src={ev?.img}
                alt={ev?.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${ev?.badgeColor}`}>
                    {ev?.badge}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-black text-white mb-2 leading-tight">{ev?.title}</h3>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{ev?.date}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}