import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Facility {
  id: number;
  name: string;
  description: string;
  pricePerHour: number;
  category: string;
  enabled: boolean;
}

const initialFacilities: Facility[] = [
  { id: 1, name: 'Upper Field', description: 'Full-size multipurpose field suitable for football, rugby and large events.', pricePerHour: 150, category: 'Field', enabled: true },
  { id: 2, name: 'Lower Field', description: 'Secondary field for training sessions and smaller sports events.', pricePerHour: 120, category: 'Field', enabled: true },
  { id: 3, name: 'Hockey Turf', description: 'International-standard artificial turf for hockey matches and training.', pricePerHour: 180, category: 'Turf', enabled: false },
  { id: 4, name: '100m Track', description: 'Certified 100-metre athletics track for sprinting and training.', pricePerHour: 80, category: 'Track', enabled: true },
  { id: 5, name: 'Glasshouse Hall', description: 'Elegant glass-walled hall for weddings, engagements and corporate events.', pricePerHour: 300, category: 'Hall', enabled: true },
  { id: 6, name: 'Garden Hall', description: 'Outdoor garden hall with natural ambience for events up to 500 pax.', pricePerHour: 250, category: 'Hall', enabled: true },
  { id: 7, name: 'Banquet Hall', description: 'Grand banquet hall for large-scale events and graduations up to 900 pax.', pricePerHour: 400, category: 'Hall', enabled: false },
];

const emptyFacility: Omit<Facility, 'id'> = {
  name: '', description: '', pricePerHour: 0, category: '', enabled: true,
};

export default function FacilitiesManagementSection() {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Facility, 'id'>>(emptyFacility);
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = (msg = 'Saved successfully!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const openAdd = () => {
    setForm(emptyFacility);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (f: Facility) => {
    const { id, ...rest } = f;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    showSaved('Facility deleted.');
  };

  const handleToggle = (id: number) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setFacilities((prev) => prev.map((f) => (f.id === editingId ? { ...form, id: editingId } : f)));
      showSaved('Facility updated!');
    } else {
      setFacilities((prev) => [...prev, { ...form, id: Date.now() }]);
      showSaved('Facility added!');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyFacility);
  };

  const categories = ['Field', 'Turf', 'Track', 'Hall', 'Court', 'Other'];

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

      {savedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-5">
          <Icon name="CheckCircleIcon" size={16} className="text-[#25D366]" />
          <p className="text-[#25D366] text-sm font-bold">{savedMsg}</p>
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
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. Upper Field"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#1A1A1A]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Price Per Hour (RM)</label>
              <input
                type="number"
                value={form.pricePerHour}
                onChange={(e) => setForm((p) => ({ ...p, pricePerHour: Number(e.target.value) }))}
                required
                min={0}
                placeholder="e.g. 150"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, enabled: !p.enabled }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.enabled ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label="Toggle enabled"
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.enabled ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-white/60 text-sm font-medium">{form.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Facility description..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
              {editingId !== null ? 'Update Facility' : 'Add Facility'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {facilities.map((f) => (
          <div key={f.id} className={`glass-card rounded-2xl p-5 flex flex-col gap-4 ${!f.enabled ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{f.category}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${f.enabled ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-white/10 text-white/30'}`}>
                    {f.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-white font-black text-base">{f.name}</p>
              </div>
              <button
                onClick={() => handleToggle(f.id)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${f.enabled ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label={`Toggle ${f.name}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${f.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">{f.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-0.5">Per Hour</p>
                <p className="text-accent font-black text-lg">RM {f.pricePerHour}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(f)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Edit facility"
                >
                  <Icon name="PencilSquareIcon" size={13} />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                  aria-label="Delete facility"
                >
                  <Icon name="TrashIcon" size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
