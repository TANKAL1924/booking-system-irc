import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import ConfirmModal from '@/components/ConfirmModal';
import {
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  uploadFacilityImage,
  type Facility,
  type FacilityPayload,
  type FacilitySlot,
  type FacilityAddOn,
} from '../service/FacilitiesAdmin';

const emptyForm: FacilityPayload = {
  name: '',
  status: true,
  pic_link: [],
  type: true,
  slots: [],
  add_on: [],
  pic_contact: null,
  description: [],
  morning_fee: null,
  night_fee: null,
};

export default function FacilitiesManagementSection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FacilityPayload>(emptyForm);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [addOnUploading, setAddOnUploading] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addOnFileRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Slot helpers
  const addSlot = () => setForm((p) => ({ ...p, slots: [...(p.slots ?? []), { start: '07:00', end: '19:00', hour: 1, price: 0 }] }));
  const removeSlot = (i: number) => setForm((p) => ({ ...p, slots: (p.slots ?? []).filter((_, idx) => idx !== i) }));
  const updateSlot = (i: number, field: keyof FacilitySlot, value: string | number) =>
    setForm((p) => ({ ...p, slots: (p.slots ?? []).map((s, idx) => idx === i ? { ...s, [field]: value } : s) }));

  // Add-on helpers
  const addAddOn = () => setForm((p) => ({ ...p, add_on: [...(p.add_on ?? []), { name: '', price: 0, hour_add_on: 1, pic_add_on: '' }] }));
  const removeAddOn = (i: number) => setForm((p) => ({ ...p, add_on: (p.add_on ?? []).filter((_, idx) => idx !== i) }));
  const updateAddOn = (i: number, field: keyof FacilityAddOn, value: string | number) =>
    setForm((p) => ({ ...p, add_on: (p.add_on ?? []).map((a, idx) => idx === i ? { ...a, [field]: value } : a) }));

  // Description helpers (halls only)
  const [descInput, setDescInput] = useState('');
  const addDescItem = () => {
    if (!descInput.trim()) return;
    setForm((p) => ({ ...p, description: [...(p.description ?? []), descInput.trim()] }));
    setDescInput('');
  };
  const removeDescItem = (i: number) => setForm((p) => ({ ...p, description: (p.description ?? []).filter((_, idx) => idx !== i) }));

  const handleAddOnImageChange = async (i: number, file: File) => {
    setAddOnUploading(i);
    try {
      const url = await uploadFacilityImage(file);
      updateAddOn(i, 'pic_add_on', url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddOnUploading(null);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPendingFiles([]);
    setShowForm(true);
  };

  const openEdit = (f: Facility) => {
    const { id, ...rest } = f;
    setForm({
      ...rest,
      pic_link: rest.pic_link ?? [],
      type: rest.type ?? true,
      slots: rest.slots ?? [],
      add_on: rest.add_on ?? [],
      pic_contact: rest.pic_contact ?? null,
      description: rest.description ?? [],
    });
    setEditingId(id);
    setPendingFiles([]);
    setShowForm(true);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removePendingFile = (i: number) => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i));
  const removeUploadedImage = (i: number) => setForm((p) => ({ ...p, pic_link: (p.pic_link ?? []).filter((_, idx) => idx !== i) }));

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
    const facility = facilities.find((f) => f.id === id);
    if (!facility) return;
    try {
      await deleteFacility(facility);
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
      let pic_link = form.pic_link ?? [];

      if (pendingFiles.length > 0) {
        setUploading(true);
        const uploaded = await Promise.all(pendingFiles.map((f) => uploadFacilityImage(f)));
        pic_link = [...pic_link, ...uploaded];
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
      setPendingFiles([]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <ConfirmModal
        isOpen={confirmId !== null}
        title="Delete Facility"
        message="This will permanently delete the facility and all its data. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (confirmId !== null) { handleDelete(confirmId); setConfirmId(null); } }}
        onCancel={() => setConfirmId(null)}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Facilities Management</h2>
          <p className="text-white text-sm mt-1">Add, edit, delete or disable facilities and set per-hour pricing</p>
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
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Facility Name</label>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder=""
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Type toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: true }))}
                  className={`px-5 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${form.type ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white hover:text-white'}`}
                >
                  Facility
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: false }))}
                  className={`px-5 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${!form.type ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white hover:text-white'}`}
                >
                  Hall
                </button>
              </div>
            </div>

            {/* Description (halls only) */}
            {!form.type && (
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Hall Description (Bullet Points)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDescItem(); } }}
                    placeholder=""
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addDescItem}
                    disabled={!descInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {(form.description ?? []).length > 0 && (
                  <div className="space-y-1.5">
                    {(form.description ?? []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-primary font-black text-xs shrink-0">•</span>
                        <span className="text-white text-sm flex-1">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeDescItem(i)}
                          className="text-white hover:text-red-400 transition-colors shrink-0"
                        >
                          <Icon name="XMarkIcon" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Morning / Night Fee */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Morning Fee (RM)</label>
              <input
                type="number"
                value={form.morning_fee ?? ''}
                min={0}
                step={0.01}
                onChange={(e) => setForm((p) => ({ ...p, morning_fee: e.target.value === '' ? null : parseFloat(e.target.value) }))}
                placeholder="e.g. 30.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Night Fee (RM)</label>
              <input
                type="number"
                value={form.night_fee ?? ''}
                min={0}
                step={0.01}
                onChange={(e) => setForm((p) => ({ ...p, night_fee: e.target.value === '' ? null : parseFloat(e.target.value) }))}
                placeholder="e.g. 50.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, status: !p.status }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.status ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label="Toggle status"
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.status ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-white text-sm font-medium">{form.status ? 'Enabled' : 'Disabled'}</span>
            </div>

            {/* Main images */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Facility Images</label>
              {/* Uploaded images */}
              {(form.pic_link ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(form.pic_link ?? []).map((url, i) => (
                    <div key={i} className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/10 group">
                      <AppImage src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Icon name="XMarkIcon" size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Pending files */}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {pendingFiles.map((file, i) => (
                    <div key={i} className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/10 border-dashed group">
                      <AppImage src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover opacity-60" />
                      <button
                        type="button"
                        onClick={() => removePendingFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove pending"
                      >
                        <Icon name="XMarkIcon" size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon name="PhotoIcon" size={14} />
                  Add Images
                </button>
              </div>
            </div>

            {/* Contact Number (Hall only) */}
            {!form.type && (
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={form.pic_contact ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, pic_contact: e.target.value }))}
                  placeholder=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

            {/* Slots (Facility only) */}
            {form.type && <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white">Time Slots</label>
                <button
                  type="button"
                  onClick={addSlot}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon name="PlusIcon" size={12} />
                  Add Slot
                </button>
              </div>
              {(form.slots ?? []).length === 0 && (
                <p className="text-white text-xs">No slots added yet.</p>
              )}
              <div className="space-y-2">
                {(form.slots ?? []).map((slot, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Start</label>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateSlot(i, 'start', e.target.value)}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">End</label>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateSlot(i, 'end', e.target.value)}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Hour</label>
                      <input
                        type="number"
                        value={slot.hour}
                        min={1}
                        step={1}
                        onChange={(e) => updateSlot(i, 'hour', Number(e.target.value))}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Price (RM)</label>
                      <input
                        type="number"
                        value={slot.price}
                        min={0}
                        onChange={(e) => updateSlot(i, 'price', Number(e.target.value))}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all mt-3"
                      aria-label="Remove slot"
                    >
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>}

            {/* Add-ons (Facility only) */}
            {form.type && <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white">Add-ons</label>
                <button
                  type="button"
                  onClick={addAddOn}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon name="PlusIcon" size={12} />
                  Add Add-on
                </button>
              </div>
              {(form.add_on ?? []).length === 0 && (
                <p className="text-white text-xs">No add-ons added yet.</p>
              )}
              <div className="space-y-2">
                {(form.add_on ?? []).map((addon, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Name</label>
                      <input
                        type="text"
                        value={addon.name}
                        placeholder=""
                        onChange={(e) => updateAddOn(i, 'name', e.target.value)}
                        className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Hour</label>
                      <input
                        type="number"
                        value={addon.hour_add_on}
                        min={1}
                        step={1}
                        onChange={(e) => updateAddOn(i, 'hour_add_on', Number(e.target.value))}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-white mb-1">Price (RM)</label>
                      <input
                        type="number"
                        value={addon.price}
                        min={0}
                        step={0.01}
                        onChange={(e) => updateAddOn(i, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-3">
                      {addon.pic_add_on && (
                        <div className="relative w-10 h-8 rounded-lg overflow-hidden border border-white/10">
                          <AppImage src={addon.pic_add_on} alt={addon.name} fill className="object-cover" />
                        </div>
                      )}
                      <input
                        ref={(el) => { addOnFileRefs.current[i] = el; }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAddOnImageChange(i, f); }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => addOnFileRefs.current[i]?.click()}
                        disabled={addOnUploading === i}
                        className="flex items-center gap-1 px-2 py-1 border border-white/10 bg-white/5 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest hover:text-white transition-all disabled:opacity-50"
                      >
                        {addOnUploading === i ? (
                          <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Icon name="PhotoIcon" size={11} />
                        )}
                        {addon.pic_add_on ? 'Change' : 'Image'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddOn(i)}
                      className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all mt-3"
                      aria-label="Remove add-on"
                    >
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>}
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
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
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
        <p className="text-white text-sm">No facilities yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {facilities.map((f) => (
            <div key={f.id} className={`glass-card rounded-2xl overflow-hidden flex flex-col ${!f.status ? 'opacity-60' : ''}`}>
              {f.pic_link?.[0] ? (
                <div className="relative h-36 overflow-hidden">
                  <AppImage src={f.pic_link[0]} alt={f.name ?? 'Facility'} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 to-transparent" />
                </div>
              ) : (
                <div className="h-20 bg-white/5 flex items-center justify-center">
                  <Icon name="PhotoIcon" size={22} className="text-white" />
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${f.status ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-white/10 text-white'}`}>
                        {f.status ? 'Active' : 'Disabled'}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {f.type ? 'Facility' : 'Hall'}
                      </span>
                    </div>
                    <p className="text-white font-black text-base truncate">{f.name}</p>
                    {f.type && ((f.slots?.length ?? 0) > 0 || (f.add_on?.length ?? 0) > 0) && (
                      <p className="text-white text-[10px] mt-0.5">
                        {f.slots?.length ?? 0} slot{(f.slots?.length ?? 0) !== 1 ? 's' : ''}
                        {' · '}
                        {f.add_on?.length ?? 0} add-on{(f.add_on?.length ?? 0) !== 1 ? 's' : ''}
                      </p>
                    )}
                    {!f.type && f.pic_contact && (
                      <p className="text-white text-[10px] mt-0.5 flex items-center gap-1">
                        <Icon name="PhoneIcon" size={10} />
                        {f.pic_contact}
                      </p>
                    )}
                    {(f.morning_fee != null || f.night_fee != null) && (
                      <div className="flex items-center gap-2 mt-0.5">
                        {f.morning_fee != null && (
                          <span className="text-[9px] font-bold text-yellow-400">☀ RM {f.morning_fee.toFixed(2)}</span>
                        )}
                        {f.morning_fee != null && f.night_fee != null && (
                          <span className="text-white/20 text-[9px]">·</span>
                        )}
                        {f.night_fee != null && (
                          <span className="text-[9px] font-bold text-blue-400">🌙 RM {f.night_fee.toFixed(2)}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggle(f)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${f.status ? 'bg-[#25D366]' : 'bg-white/10'}`}
                    aria-label={`Toggle ${f.name}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${f.status ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(f)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Edit"
                    >
                      <Icon name="PencilSquareIcon" size={13} />
                    </button>
                    <button
                      onClick={() => setConfirmId(f.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
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
