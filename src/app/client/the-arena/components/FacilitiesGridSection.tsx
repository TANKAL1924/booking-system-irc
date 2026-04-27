import { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { supabase } from '@/lib/supabase';
import { Scene, Reveal } from 'react-kino';

interface Facility {
  id: number;
  name: string | null;
  price_per_hour: number | null;
  description: string | null;
  status: string | null;
  pic_link: string | null;
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

  return (
    <Scene duration="240vh">
    <section id="facilities" className="min-h-screen flex flex-col justify-center py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <Reveal animation="fade-up" at={0.06}>
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Our Venues</span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            ALL <span className="gradient-text-brand">ARENA</span>
          </h2>
        </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden h-72 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-white/30 text-sm">No arenas available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, idx) => (
              <Reveal key={f.id} animation="scale" at={0.2 + idx * 0.07}>
              <div className="glass-card rounded-2xl overflow-hidden group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  {f.pic_link ? (
                    <AppImage
                      src={f.pic_link}
                      alt={f.name ?? 'Arena'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/20 text-xs font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-white">{f.name}</h3>
                    {f.price_per_hour != null && (
                      <span className="text-accent font-black text-sm whitespace-nowrap ml-2">
                        RM {f.price_per_hour}/hr
                      </span>
                    )}
                  </div>
                  {f.description && (
                    <p className="text-white/50 text-xs leading-relaxed flex-1">{f.description}</p>
                  )}
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
    </Scene>
  );
}
