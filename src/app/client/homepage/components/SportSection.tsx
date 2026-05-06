import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Sport {
  id: number;
  sport: string;
  description: string[];
  sport_pic: string | null;
}

interface SportTeam {
  id: number;
  name: string | null;
  phone: string | null;
  position: string | null;
  sport_id: number;
}

interface GalleryItem {
  id: number;
  gallery_link: string;
}

function GalleryLightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.gallery_link} alt="Gallery" className="w-full object-contain max-h-[85vh] rounded-2xl" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function SportModal({ sport, onClose }: { sport: Sport; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {sport.sport_pic && (
          <img src={sport.sport_pic} alt={sport.sport} className="w-full object-contain max-h-[60vh]" />
        )}
        <div className="bg-[#1a1a1a] p-6">
          <h3 className="text-white font-black text-xl mb-3">{sport.sport}</h3>
          <ul className="space-y-2">
            {(sport.description ?? []).map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                <Icon name="CheckCircleIcon" size={14} className="text-primary shrink-0 mt-0.5" variant="solid" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function SportSection() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionDesc, setSectionDesc] = useState<string>('');
  const [selected, setSelected] = useState<Sport | null>(null);
  const [teamMap, setTeamMap] = useState<Record<number, SportTeam[]>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    supabase.from('base').select('sport_description').eq('id', 1).single().then(({ data }) => {
      if (data) setSectionDesc(data.sport_description ?? '');
    });
    supabase.from('sport').select('*').order('id').then(({ data }) => {
      if (data) setSports(data as Sport[]);
      setLoading(false);
    });
    supabase.from('sport_team').select('*').order('id').then(({ data }) => {
      if (data) {
        const map: Record<number, SportTeam[]> = {};
        (data as SportTeam[]).forEach((m) => {
          if (!map[m.sport_id]) map[m.sport_id] = [];
          map[m.sport_id].push(m);
        });
        setTeamMap(map);
      }
    });
    supabase
      .from('gallery')
      .select('id, gallery_link')
      .not('gallery_link', 'is', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setGallery(data as GalleryItem[]);
      });
  }, []);

  if (!loading && sports.length === 0) return null;

  return (
    <section className="pt-8 pb-20 px-4 sm:px-6">
      {selected && <SportModal sport={selected} onClose={() => setSelected(null)} />}
      {lightbox && <GalleryLightbox item={lightbox} onClose={() => setLightbox(null)} />}
      <div className="max-w-7xl mx-auto w-full">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            Introducing
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            IRC NEGERI SEMBILAN <span className="gradient-text-brand"> CLUB</span>
          </h2>
          {sectionDesc && (
            <div className="mt-4 text-white text-sm leading-relaxed w-full space-y-3">
              {sectionDesc
                .split('\n')
                .filter((p) => p.trim() !== '')
                .map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white mt-8">
            <span className="gradient-text-brand"> SPORTS SECTION</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {sports.map((s, idx) => {
              const members = teamMap[s.id] ?? [];
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: 'easeOut' }}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Sport info */}
                    <div
                      className="lg:w-1/3 relative cursor-pointer group overflow-hidden"
                      style={{ minHeight: '220px' }}
                      onClick={() => setSelected(s)}
                    >
                      {s.sport_pic ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${s.sport_pic})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-white/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 lg:bg-gradient-to-r lg:from-black/10 lg:via-black/40 lg:to-black/80" />
                      <div className="relative z-10 p-6 flex flex-col justify-end h-full" style={{ minHeight: '220px' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                            <Icon name="TrophyIcon" size={16} className="text-primary" />
                          </div>
                          <h3 className="font-black text-white text-xl">{s.sport}</h3>
                        </div>
                        <ul className="space-y-1.5">
                          {(s.description ?? []).slice(0, 3).map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                              <Icon name="CheckCircleIcon" size={13} className="text-primary shrink-0 mt-0.5" variant="solid" />
                              {bullet}
                            </li>
                          ))}
                          {(s.description ?? []).length > 3 && (
                            <li className="text-xs text-white/40 pl-5">+{s.description.length - 3} more</li>
                          )}
                        </ul>
                        <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary/70">Tap for details</span>
                      </div>
                    </div>

                    {/* Right: Team members */}
                    <div className="lg:w-2/3 p-6 border-t border-white/10 lg:border-t-0 lg:border-l">
                      <p className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Team Members</p>
                      {members.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-white/20 text-sm font-bold">
                          No team members listed yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                          {members.map((m) => (
                            <div
                              key={m.id}
                              className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-1"
                            >
                              <span className="font-black text-white text-sm leading-tight">{m.name ?? '—'}</span>
                              {m.position && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{m.position}</span>
                              )}
                              {m.phone && (
                                <span className="text-[11px] text-white/40 mt-0.5">{m.phone}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-20"
          >
            <div className="mb-10">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
                Memories
              </span>
              <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
                GALLERY IRC SPORTS<span className="gradient-text-brand"> SECTION</span>
              </h2>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {gallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (idx % 8) * 0.05, ease: 'easeOut' }}
                  onClick={() => setLightbox(item)}
                >
                  <img
                    src={item.gallery_link}
                    alt="Gallery"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
