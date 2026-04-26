
export default function MembershipCTASection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-[#141414] to-accent/10 border border-primary/20 p-10 md:p-16 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.02] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
              Join Today
            </span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white mb-6">
              READY TO <span className="gradient-text-brand">JOIN?</span>
            </h2>
            <p className="text-white/40 text-base max-w-lg mx-auto mb-10 leading-relaxed">
              Contact us directly via WhatsApp to register your membership. Our team will guide you through the process.
            </p>
            <a
              href="https://wa.me/60123456789?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20Arena%20IRC%20membership."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-[#25D366] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#1ebe5d] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.843L.054 23.25l5.548-1.456A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.742-.523-5.29-1.432l-.379-.225-3.293.864.88-3.21-.247-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp to Register
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}