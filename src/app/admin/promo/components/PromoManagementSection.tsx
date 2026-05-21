import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Promo } from '../service/PromoAdmin';
import { fetchPromos, createPromo, updatePromo, deletePromo, resetPromo } from '../service/PromoAdmin';

const emptyForm = { promo_code: '', promo_price: '' };

export default function PromoManagementSection() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPromos = async () => {
    setLoading(true);
    try {
      const data = await fetchPromos();
      setPromos(data);
    } catch {
      // silently fail on load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPromos(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (promo: Promo) => {
    setEditingId(promo.id);
    setForm({
      promo_code: promo.promo_code ?? '',
      promo_price: String(promo.promo_price ?? ''),
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const pct = parseFloat(form.promo_price);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError('Discount must be between 0 and 100.');
      return;
    }
    setSaving(true);
    const payload = {
      promo_code: form.promo_code.trim().toUpperCase(),
      promo_price: pct,
    };
    try {
      if (editingId !== null) {
        await updatePromo(editingId, payload);
      } else {
        await createPromo(payload);
      }
      setShowForm(false);
      loadPromos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromo(id);
      loadPromos();
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Promo Codes</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          <Icon name="PlusIcon" size={14} />
          New Promo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">{editingId !== null ? 'Edit Promo' : 'Add New Promo'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1.5">Promo Code</label>
              <input
                type="text"
                value={form.promo_code}
                onChange={(e) => setForm((p) => ({ ...p, promo_code: e.target.value }))}
                required
                placeholder="e.g. SAVE20"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1.5">Discount (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.promo_price}
                  onChange={(e) => setForm((p) => ({ ...p, promo_price: e.target.value }))}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 20"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-sm font-bold">%</span>
              </div>
            </div>
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
              {saving ? 'Saving...' : 'Save Promo'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Promo List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-white text-sm font-medium">
          No promo codes yet. Add one above.
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Code</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Discount</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Status</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-black text-white tracking-widest">{promo.promo_code}</td>
                  <td className="px-6 py-4 text-accent font-bold">{promo.promo_price}%</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      promo.used
                        ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {promo.used ? 'Available' : 'Used'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!promo.used && (
                        <button
                          onClick={async () => { await resetPromo(promo.id); loadPromos(); }}
                          className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                          aria-label="Reset promo"
                          title="Reset to available"
                        >
                          <Icon name="ArrowPathIcon" size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(promo)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        aria-label="Edit promo"
                      >
                        <Icon name="PencilSquareIcon" size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                        aria-label="Delete promo"
                      >
                        <Icon name="TrashIcon" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
