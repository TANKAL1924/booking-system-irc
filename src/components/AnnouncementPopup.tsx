import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Icon from '@/components/ui/AppIcon';

export default function AnnouncementPopup() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    supabase
      .from('announcement')
      .select('ann_link')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.ann_link) {
          setImageUrl(data.ann_link);
          setVisible(true);
        }
      });
  }, []);

  const close = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible]);

  if (!visible || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:text-white hover:bg-black/70 transition-all"
          aria-label="Close"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>
        <img
          src={imageUrl}
          alt="Announcement"
          className="w-full object-contain max-h-[80vh]"
        />
      </div>
    </div>
  );
}
