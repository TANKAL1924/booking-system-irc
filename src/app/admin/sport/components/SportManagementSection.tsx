import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Sport, SportTeam } from '../service/SportAdmin';
import {
  fetchSports, createSport, updateSport, deleteSport, uploadSportPic, deleteSportPic,
  fetchTeamBySport, createTeamMember, updateTeamMember, deleteTeamMember,
} from '../service/SportAdmin';

const emptyMemberForm = { name: '', phone: '', position: '' };

function TeamSection({ sport }: { sport: Sport }) {
  const [members, setMembers] = useState<SportTeam[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<SportTeam | null>(null);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [savingMember, setSavingMember] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);
  const [memberError, setMemberError] = useState('');

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      setMembers(await fetchTeamBySport(sport.id));
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => { loadMembers(); }, [sport.id]);

  const openEditMember = (m: SportTeam) => {
    setEditingMember(m);
    setMemberForm({ name: m.name ?? '', phone: m.phone ?? '', position: m.position ?? '' });
    setMemberError('');
    setShowAddForm(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    setSavingMember(true);
    try {
      const payload = {
        name: memberForm.name.trim() || null,
        phone: memberForm.phone.trim() || null,
        position: memberForm.position.trim() || null,
        sport_id: sport.id,
      };
      if (editingMember) {
        await updateTeamMember(editingMember.id, payload);
      } else {
        await createTeamMember(payload);
      }
      setShowAddForm(false);
      loadMembers();
    } catch (err) {
      setMemberError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    setDeletingMemberId(id);
    try {
      await deleteTeamMember(id);
      loadMembers();
    } finally {
      setDeletingMemberId(null);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-primary text-[10px] font-bold uppercase tracking-widest">
          Team Members ({members.length})
        </p>
      </div>

      {/* Add / Edit member form */}
      {showAddForm && (
        <form onSubmit={handleSaveMember} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 space-y-3">
          {memberError && <p className="text-red-400 text-xs font-bold">{memberError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1.5">Name</label>
              <input
                type="text"
                value={memberForm.name}
                onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1.5">Position</label>
              <input
                type="text"
                value={memberForm.position}
                onChange={(e) => setMemberForm((p) => ({ ...p, position: e.target.value }))}
                placeholder="e.g. Captain"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1.5">Phone</label>
              <input
                type="text"
                value={memberForm.phone}
                onChange={(e) => setMemberForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="011-12345678"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={savingMember}
              className="px-4 py-2 bg-primary text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {savingMember ? 'Saving...' : (editingMember ? 'Update' : 'Add')}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Members list */}
      {loadingMembers ? (
        <div className="flex items-center gap-2 py-3 text-white/40 text-xs">
          <span className="w-3.5 h-3.5 border border-white/20 border-t-white rounded-full animate-spin" />
          Loading...
        </div>
      ) : members.length === 0 ? (
        <p className="text-white/30 text-xs py-2">No members yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{m.name ?? '—'}</p>
                {m.position && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">{m.position}</p>
                )}
                {m.phone && (
                  <p className="text-[11px] text-white/40">{m.phone}</p>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => openEditMember(m)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:text-white transition-colors"
                >
                  <Icon name="PencilSquareIcon" size={12} />
                </button>
                <button
                  onClick={() => handleDeleteMember(m.id)}
                  disabled={deletingMemberId === m.id}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Icon name="TrashIcon" size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyForm = { sport: '', description: '', sport_pic: null as string | null };

export default function SportManagementSection() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [picFile, setPicFile] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setSports(await fetchSports());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (s: Sport) => {
    setEditingId(s.id);
    setForm({ sport: s.sport ?? '', description: (s.description ?? []).join('\n'), sport_pic: s.sport_pic ?? null });
    setPicFile(null);
    setPicPreview(s.sport_pic ?? null);
    setError('');
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPicFile(file);
    if (file) {
      setPicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const descriptionArr = form.description.split('\n').map((l) => l.trim()).filter(Boolean);
      let sport_pic = form.sport_pic;

      if (picFile) {
        // If replacing an existing pic, delete the old one first
        if (sport_pic) await deleteSportPic(sport_pic);
        // Need an id for the path — use editingId or a temp timestamp for new
        const tempId = editingId ?? Date.now();
        sport_pic = await uploadSportPic(picFile, tempId);
      }

      const payload = { sport: form.sport.trim(), description: descriptionArr, sport_pic };

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

  const handleDelete = async (s: Sport) => {
    setDeletingId(s.id);
    try {
      if (s.sport_pic) await deleteSportPic(s.sport_pic);
      await deleteSport(s.id);
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
              onChange={editingId === null ? (e) => setForm((p) => ({ ...p, sport: e.target.value })) : undefined}
              readOnly={editingId !== null}
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors ${editingId !== null ? 'cursor-default' : 'focus:border-primary'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">
              Description (one bullet per line)
            </label>
            <textarea
              rows={6}
              value={form.description}
              onChange={editingId === null ? (e) => setForm((p) => ({ ...p, description: e.target.value })) : undefined}
              readOnly={editingId !== null}
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors resize-none ${editingId !== null ? 'cursor-default' : 'focus:border-primary'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Sport Picture</label>
            {picPreview && (
              <div className="mb-3 relative w-32 h-20 rounded-xl overflow-hidden border border-white/10">
                <img src={picPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPicFile(null); setPicPreview(null); setForm((p) => ({ ...p, sport_pic: null })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white text-[10px] hover:bg-black transition-all"
                >✕</button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:uppercase file:tracking-widest file:bg-primary file:text-white hover:file:bg-red-700 file:cursor-pointer"
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
              {s.sport_pic ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src={s.sport_pic} alt={s.sport} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                  <Icon name="TrophyIcon" size={20} className="text-white/30" />
                </div>
              )}
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
                <TeamSection sport={s} />
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-white transition-colors"
                >
                  <Icon name="PencilSquareIcon" size={14} />
                </button>
                <button
                  onClick={() => handleDelete(s)}
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
