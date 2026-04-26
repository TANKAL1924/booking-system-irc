const announcement = {
  title: 'New Online Booking System Launched',
  date: 'April 20, 2026',
  category: 'System Update',
  description: 'Book facilities instantly online with 50% deposit. Instant confirmation for all available slots.',
  badge: 'New',
  badgeColor: 'bg-accent text-black',
};

export default function AnnouncementsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            Updates
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            LATEST<br />
            <span className="gradient-text-brand">ANNOUNCEMENT</span>
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${announcement.badgeColor}`}>
                {announcement.badge}
              </span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                {announcement.category}
              </span>
            </div>
            <h3 className="text-base font-black text-white mb-1 leading-tight">{announcement.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{announcement.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{announcement.date}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

