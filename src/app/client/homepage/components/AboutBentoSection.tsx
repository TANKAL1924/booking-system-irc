import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useBase } from '@/lib/useBase';

// BENTO GRID AUDIT
// Array has 5 cards: [About(cs-2 rs-2), Vision(cs-1 rs-1), Stats(cs-1 rs-1), Video(cs-1 rs-1), Quick(cs-1 rs-1)]
// Grid: grid-cols-4
// Row 1: [col-1-2: About cs-2 rs-2] [col-3: Vision cs-1 rs-1] [col-4: Stats cs-1 rs-1]
// Row 2: [col-1-2: About (continued)] [col-3: Video cs-1 rs-1] [col-4: Quick cs-1 rs-1]
// Placed 5/5 ✓

const highlights = [
{ icon: 'TrophyIcon', label: 'Sports Events', value: '200+' },
{ icon: 'UsersIcon', label: 'Max Capacity', value: '900 Pax' },
{ icon: 'BuildingOffice2Icon', label: 'Facilities', value: '6 Venues' },
{ icon: 'CalendarDaysIcon', label: 'Years Active', value: '15+ Yrs' }];


export default function AboutBentoSection() {
  const { base } = useBase();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
    <section className="pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div className="text-center md:text-left">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
              About Us
            </span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
              WHO WE <br />
              <span className="gradient-text-brand">ARE</span>
            </h2>
          </div>
        </div>
        </motion.div>

        {/* Bento Grid — desktop */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4" style={{ gridTemplateRows: 'repeat(2, 260px)' }}>
          {/* Card 1: About — col-span-2 row-span-2 */}
          <motion.div
            className="bento-item col-span-2 row-span-2 p-10 flex flex-col justify-between group relative"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1724036112951-64b1df4ca286"
                alt="Indoor sports arena with bright overhead lighting, dark court surface, empty stadium seating in background"
                fill
                className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                sizes="(max-width: 768px) 100vw, 50vw" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
            </div>
            <div className="relative z-10">
              <span className="text-primary/40 text-6xl font-black italic">01</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 text-white leading-tight">
                Arena IRC &<br />IRC Negeri Sembilan Club
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
                {base?.about_us ?? 'A state-of-the-art multipurpose facility serving athletes, schools, corporations, and families across Negeri Sembilan since 2010.'}
              </p>
              <Link
                to="/the-arena"
                className="inline-flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest hover:gap-4 transition-all">

                Discover More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Vision — col-span-1 row-span-1 */}
          <motion.div
            className="bento-item col-span-1 row-span-1 p-8 flex flex-col justify-between"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="flex justify-between items-start">
              <Icon name="StarIcon" size={28} className="text-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Vision</span>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 text-white leading-tight">Our Vision</h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {base?.vision ?? 'To be the leading sports and event hub in Negeri Sembilan, fostering athletic excellence and community spirit.'}
              </p>
            </div>
          </motion.div>

          {/* Card 3: Stats — col-span-1 row-span-1 */}
          <motion.div
            className="bento-item col-span-1 row-span-1 p-8 flex flex-col justify-between bg-primary/10"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-2 gap-4 h-full content-between">
              {highlights.slice(0, 2).map((h) =>
              <div key={h.label}>
                  <span className="block text-2xl font-black text-accent">{h.value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{h.label}</span>
                </div>
              )}
              {highlights.slice(2, 4).map((h) =>
              <div key={h.label}>
                  <span className="block text-2xl font-black text-white">{h.value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{h.label}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 4: Video Teaser — col-span-1 row-span-1 */}
          <div
            className={`col-span-1 row-span-1 ${base?.main_vid ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => base?.main_vid && setVideoOpen(true)}
          >
          <motion.div
            className="bento-item h-full p-8 flex flex-col justify-between relative overflow-hidden group"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1697562160779-fed83c21a2cd"
                alt="Sports players on illuminated field at night, dark stadium environment, dramatic floodlight beams"
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                sizes="25vw" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
            <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-white mb-1">Facility Tour</h3>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Watch Video</p>
            </div>
          </motion.div>
          </div>

          <motion.div
            className="bento-item col-span-1 row-span-1 p-8 flex flex-col justify-between"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          >
            <div className="flex justify-between items-start">
              <Icon name="RocketLaunchIcon" size={28} className="text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Mission</span>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 text-white leading-tight">Our Mission</h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {base?.mission ?? 'To provide world-class sports and event facilities that inspire excellence, unity, and growth in every individual and community we serve.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: stacked cards */}
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        <div className="space-y-4">
          {/* About card with background image */}
          <div className="bento-item p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between group">
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1724036112951-64b1df4ca286"
                alt="Indoor sports arena"
                fill
                className="object-cover opacity-20"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
            </div>
            <div className="relative z-10">
              <span className="text-primary/40 text-4xl font-black italic">01</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 text-white leading-tight">Arena IRC &<br />IRC Negeri Sembilan Club</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {base?.about_us ?? 'A state-of-the-art multipurpose facility serving athletes, schools, corporations, and families across Negeri Sembilan since 2010.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {highlights.map((h) =>
                <div key={h.label}>
                  <span className="block text-xl font-black text-accent">{h.value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{h.label}</span>
                </div>
                )}
              </div>
              <Link
                to="/the-arena"
                className="inline-flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest">
                Discover More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          {/* Vision card */}
          <div className="bento-item p-8">
            <div className="flex justify-between items-start mb-4">
              <Icon name="StarIcon" size={24} className="text-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Vision</span>
            </div>
            <h3 className="text-xl font-black mb-2 text-white">Our Vision</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {base?.vision ?? 'To be the leading sports and event hub in Negeri Sembilan, fostering athletic excellence and community spirit.'}
            </p>
          </div>
          {/* Mission card */}
          <div className="bento-item p-8">
            <div className="flex justify-between items-start mb-4">
              <Icon name="RocketLaunchIcon" size={24} className="text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Mission</span>
            </div>
            <h3 className="text-xl font-black mb-2 text-white">Our Mission</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {base?.mission ?? 'To provide world-class sports and event facilities that inspire excellence, unity, and growth in every individual and community we serve.'}
            </p>
          </div>
          {/* Video teaser card */}
          <div
            className={`bento-item p-8 relative overflow-hidden min-h-[180px] flex flex-col justify-between group ${base?.main_vid ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => base?.main_vid && setVideoOpen(true)}
          >
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1697562160779-fed83c21a2cd"
                alt="Sports players on illuminated field at night"
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
            <div className="relative z-10 flex justify-end">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-white mb-1">Facility Tour</h3>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Watch Video</p>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </section>

    {/* Video Modal */}
    {videoOpen && base?.main_vid && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={() => setVideoOpen(false)}
      >
        <div
          className="relative w-full max-w-3xl mx-4 rounded-2xl overflow-hidden bg-black border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
          <video
            src={base.main_vid}
            controls
            autoPlay
            className="w-full max-h-[70vh]"
          />
        </div>
      </div>
    )}
    </>
  );
}