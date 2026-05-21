import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';

interface HeaderItem {
  id: number;
  link: string;
  created_at: string;
}

export default function AdminHeaderSection() {
  const [items, setItems] = useState<HeaderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('header')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setItems(data as HeaderItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const url = await uploadToR2(file, 'header');
        await supabase.from('header').insert({ link: url });
      } catch {
        setError(`Failed to upload ${file.name}`);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    await load();
  };

  const handleDelete = async (item: HeaderItem) => {
    setDeletingId(item.id);
    try {
      await deleteFromR2(item.link).catch(() => {});
      await supabase.from('header').delete().eq('id', item.id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Header Slider</h2>
          <p className="text-white text-sm mt-1">Upload images for the homepage coverflow slider</p>
        </div>
        <label
          className={`flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Icon name="ArrowUpTrayIcon" size={13} />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-red-400 text-xs font-bold mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Icon name="PhotoIcon" size={32} className="text-white mx-auto mb-3" />
          <p className="text-white text-sm font-bold">No slides yet. Upload images above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video"
            >
              <img
                src={item.link}
                alt="Slide"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="w-9 h-9 rounded-full bg-red-500/80 border border-red-400/30 flex items-center justify-center text-white hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {deletingId === item.id
                    ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Icon name="TrashIcon" size={14} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
