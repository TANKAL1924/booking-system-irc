import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import AppImage from '@/components/ui/AppImage';

export default function AnnouncementsSection() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('announcement')
      .select('ann_link')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        setImageUrl(data?.ann_link ?? null);
        setLoading(false);
      });
  }, []);

  if (loading || !imageUrl) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="mb-12">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
              Updates
            </span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
              LATEST<br />
              <span className="gradient-text-brand">ANNOUNCEMENT</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="glass-card rounded-2xl overflow-hidden max-w-xl mx-auto">
            <AppImage src={imageUrl} alt="Announcement" className="w-full object-contain" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

