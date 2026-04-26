import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const galleryImages = [
{
  id: 1,
  src: "https://images.unsplash.com/photo-1519932067260-478c655454f9",
  alt: 'Soccer match in progress on illuminated field, players in action, dark stadium background',
  label: 'Soccer Tournament 2025'
},
{
  id: 2,
  src: "https://images.unsplash.com/photo-1706675780103-3ca1f89143a0",
  alt: 'Hockey players competing on green turf, stadium lights, intense match atmosphere',
  label: 'NS Hockey Championship'
},
{
  id: 3,
  src: "https://images.unsplash.com/photo-1695142707943-b767c761ec0b",
  alt: 'Graduation ceremony in grand hall with hundreds of guests, warm ceremonial lighting',
  label: 'UiTM Graduation 2025'
},
{
  id: 4,
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_1829cf204-1772228343102.png",
  alt: 'Athletic sprint race on red track, multiple runners in competition, stadium atmosphere',
  label: 'NS Athletic Meet 2025'
},
{
  id: 5,
  src: "https://images.unsplash.com/photo-1727729890956-88233128a7cc",
  alt: 'Elegant wedding reception in glass hall, fairy lights, romantic warm atmosphere',
  label: 'Wedding — Glasshouse Hall'
},
{
  id: 6,
  src: "https://images.unsplash.com/photo-1575377231076-1ada9aac858e",
  alt: 'Large sports event in multipurpose arena, packed spectator stands, bright floodlights',
  label: 'State Sports Carnival 2025'
}];


export default function EventGallerySection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i - 1 + galleryImages?.length) % galleryImages?.length);
  const next = () => setActiveIdx((i) => (i + 1) % galleryImages?.length);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Gallery</span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
              EVENT <span className="gradient-text-brand">GALLERY</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
              aria-label="Previous">

              <Icon name="ChevronLeftIcon" size={18} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
              aria-label="Next">

              <Icon name="ChevronRightIcon" size={18} />
            </button>
          </div>
        </div>

        {/* Main Slide */}
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 mb-4">
          <AppImage
            src={galleryImages?.[activeIdx]?.src}
            alt={galleryImages?.[activeIdx]?.alt}
            fill
            className="object-cover transition-all duration-500"
            sizes="100vw" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="text-white font-bold text-lg">{galleryImages?.[activeIdx]?.label}</span>
            <p className="text-white/40 text-xs mt-1">
              {activeIdx + 1} / {galleryImages?.length}
            </p>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {galleryImages?.map((img, i) =>
          <button
            key={img?.id}
            onClick={() => setActiveIdx(i)}
            className={`relative h-16 md:h-20 rounded-lg overflow-hidden transition-all ${
            i === activeIdx ? 'ring-2 ring-primary' : 'opacity-50 hover:opacity-80'}`
            }>

              <AppImage
              src={img?.src}
              alt={img?.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 16vw" />

            </button>
          )}
        </div>
      </div>
    </section>);

}