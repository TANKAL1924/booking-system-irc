import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MembershipTier {
  id: number;
  name: string;
  price: number;
  duration: string;
  whatsapp: string;
  description: string;
}

const initialTiers: MembershipTier[] = [
  { id: 1, name: 'Soccer Veteran', price: 150, duration: 'Monthly', whatsapp: '+60 12-345 6789', description: 'For veteran soccer players aged 40+' },
  { id: 2, name: 'Soccer Master', price: 150, duration: 'Monthly', whatsapp: '+60 12-345 6789', description: 'For master category soccer players aged 45+' },
  { id: 3, name: 'Soccer Grandmaster', price: 150, duration: 'Monthly', whatsapp: '+60 12-345 6789', description: 'For grandmaster category soccer players aged 50+' },
  { id: 4, name: 'Soccer Academy', price: 160, duration: 'Monthly', whatsapp: '+60 11-234 5678', description: 'Youth soccer training and development program' },
  { id: 5, name: 'Hockey Academy', price: 200, duration: 'Monthly', whatsapp: '+60 16-789 0123', description: 'Structured hockey training for all skill levels' },
  { id: 6, name: 'Athletic Academy', price: 180, duration: 'Monthly', whatsapp: '+60 17-456 7890', description: 'Track & field athletics training program' },
];

const emptyTier: Omit<MembershipTier, 'id'> = {
  name: '',
  price: 0,
  duration: 'Monthly',
  whatsapp: '',
  description: '',
};

export default function MemberManagementSection() {
  const [tiers, setTiers] = useState<MembershipTier[]>(initialTiers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<MembershipTier, 'id'>>(emptyTier);
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = (msg = 'Saved successfully!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const openAdd = () => {
    setForm(emptyTier);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (tier: MembershipTier) => {
    const { id, ...rest } = tier;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
    showSaved('Tier deleted.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setTiers((prev) => prev.map((t) => (t.id === editingId ? { ...form, id: editingId } : t)));
      showSaved('Tier updated!');
    } else {
      setTiers((prev) => [...prev, { ...form, id: Date.now() }]);
      showSaved('Tier added!');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyTier);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Membership Tier Configuration</h2>
          <p className="text-white/40 text-sm mt-1">Configure membership tiers, pricing and WhatsApp contact numbers</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          <Icon name="PlusIcon" size={14} />
          Add Tier
        </button>
      </div>

      {/* Success message */}
      {savedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-5">
          <Icon name="CheckCircleIcon" size={16} className="text-[#25D366]" />
          <p className="text-[#25D366] text-sm font-bold">{savedMsg}</p>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 mb-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">
            {editingId !== null ? 'Edit Membership Tier' : 'Add New Membership Tier'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Tier Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. Soccer Veteran"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Price (RM)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                required
                min={0}
                placeholder="e.g. 150"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Monthly" className="bg-[#1A1A1A]">Monthly</option>
                <option value="Quarterly" className="bg-[#1A1A1A]">Quarterly</option>
                <option value="Yearly" className="bg-[#1A1A1A]">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">WhatsApp Contact</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                required
                placeholder="+60 12-345 6789"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of this tier"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              {editingId !== null ? 'Update Tier' : 'Add Tier'}
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

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div key={tier.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4">
            {/* Tier header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-black text-white text-base leading-tight">{tier.name}</h3>
                {tier.description && (
                  <p className="text-white/40 text-xs mt-1 leading-snug">{tier.description}</p>
                )}
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                {tier.duration}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-yellow-400">RM {tier.price}</span>
              <span className="text-white/30 text-xs mb-1">/ {tier.duration.toLowerCase()}</span>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${tier.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#25D366] text-sm font-bold hover:underline"
            >
              <Icon name="PhoneIcon" size={14} className="text-[#25D366]" />
              {tier.whatsapp}
            </a>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-white/5">
              <button
                onClick={() => openEdit(tier)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all"
              >
                <Icon name="PencilIcon" size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(tier.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest transition-all"
              >
                <Icon name="TrashIcon" size={12} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {tiers.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-16 text-white/20">
            <Icon name="TagIcon" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold text-sm">No membership tiers configured yet.</p>
            <p className="text-xs mt-1">Click "Add Tier" to create your first tier.</p>
          </div>
        )}
      </div>
    </div>
  );
}
