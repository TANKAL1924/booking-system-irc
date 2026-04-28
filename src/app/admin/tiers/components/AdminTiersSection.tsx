import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Tier } from '../service/TiersAdmin';
import { fetchTiers, createTier, updateTier, deleteTier } from '../service/TiersAdmin';

const emptyForm = { name: '', description: '', price: '', wa_number: '', list_details: '' };

export default function AdminTiersSection() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTiers = async () => {
    setLoading(true);
    try {
      const data = await fetchTiers();
      setTiers(data);
    } catch {
      // silently fail on load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTiers(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (tier: Tier) => {
    setEditingId(tier.id);
    setForm({
      name: tier.name ?? '',
      description: tier.description ?? '',
      price: String(tier.price ?? ''),
      wa_number: tier.wa_number ?? '',
      list_details: (tier.list_details ?? []).join('\n'),
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      wa_number: form.wa_number,
      list_details: form.list_details
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingId !== null) {
        await updateTier(editingId, payload);
      } else {
        await createTier(payload);
      }
      setShowForm(false);
      loadTiers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTier(id);
      loadTiers();
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Membership Tiers</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          <Icon name="PlusIcon" size={14} />
          New Tier
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">{editingId !== null ? 'Edit Tier' : 'Add New Tier'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Tier Name</label>
              <input
                type="text"
                placeholder="e.g. Pro"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Price (RM)</label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                min="0"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Description</label>
            <input
              type="text"
              placeholder="e.g. Perfect for casual players"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">WhatsApp Number</label>
            <input
              type="text"
              placeholder="e.g. 60123456789"
              value={form.wa_number}
              onChange={(e) => setForm((p) => ({ ...p, wa_number: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">
              Benefits <span className="normal-case text-white/20 font-medium">(one per line)</span>
            </label>
            <textarea
              rows={5}
              placeholder={"10% discount on bookings\nPriority booking (3 days)\nFree parking"}
              value={form.list_details}
              onChange={(e) => setForm((p) => ({ ...p, list_details: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-primary text-xs font-medium">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Tier'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tiers List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : tiers.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-white/30 text-sm font-medium">
          No tiers yet. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="glass-card rounded-2xl p-6 space-y-4 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-black text-lg">{tier.name}</p>
                  <p className="text-accent font-black text-2xl">RM {tier.price}<span className="text-white/30 text-sm font-medium">/year</span></p>
                  {tier.description && (
                    <p className="text-white/50 text-xs mt-1">{tier.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(tier)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Edit tier"
                  >
                    <Icon name="PencilSquareIcon" size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id)}
                    className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                    aria-label="Delete tier"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              </div>

              {tier.wa_number && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  WA: <span className="text-[#25D366] normal-case tracking-normal font-medium">{tier.wa_number}</span>
                </p>
              )}

              <ul className="space-y-2 flex-1">
                {(tier.list_details ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <Icon name="CheckCircleIcon" size={13} className="text-accent shrink-0 mt-0.5" variant="solid" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
