import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  mapUrl: string;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

interface AboutContent {
  title: string;
  description: string;
  vision: string;
  mission: string;
}

const initialAbout: AboutContent = {
  title: 'Arena IRC & IRC Negeri Sembilan Club',
  description: 'Arena IRC is a premier multipurpose sports facility in Negeri Sembilan, offering world-class venues for sports events, graduations, weddings, and corporate functions. With state-of-the-art facilities and professional management, we provide an unmatched experience for all our guests.',
  vision: 'To be the leading sports and events facility in Negeri Sembilan, fostering community growth through sports excellence.',
  mission: 'To provide world-class facilities and services that inspire athletes, unite communities, and create memorable events for all.',
};

const initialCompany: CompanyInfo = {
  name: 'Arena IRC & IRC Negeri Sembilan Club',
  tagline: 'Premier Sports & Events Facility',
  address: 'Jalan Stadium, Seremban, 70200 Negeri Sembilan, Malaysia',
  phone: '+60 6-123 4567',
  email: 'info@arenairc.com',
  operatingHours: 'Mon–Sat, 8:00 AM – 5:30 PM',
  mapUrl: 'https://maps.google.com',
};

const initialSocials: SocialMedia[] = [
  { platform: 'Instagram', url: 'https://instagram.com/arenairc', icon: 'PhotoIcon' },
  { platform: 'Facebook', url: 'https://facebook.com/arenairc', icon: 'GlobeAltIcon' },
  { platform: 'TikTok', url: 'https://tiktok.com/@arenairc', icon: 'VideoCameraIcon' },
  { platform: 'WhatsApp', url: 'https://wa.me/601234567', icon: 'ChatBubbleLeftRightIcon' },
];

export default function HomeManagementSection() {
  const [activeTab, setActiveTab] = useState<'about' | 'company' | 'social'>('about');
  const [about, setAbout] = useState<AboutContent>(initialAbout);
  const [company, setCompany] = useState<CompanyInfo>(initialCompany);
  const [socials, setSocials] = useState<SocialMedia[]>(initialSocials);
  const [savedMsg, setSavedMsg] = useState('');
  const [editingSocial, setEditingSocial] = useState<number | null>(null);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', icon: 'GlobeAltIcon' });
  const [showAddSocial, setShowAddSocial] = useState(false);

  const showSaved = () => {
    setSavedMsg('Changes saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    showSaved();
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    showSaved();
  };

  const handleSaveSocial = (idx: number, url: string) => {
    setSocials((prev) => prev.map((s, i) => (i === idx ? { ...s, url } : s)));
    setEditingSocial(null);
    showSaved();
  };

  const handleDeleteSocial = (idx: number) => {
    setSocials((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.platform || !newSocial.url) return;
    setSocials((prev) => [...prev, { ...newSocial }]);
    setNewSocial({ platform: '', url: '', icon: 'GlobeAltIcon' });
    setShowAddSocial(false);
    showSaved();
  };

  const tabs = [
    { key: 'about', label: 'About Us', icon: 'InformationCircleIcon' },
    { key: 'company', label: 'Company Info', icon: 'BuildingOfficeIcon' },
    { key: 'social', label: 'Social Media', icon: 'ShareIcon' },
  ] as const;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-white">Home Management</h2>
        <p className="text-white/40 text-sm mt-1">Edit homepage content, company information and social media links</p>
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
                ? 'bg-primary text-white' :'bg-white/5 border border-white/10 text-white/40 hover:text-white'
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
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">About Us</label>
            <textarea
              value={about.description}
              onChange={(e) => setAbout((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Vision</label>
              <textarea
                value={about.vision}
                onChange={(e) => setAbout((p) => ({ ...p, vision: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Mission</label>
              <textarea
                value={about.mission}
                onChange={(e) => setAbout((p) => ({ ...p, mission: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
            Save Changes
          </button>
        </form>
      )}

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">Edit Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(Object.keys(company) as Array<keyof CompanyInfo>).map((key) => (
              <div key={key} className={key === 'address' || key === 'mapUrl' ? 'md:col-span-2' : ''}>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={company[key]}
                  onChange={(e) => setCompany((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
            Save Changes
          </button>
        </form>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Social Media Links</h3>
            <button
              onClick={() => setShowAddSocial(!showAddSocial)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              <Icon name="PlusIcon" size={13} />
              Add Link
            </button>
          </div>

          {showAddSocial && (
            <form onSubmit={handleAddSocial} className="glass-card rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Platform</label>
                  <input
                    type="text"
                    placeholder="e.g. Instagram"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial((p) => ({ ...p, platform: e.target.value }))}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">URL</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial((p) => ({ ...p, url: e.target.value }))}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">Add</button>
                <button type="button" onClick={() => setShowAddSocial(false)} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all">Cancel</button>
              </div>
            </form>
          )}

          <div className="glass-card rounded-2xl overflow-hidden">
            {socials.map((s, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i !== socials.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={s.icon as 'PhotoIcon'} size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{s.platform}</p>
                  {editingSocial === i ? (
                    <input
                      type="url"
                      defaultValue={s.url}
                      onBlur={(e) => handleSaveSocial(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveSocial(i, (e.target as HTMLInputElement).value); }}
                      autoFocus
                      className="w-full bg-white/5 border border-primary/40 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none mt-1"
                    />
                  ) : (
                    <p className="text-white/30 text-xs truncate">{s.url}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditingSocial(editingSocial === i ? null : i)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Edit"
                  >
                    <Icon name="PencilSquareIcon" size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteSocial(i)}
                    className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                    aria-label="Delete"
                  >
                    <Icon name="TrashIcon" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
