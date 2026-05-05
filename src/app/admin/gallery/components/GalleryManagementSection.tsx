import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: number;
  gallery_link: string;
  created_at: string;
}

export default function GalleryManagementSection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data as GalleryItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, file, { upsert: false });
      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);
      await supabase.from('gallery').insert({ gallery_link: urlData.publicUrl });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    await load();
  };

  const handleDelete = async (item: GalleryItem) => {
    setDeletingId(item.id);
    try {
      // Remove from storage
      const path = item.gallery_link.split('/gallery/')[1];
      if (path) await supabase.storage.from('gallery').remove([path]);
      // Remove from table
      await supabase.from('gallery').delete().eq('id', item.id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Gallery Management</h2>
          <p className="text-white text-sm mt-1">Upload and manage gallery images</p>
        </div>
        <label className={`flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
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

      {error && (
        <p className="text-red-400 text-xs font-bold mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Icon name="PhotoIcon" size={32} className="text-white mx-auto mb-3" />
          <p className="text-white text-sm font-bold">No images yet. Upload some above.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid mb-4 relative group rounded-xl overflow-hidden border border-white/10">
              <img
                src={item.gallery_link}
                alt="Gallery"
                className="w-full object-cover"
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
