import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface FacilitySlot {
  start: string;
  end: string;
  hour: number;
  price: number;
}

interface FacilityAddOn {
  name: string;
  price: number;
  hour_add_on: number;
  pic_add_on: string;
}

interface Facility {
  id: number;
  name: string | null;
  status: boolean | null;
  pic_link: string[] | null;
  type: boolean | null;
  slots: FacilitySlot[] | null;
  add_on: FacilityAddOn[] | null;
  pic_contact: string | null;
}

/* ── Image Gallery Modal ── */
function GalleryModal({ images, name, onClose }: { images: string[]; name: string | null; onClose: () => void }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/90 backdrop-blur-sm" onClick={onClose}>
      {/* Main image */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Name above image */}
        <p className="text-white font-black text-base mb-3 w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>{name}</p>
        <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <AppImage key={images[active]} src={images[active]} alt={`${name} ${active + 1}`} fill className="object-cover" />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-6 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
              aria-label="Previous"
            >
              <Icon name="ChevronLeftIcon" size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-6 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
              aria-label="Next"
            >
              <Icon name="ChevronRightIcon" size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 justify-center px-6 py-4 shrink-0 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === active ? 'border-primary' : 'border-white/10 opacity-50 hover:opacity-80'}`}
            >
                <AppImage src={url} alt={`Thumb ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        <p className="text-white/30 text-xs text-center pb-4 shrink-0">{active + 1} / {images.length}</p>
      </div>
  );
}

/* ── Carousel ── */
function Carousel({ items }: { items: Facility[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<Facility | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  };

  const openGallery = (f: Facility) => {
    if ((f.pic_link ?? []).length === 0) return;
    setGallery(f);
  };

  return (
    <>
      {gallery && (
        <GalleryModal
          images={[
            ...(gallery.pic_link ?? []),
            ...(gallery.add_on ?? []).map((a) => a.pic_add_on).filter(Boolean),
          ]}
          name={gallery.name}
          onClose={() => setGallery(null)}
        />
      )}

      <div className="relative group/carousel">
        {/* Prev */}
        {items.length > 1 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100"
            aria-label="Previous"
          >
            <Icon name="ChevronLeftIcon" size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((f, idx) => (
            <motion.div
              key={f.id}
              className={`glass-card rounded-2xl overflow-hidden flex flex-col shrink-0 w-72 ${(f.pic_link ?? []).length > 0 ? 'cursor-pointer hover:ring-1 hover:ring-white/20 transition-all' : ''}`}
              style={{ scrollSnapAlign: 'start' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.07, ease: 'easeOut' }}
              onClick={() => openGallery(f)}
            >
              {/* Cover image */}
              <div className="relative h-40 overflow-hidden shrink-0">
                {f.pic_link?.[0] ? (
                  <AppImage
                    src={f.pic_link[0]}
                    alt={f.name ?? 'Venue'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="288px"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-xs font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/80 text-white">
                  {f.type ? 'Facility' : 'Hall'}
                </span>
                {/* Photo count badge */}
                {(f.pic_link ?? []).length > 1 && (
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[9px] font-bold text-white/70 bg-black/50 rounded-full px-2 py-0.5">
                    <Icon name="PhotoIcon" size={10} />
                    {f.pic_link!.length}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-base font-black text-white">{f.name}</h3>

                {/* Facility: add-ons only */}
                {f.type && (
                  <>
                    {(f.add_on ?? []).length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Add-ons</p>
                        <div className="space-y-1.5">
                          {(f.add_on ?? []).map((a, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {a.pic_add_on && (
                                <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                  <AppImage src={a.pic_add_on} alt={a.name} fill className="object-cover" />
                                </div>
                              )}
                              <span className="text-white/70 text-xs flex-1 truncate">{a.name} · {a.hour_add_on}hr</span>
                              <span className="text-accent font-bold text-xs shrink-0">RM {a.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Hall: contact number + WhatsApp */}
                {!f.type && f.pic_contact && (
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                      <Icon name="PhoneIcon" size={13} className="text-white/40 shrink-0" />
                      <span className="text-white/70 text-sm">{f.pic_contact}</span>
                    </div>
                    <a
                      href={`https://wa.me/${f.pic_contact.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold text-[11px] uppercase tracking-widest hover:bg-[#25D366]/20 transition-all"
                    >
                      <Icon name="ChatBubbleLeftEllipsisIcon" size={13} />
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next */}
        {items.length > 1 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100"
            aria-label="Next"
          >
            <Icon name="ChevronRightIcon" size={16} />
          </button>
        )}
      </div>
    </>
  );
}

export default function FacilitiesGridSection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('facilities')
      .select('*')
      .eq('status', true)
      .order('id')
      .then(({ data }) => {
        setFacilities(data ?? []);
        setLoading(false);
      });
  }, []);

  const facilityItems = facilities.filter((f) => f.type === true);
  const hallItems = facilities.filter((f) => f.type === false);

  return (
    <section id="facilities" className="pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Our Venues</span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            ALL <span className="gradient-text-brand">ARENA</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 w-72 shrink-0 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-white/30 text-sm">No venues available at the moment.</p>
        ) : (
          <div className="space-y-16">
            {/* Facilities */}
            {facilityItems.length > 0 && (
              <div>
                <h3 className="text-white font-black text-xl mb-5 flex items-center gap-3">
                  Facilities
                  <span className="text-white/20 font-normal text-sm">{facilityItems.length}</span>
                </h3>
                <Carousel items={facilityItems} />
              </div>
            )}

            {/* Halls */}
            {hallItems.length > 0 && (
              <div>
                <h3 className="text-white font-black text-xl mb-5 flex items-center gap-3">
                  Halls
                  <span className="text-white/20 font-normal text-sm">{hallItems.length}</span>
                </h3>
                <Carousel items={hallItems} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

