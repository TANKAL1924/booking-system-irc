import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Sport } from '../service/SportAdmin';
import { fetchSports, createSport, updateSport, deleteSport } from '../service/SportAdmin';

const emptyForm = { sport: '', description: '' };

export default function SportManagementSection() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setSports(await fetchSports());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (s: Sport) => {
    setEditingId(s.id);
    setForm({ sport: s.sport ?? '', description: (s.description ?? []).join('\n') });
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      sport: form.sport.trim(),
      description: form.description.split('\n').map((l) => l.trim()).filter(Boolean),
    };
    try {
      if (editingId !== null) {
        await updateSport(editingId, payload);
      } else {
        await createSport(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteSport(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Sport Management</h2>
          <p className="text-white text-sm mt-1">Add and manage sports offered at the arena</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          <Icon name="PlusIcon" size={13} />
          Add Sport
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 mb-6 space-y-4 border border-white/10">
          <h3 className="font-bold text-white text-sm">
            {editingId !== null ? 'Edit Sport' : 'New Sport'}
          </h3>
          {error && (
            <p className="text-red-400 text-xs font-bold">{error}</p>
          )}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Sport Name</label>
            <input
              type="text"
              required
              value={form.sport}
              onChange={(e) => setForm((p) => ({ ...p, sport: e.target.value }))}
              placeholder="e.g. Badminton"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">
              Description (one bullet per line)
            </label>
            <textarea
              rows={6}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={"e.g.\nOpen to all skill levels\nEquipment available for rent\nBooking required"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sports.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Icon name="TrophyIcon" size={32} className="text-white mx-auto mb-3" />
          <p className="text-white text-sm font-bold">No sports added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sports.map((s) => (
            <div key={s.id} className="glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm mb-2">{s.sport}</p>
                <ul className="space-y-1">
                  {(s.description ?? []).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white">
                      <span className="text-primary mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-white transition-colors"
                >
                  <Icon name="PencilSquareIcon" size={14} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Icon name="TrashIcon" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
