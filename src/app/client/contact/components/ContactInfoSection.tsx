import Icon from '@/components/ui/AppIcon';
import { motion } from 'framer-motion';
import { useBase } from '@/lib/useBase';

export default function ContactInfoSection() {
  const { base } = useBase();
  const socials = [
    { label: 'Instagram', handle: base?.insta ?? '@arenairc', href: base?.insta ?? 'https://instagram.com', color: 'text-pink-400' },
    { label: 'Facebook', handle: base?.facebook ?? 'Arena IRC NS', href: base?.facebook ?? 'https://facebook.com', color: 'text-blue-400' },
    { label: 'TikTok', handle: base?.tiktok ?? '@arenairc.ns', href: base?.tiktok ?? 'https://tiktok.com', color: 'text-white' },
  ];
  return (
    <section className="pt-32 pb-12 px-4 sm:px-6">
      <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Our Contact</span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            CONTACT <span className="gradient-text-brand">US</span>
          </h2>
        </div>
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Map + Address */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
          <div className="space-y-6">
            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-64 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127483.55827756!2d101.9329!3d2.7257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdcb6b0c5b6e7b%3A0xa3c3a0c1e0b1b1b1!2sSeremban%2C%20Negeri%20Sembilan!5e0!3m2!1sen!2smy!4v1714000000000!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Arena IRC Location"
              />
            </div>

            {/* Address & Contact */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name="MapPinIcon" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Address</p>
                  <p className="text-white text-sm leading-relaxed font-medium">
                    {base?.address ?? 'Arena IRC, Jalan Stadium, 70200 Seremban, Negeri Sembilan, Malaysia'}
                  </p>
                </div>
              </div>

            </div>
          </div>
          </motion.div>
          {/* Right: Hours + Social */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
          <div className="space-y-6">

            {/* Social Media */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Icon name="GlobeAltIcon" size={18} className="text-accent" />
                <h3 className="font-bold text-white text-base">Follow Us</h3>
              </div>
              <div className="space-y-3">
                {socials?.map((s) => (
                  <a
                    key={s?.label}
                    href={s?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-0.5">{s?.label}</p>
                      <p className={`text-sm font-bold ${s?.color}`}>{s?.handle}</p>
                    </div>
                    <Icon name="ArrowTopRightOnSquareIcon" size={16} className="text-white group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick WhatsApp */}
            <a
              href={base?.whatsapp ? `${base.whatsapp}?text=Hi%20Arena%20IRC%2C%20I%20have%20an%20enquiry.` : 'https://wa.me/60123456789?text=Hi%20Arena%20IRC%2C%20I%20have%20an%20enquiry.'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#1ebe5d] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.843L.054 23.25l5.548-1.456A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.742-.523-5.29-1.432l-.379-.225-3.293.864.88-3.21-.247-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Chat on WhatsApp
            </a>
            {base?.lat != null && base?.long != null && (
              <a
                href={`https://waze.com/ul?ll=${base.lat},${base.long}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-[#33CCFF] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#1ab8e8] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Open in Waze
              </a>
            )}
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}