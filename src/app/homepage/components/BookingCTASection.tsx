import { Link } from 'react-router-dom';

export default function BookingCTASection() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-[#141414] to-accent/10 border border-primary/20 p-8 sm:p-10 md:p-16 text-center">
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.02] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/[0.05] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
              Ready to Book?
            </span>
            <h2 className="font-black text-3xl sm:text-4xl md:text-7xl tracking-tighter leading-none text-white mb-6">
              RESERVE YOUR <br />
              <span className="gradient-text-brand">FACILITY TODAY</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Book online with 50% deposit or full payment. Instant confirmation for all available slots.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-now"
                className="magnetic-btn px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all pulse-glow-anim"
              >
                Book a Facility
              </Link>
              <a
                href="https://wa.me/60123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn px-8 sm:px-12 py-4 sm:py-5 bg-white/5 border border-white/15 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}