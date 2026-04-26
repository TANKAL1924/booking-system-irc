import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import {
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  uploadFacilityImage,
  type Facility,
  type FacilityPayload,
} from '../service/FacilitiesAdmin';

const emptyForm: FacilityPayload = {
  name: '',
  description: '',
  price_per_hour: 0,
  status: true,
  pic_link: null,
};

export default function FacilitiesManagementSection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FacilityPayload>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setFacilities(await fetchFacilities());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (f: Facility) => {
    const { id, ...rest } = f;
    setForm(rest);
    setEditingId(id);
    setImageFile(null);
    setImagePreview(f.pic_link);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleToggle = async (f: Facility) => {
    try {
      const { id, ...rest } = f;
      await updateFacility(id, { ...rest, status: !f.status });
      setFacilities((prev) => prev.map((x) => (x.id === id ? { ...x, status: !x.status } : x)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this facility?')) return;
    try {
      await deleteFacility(id);
      setFacilities((prev) => prev.filter((f) => f.id !== id));
      showToast('Facility deleted.');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let pic_link = form.pic_link;

      if (imageFile) {
        setUploading(true);
        pic_link = await uploadFacilityImage(imageFile);
        setUploading(false);
      }

      const payload: FacilityPayload = { ...form, pic_link };

      if (editingId !== null) {
        await updateFacility(editingId, payload);
        showToast('Facility updated!');
      } else {
        await createFacility(payload);
        showToast('Facility added!');
      }

      await load();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Facilities Management</h2>
          <p className="text-white/40 text-sm mt-1">Add, edit, delete or disable facilities and set per-hour pricing</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shrink-0"
        >
          <Icon name="PlusIcon" size={14} />
          Add Facility
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-5">
          <Icon name="CheckCircleIcon" size={16} className="text-[#25D366]" />
          <p className="text-[#25D366] text-sm font-bold">{toast}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-5">
          <Icon name="ExclamationCircleIcon" size={16} className="text-primary" />
          <p className="text-primary text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 mb-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">
            {editingId !== null ? 'Edit Facility' : 'Add New Facility'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Facility Name</label>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. Upper Field"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Price Per Hour (RM)</label>
              <input
                type="number"
                value={form.price_per_hour ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, price_per_hour: Number(e.target.value) }))}
                required
                min={0}
                placeholder="e.g. 150"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, status: !p.status }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.status ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label="Toggle status"
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.status ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-white/60 text-sm font-medium">{form.status ? 'Enabled' : 'Disabled'}</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Description</label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Facility description..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Facility Image</label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <AppImage src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 text-white/60 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon name="PhotoIcon" size={14} />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </button>
                  {imageFile && (
                    <p className="text-white/30 text-xs mt-2 truncate">{imageFile.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-60"
            >
              {(saving || uploading) && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {uploading ? 'Uploading...' : saving ? 'Saving...' : editingId !== null ? 'Update Facility' : 'Add Facility'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setError(''); }}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Facilities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-56 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : facilities.length === 0 ? (
        <p className="text-white/30 text-sm">No facilities yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {facilities.map((f) => (
            <div key={f.id} className={`glass-card rounded-2xl overflow-hidden flex flex-col ${!f.status ? 'opacity-60' : ''}`}>
              {f.pic_link ? (
                <div className="relative h-36 overflow-hidden">
                  <AppImage src={f.pic_link} alt={f.name ?? 'Facility'} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 to-transparent" />
                </div>
              ) : (
                <div className="h-20 bg-white/5 flex items-center justify-center">
                  <Icon name="PhotoIcon" size={22} className="text-white/10" />
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${f.status ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-white/10 text-white/30'}`}>
                        {f.status ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-white font-black text-base truncate">{f.name}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(f)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${f.status ? 'bg-[#25D366]' : 'bg-white/10'}`}
                    aria-label={`Toggle ${f.name}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${f.status ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {f.description && (
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{f.description}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-0.5">Per Hour</p>
                    <p className="text-accent font-black text-lg">RM {f.price_per_hour ?? 'â€”'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(f)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Edit"
                    >
                      <Icon name="PencilSquareIcon" size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                      aria-label="Delete"
                    >
                      <Icon name="TrashIcon" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
