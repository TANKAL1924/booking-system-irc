import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Sport {
  id: number;
  sport: string;
  description: string[];
}

export default function SportSection() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionDesc, setSectionDesc] = useState<string>('');

  useEffect(() => {
    supabase.from('base').select('sport_description').eq('id', 1).single().then(({ data }) => {
      if (data) setSectionDesc(data.sport_description ?? '');
    });
    supabase.from('sport').select('*').order('id').then(({ data }) => {
      if (data) setSports(data as Sport[]);
      setLoading(false);
    });
  }, []);

  if (!loading && sports.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            What We Offer
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            IRC NEGERI SEMBILAN<br />
            <span className="gradient-text-brand">SPORTS SECTION</span>
          </h2>
          {sectionDesc && (
            <p className="mt-4 text-white text-sm md:text-base max-w-2xl leading-relaxed">{sectionDesc}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                className="glass-card rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name="TrophyIcon" size={18} className="text-primary" />
                  </div>
                  <h3 className="font-black text-white text-lg">{s.sport}</h3>
                </div>
                <ul className="space-y-2">
                  {(s.description ?? []).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                      <Icon name="CheckCircleIcon" size={14} className="text-accent shrink-0 mt-0.5" variant="solid" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
