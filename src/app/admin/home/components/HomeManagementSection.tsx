import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface AboutForm {
  description: string;
  vision: string;
  mission: string;
  sport_description: string;
}

interface CompanyForm {
  address: string;
  whatsapp: string;
  email: string;
  lat: string;
  long: string;
}

interface SocialForm {
  facebook: string;
  insta: string;
  tiktok: string;
}

export default function HomeManagementSection() {
  const [activeTab, setActiveTab] = useState<'about' | 'social' | 'tnc' | 'layout' | 'org'>('about');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const [about, setAbout] = useState<AboutForm>({ description: '', vision: '', mission: '', sport_description: '' });
  const [company, setCompany] = useState<CompanyForm>({ address: '', whatsapp: '', email: '', lat: '', long: '' });
  const [social, setSocial] = useState<SocialForm>({ facebook: '', insta: '', tiktok: '' });
  const [tnc, setTnc] = useState<string[]>([]);
  const [newTnc, setNewTnc] = useState('');
  const [editingTnc, setEditingTnc] = useState<number | null>(null);
  const [layoutUrl, setLayoutUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  interface OrgMember { id: number; name: string | null; phone: string | null; section: string | null; parent_id: number | null; }
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [orgShowForm, setOrgShowForm] = useState(false);
  const [orgEditingId, setOrgEditingId] = useState<number | null>(null);
  const [orgForm, setOrgForm] = useState({ name: '', phone: '', section: '', parent_id: '' });
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [orgDeletingId, setOrgDeletingId] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('organization').select('*').order('id').then(({ data }) => {
      if (data) setOrgMembers(data as OrgMember[]);
    });

    supabase
      .from('base')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setAbout({ description: data.about_us ?? '', vision: data.vision ?? '', mission: data.mission ?? '', sport_description: data.sport_description ?? '' });
          setCompany({ address: data.address ?? '', whatsapp: data.whatsapp ?? '', email: data.email ?? '', lat: data.lat != null ? String(data.lat) : '', long: data.long != null ? String(data.long) : '' });
          setSocial({ facebook: data.facebook ?? '', insta: data.insta ?? '', tiktok: data.tiktok ?? '' });
          setTnc(Array.isArray(data.tnc) ? data.tnc : []);
          setLayoutUrl(data.layout ?? null);
          setVideoUrl(data.main_vid ?? null);
        }
        setLoading(false);
      });
  }, []);

  const showSaved = () => {
    setSavedMsg('Changes saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const upsert = async (fields: Record<string, unknown>) => {
    setSaving(true);
    await supabase.from('base').upsert({ id: 1, ...fields });
    setSaving(false);
    showSaved();
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsert({
      about_us: about.description,
      vision: about.vision,
      mission: about.mission,
      sport_description: about.sport_description,
      address: company.address,
      whatsapp: company.whatsapp,
      email: company.email,
      lat: company.lat !== '' ? parseFloat(company.lat) : null,
      long: company.long !== '' ? parseFloat(company.long) : null,
    });
  };

  const deleteStorageFile = async (bucket: string, url: string) => {
    try {
      const parts = new URL(url).pathname.split(`/${bucket}/`);
      if (parts.length > 1) await supabase.storage.from(bucket).remove([parts[1]]);
    } catch { /* ignore */ }
  };

  const handleLayoutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Delete old file first (handles extension changes)
    if (layoutUrl) await deleteStorageFile('layout', layoutUrl);
    const ext = file.name.split('.').pop();
    const path = `layout-main.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('layout')
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('layout').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;
    await upsert({ layout: publicUrl });
    setLayoutUrl(publicUrl);
    setUploading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    // Delete old file first (handles extension changes)
    if (videoUrl) await deleteStorageFile('layout', videoUrl);
    const ext = file.name.split('.').pop();
    const path = `layout-video.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('layout')
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setUploadingVideo(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('layout').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;
    await upsert({ main_vid: publicUrl });
    setVideoUrl(publicUrl);
    setUploadingVideo(false);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsert({ facebook: social.facebook, insta: social.insta, tiktok: social.tiktok });
  };

  const handleSaveTnc = async () => {
    await upsert({ tnc });
  };

  const handleAddTnc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTnc.trim()) return;
    setTnc((prev) => [...prev, newTnc.trim()]);
    setNewTnc('');
  };

  const handleDeleteTnc = (idx: number) => {
    setTnc((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditTnc = (idx: number, value: string) => {
    setTnc((prev) => prev.map((item, i) => (i === idx ? value : item)));
  };

  const loadOrg = async () => {
    const { data } = await supabase.from('organization').select('*').order('id');
    if (data) setOrgMembers(data as OrgMember[]);
  };

  const handleOrgSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgError('');
    setOrgSaving(true);
    const payload = {
      name: orgForm.name.trim() || null,
      phone: orgForm.phone.trim() || null,
      section: orgForm.section.trim() || null,
      parent_id: orgForm.parent_id !== '' ? Number(orgForm.parent_id) : null,
    };
    try {
      if (orgEditingId !== null) {
        const { error } = await supabase.from('organization').update(payload).eq('id', orgEditingId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('organization').insert(payload);
        if (error) throw new Error(error.message);
      }
      setOrgShowForm(false);
      await loadOrg();
    } catch (err) {
      setOrgError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setOrgSaving(false);
    }
  };

  const handleOrgDelete = async (id: number) => {
    setOrgDeletingId(id);
    await supabase.from('organization').delete().eq('id', id);
    await loadOrg();
    setOrgDeletingId(null);
  };

  const openOrgAdd = () => {
    setOrgEditingId(null);
    setOrgForm({ name: '', phone: '', section: '', parent_id: '' });
    setOrgError('');
    setOrgShowForm(true);
  };

  const openOrgEdit = (m: OrgMember) => {
    setOrgEditingId(m.id);
    setOrgForm({ name: m.name ?? '', phone: m.phone ?? '', section: m.section ?? '', parent_id: m.parent_id != null ? String(m.parent_id) : '' });
    setOrgError('');
    setOrgShowForm(true);
  };

  const tabs = [
    { key: 'about', label: 'About Us', icon: 'InformationCircleIcon' },
    { key: 'social', label: 'Social Media', icon: 'ShareIcon' },
    { key: 'tnc', label: 'Terms & Conditions', icon: 'DocumentTextIcon' },
    { key: 'layout', label: 'Layout', icon: 'PhotoIcon' },
    { key: 'org', label: 'Organization', icon: 'UsersIcon' },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-white">Home Management</h2>
        <p className="text-white text-sm mt-1">Edit homepage content, company information and social media links</p>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 mb-5">
          <Icon name="CheckCircleIcon" size={16} className="text-[#25D366]" />
          <p className="text-[#25D366] text-sm font-bold">{savedMsg}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white hover:text-white'
            }`}
          >
            <Icon name={t.icon as 'InformationCircleIcon'} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* About Us Tab */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">About Us</label>
            <textarea
              value={about.description}
              onChange={(e) => setAbout((p) => ({ ...p, description: e.target.value }))}
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Sport Section Description</label>
            <textarea
              value={about.sport_description}
              onChange={(e) => setAbout((p) => ({ ...p, sport_description: e.target.value }))}
              rows={4}
              placeholder=""
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Vision</label>
              <textarea
                value={about.vision}
                onChange={(e) => setAbout((p) => ({ ...p, vision: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Mission</label>
              <textarea
                value={about.mission}
                onChange={(e) => setAbout((p) => ({ ...p, mission: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
          <div className="border-t border-white/5 pt-5 space-y-4">
            <h3 className="font-bold text-white text-[11px] uppercase tracking-widest">Company Information</h3>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Address</label>
              <textarea
                value={company.address}
                onChange={(e) => setCompany((p) => ({ ...p, address: e.target.value }))}
                rows={3}
                placeholder=""
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">WhatsApp</label>
              <input
                type="text"
                value={company.whatsapp}
                onChange={(e) => setCompany((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder=""
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany((p) => ({ ...p, email: e.target.value }))}
                placeholder=""
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Latitude (Waze)</label>
                <input
                  type="number"
                  step="any"
                  value={company.lat}
                  onChange={(e) => setCompany((p) => ({ ...p, lat: e.target.value }))}
                  placeholder=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Longitude (Waze)</label>
                <input
                  type="number"
                  step="any"
                  value={company.long}
                  onChange={(e) => setCompany((p) => ({ ...p, long: e.target.value }))}
                  placeholder=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">Social Media Links</h3>
          <div className="space-y-4">
            {(
              [
                { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/arenairc' },
                { key: 'insta', label: 'Instagram', placeholder: 'https://instagram.com/arenairc' },
                { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@arenairc' },
              ] as const
            ).map((s) => (
              <div key={s.key}>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">{s.label}</label>
                <input
                  type="url"
                  value={social[s.key]}
                  onChange={(e) => setSocial((p) => ({ ...p, [s.key]: e.target.value }))}
                  placeholder=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* T&C Tab */}
      {activeTab === 'tnc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Terms & Conditions</h3>
            <button
              onClick={handleSaveTnc}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
            >
              <Icon name="CheckIcon" size={13} />
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>

          <form onSubmit={handleAddTnc} className="glass-card rounded-2xl p-5 flex gap-3">
            <input
              type="text"
              value={newTnc}
              onChange={(e) => setNewTnc(e.target.value)}
              placeholder=""
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/15 transition-all"
            >
              <Icon name="PlusIcon" size={13} />
              Add
            </button>
          </form>

          <div className="glass-card rounded-2xl overflow-hidden">
            {tnc.length === 0 ? (
              <p className="px-5 py-8 text-center text-white text-sm">No T&C items yet. Add one above.</p>
            ) : (
              tnc.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 px-5 py-4 ${i !== tnc.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <span className="text-primary font-black text-sm shrink-0 mt-2">{i + 1}.</span>
                  {editingTnc === i ? (
                    <input
                      type="text"
                      defaultValue={item}
                      onBlur={(e) => { handleEditTnc(i, e.target.value); setEditingTnc(null); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { handleEditTnc(i, (e.target as HTMLInputElement).value); setEditingTnc(null); }
                        if (e.key === 'Escape') setEditingTnc(null);
                      }}
                      autoFocus
                      className="flex-1 bg-white/5 border border-primary/40 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                    />
                  ) : (
                    <p className="flex-1 text-white text-sm leading-relaxed pt-1">{item}</p>
                  )}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingTnc(editingTnc === i ? null : i)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Edit"
                    >
                      <Icon name="PencilSquareIcon" size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteTnc(i)}
                      className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                      aria-label="Delete"
                    >
                      <Icon name="TrashIcon" size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === 'org' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Organization Members</h3>
            <button
              onClick={openOrgAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              <Icon name="PlusIcon" size={13} />
              Add Member
            </button>
          </div>

          {orgShowForm && (
            <form onSubmit={handleOrgSave} className="glass-card rounded-2xl p-6 mb-4 space-y-4 border border-white/10">
              <h4 className="font-bold text-white text-sm">{orgEditingId !== null ? 'Edit Member' : 'New Member'}</h4>
              {orgError && <p className="text-red-400 text-xs font-bold">{orgError}</p>}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Name / Position</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Phone</label>
                <input
                  type="text"
                  value={orgForm.phone}
                  onChange={(e) => setOrgForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Section</label>
                <input
                  type="text"
                  value={orgForm.section}
                  onChange={(e) => setOrgForm((p) => ({ ...p, section: e.target.value }))}
                  placeholder="e.g. Management, Technical"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">
                  Parent (leave empty for root)
                </label>
                <select
                  value={orgForm.parent_id}
                  onChange={(e) => setOrgForm((p) => ({ ...p, parent_id: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" className="bg-[#1a1a1a]">— No parent (root) —</option>
                  {orgMembers
                    .filter((m) => m.id !== orgEditingId)
                    .map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#1a1a1a]">{m.name ?? `#${m.id}`}</option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={orgSaving}
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {orgSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setOrgShowForm(false)}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {orgMembers.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Icon name="UsersIcon" size={32} className="text-white mx-auto mb-3" />
              <p className="text-white text-sm font-bold">No members yet. Add one above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orgMembers.map((m) => {
                const parent = orgMembers.find((p) => p.id === m.parent_id);
                return (
                  <div key={m.id} className="glass-card rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{m.name ?? '—'}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {m.section && <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{m.section}</span>}
                        {m.phone && <span className="text-white/40 text-xs">{m.phone}</span>}
                        {parent && (
                          <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                            ↳ {parent.name ?? `#${parent.id}`}
                          </span>
                        )}
                        <span className="text-white/20 text-[10px]">ID: {m.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => openOrgEdit(m)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-white transition-colors"
                      >
                        <Icon name="PencilSquareIcon" size={14} />
                      </button>
                      <button
                        onClick={() => handleOrgDelete(m.id)}
                        disabled={orgDeletingId === m.id}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Icon name="TrashIcon" size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">Place Layout Image</h3>

          {layoutUrl && (
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img src={layoutUrl} alt="Layout" className="w-full object-contain max-h-72" />
            </div>
          )}

          <label className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-white/10 rounded-xl py-10 cursor-pointer hover:border-primary/50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Icon name="PhotoIcon" size={28} className="text-white" />
            <span className="text-white text-sm font-medium">
              {uploading ? 'Uploading...' : layoutUrl ? 'Click to replace image' : 'Click to upload layout image'}
            </span>
            <span className="text-white text-xs">PNG, JPG, WEBP supported</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLayoutUpload}
              disabled={uploading}
            />
          </label>

          <div className="border-t border-white/5 pt-5 space-y-4">
            <h3 className="font-bold text-white text-[11px] uppercase tracking-widest">Facility Tour Video</h3>

            {videoUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <video src={videoUrl} controls className="w-full max-h-64" />
              </div>
            )}

            <label className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-white/10 rounded-xl py-10 cursor-pointer hover:border-primary/50 transition-colors ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
              <Icon name="FilmIcon" size={28} className="text-white" />
              <span className="text-white text-sm font-medium">
                {uploadingVideo ? 'Uploading...' : videoUrl ? 'Click to replace video' : 'Click to upload facility tour video'}
              </span>
              <span className="text-white text-xs">MP4, MOV, WEBM supported</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
