import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

export default function AdminAnnouncementsSection() {
  const [annImageUrl, setAnnImageUrl] = useState<string | null>(null);
  const [uploadingAnn, setUploadingAnn] = useState(false);
  const [annSavedMsg, setAnnSavedMsg] = useState('');

  useEffect(() => {
    supabase.from('announcement').select('ann_link').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setAnnImageUrl(data.ann_link);
    });
  }, []);

  const handleAnnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAnn(true);
    // Delete old file first (handles extension changes)
    if (annImageUrl) {
      try {
        const parts = new URL(annImageUrl).pathname.split('/layout/');
        if (parts.length > 1) await supabase.storage.from('layout').remove([parts[1]]);
      } catch { /* ignore */ }
    }
    const ext = file.name.split('.').pop();
    const path = `announcement-main.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('layout')
      .upload(path, file, { upsert: true });
    if (uploadError) { setUploadingAnn(false); return; }
    const { data: urlData } = supabase.storage.from('layout').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;
    await supabase.from('announcement').upsert({ id: 1, ann_link: publicUrl });
    setAnnImageUrl(publicUrl);
    setUploadingAnn(false);
    setAnnSavedMsg('Announcement updated!');
    setTimeout(() => setAnnSavedMsg(''), 3000);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-black text-white mb-4">Announcement</h2>
      {annSavedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-4">
          <Icon name="CheckCircleIcon" size={15} className="text-[#25D366]" />
          <p className="text-[#25D366] text-xs font-bold">{annSavedMsg}</p>
        </div>
      )}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
        {annImageUrl ? (
          <img src={annImageUrl} alt="Announcement" className="w-20 h-14 object-cover rounded-xl border border-white/10 shrink-0" />
        ) : (
          <div className="w-20 h-14 rounded-xl border border-dashed border-white/10 flex items-center justify-center shrink-0">
            <Icon name="PhotoIcon" size={18} className="text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">
            {annImageUrl ? 'Announcement poster uploaded' : 'No announcement poster yet'}
          </p>
          <p className="text-white text-xs mt-0.5">Shown as popup on client homepage</p>
        </div>
        <label className={`flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all cursor-pointer shrink-0 ${uploadingAnn ? 'opacity-50 pointer-events-none' : ''}`}>
          <Icon name="ArrowUpTrayIcon" size={13} />
          {uploadingAnn ? 'Uploading...' : annImageUrl ? 'Replace' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleAnnUpload} disabled={uploadingAnn} />
        </label>
      </div>
    </div>
  );
}
