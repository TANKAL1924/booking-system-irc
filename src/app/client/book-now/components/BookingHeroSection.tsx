
export default function BookingHeroSection() {
  return (
    <section className="relative pt-32 pb-12 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(204,0,0,0.10)_0%,transparent_60%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent">
            Online Booking System
          </span>
        </div>
        <h1 className="font-black leading-[0.85] tracking-tighter text-white mb-4" style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
          BOOK A<br />
          <span className="gradient-text-brand">FACILITY</span>
        </h1>
        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          Reserve your facility online. Choose 50% deposit or full payment. Instant confirmation sent to your email.
        </p>
      </div>
    </section>
  );
}