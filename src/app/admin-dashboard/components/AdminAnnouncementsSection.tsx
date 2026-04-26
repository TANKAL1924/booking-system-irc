import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Announcement {
  id: number;
  title: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
}

const initialAnnouncements: Announcement[] = [
  { id: 1, title: 'NS State Hockey Championship 2026', category: 'Tournament', date: '24 Apr 2026', status: 'Published' },
  { id: 2, title: 'Ramadan Special Booking Rates', category: 'Promotion', date: '20 Apr 2026', status: 'Published' },
  { id: 3, title: 'Graduation Package 2026 Now Open', category: 'Events', date: '18 Apr 2026', status: 'Published' },
  { id: 4, title: 'New Hockey Turf Resurfacing Complete', category: 'Facility Update', date: '15 Apr 2026', status: 'Published' },
  { id: 5, title: 'Soccer Veteran League Season 5 — Draft', category: 'Sports', date: '24 Apr 2026', status: 'Draft' },
];

const facilityAvailability = [
  { name: 'Upper Field', available: true },
  { name: 'Lower Field', available: true },
  { name: 'Hockey Turf', available: false },
  { name: '100m Track', available: true },
  { name: 'Glasshouse Hall', available: true },
  { name: 'Banquet Hall', available: false },
];

export default function AdminAnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [availability, setAvailability] = useState(facilityAvailability);
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', category: '', status: 'Draft\' as \'Draft\' | \'Published' });

  const toggleAvailability = (idx: number) => {
    setAvailability((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, available: !f.available } : f))
    );
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.category) return;
    setAnnouncements((prev) => [
      {
        id: prev.length + 1,
        title: newAnnouncement.title,
        category: newAnnouncement.category,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: newAnnouncement.status,
      },
      ...prev,
    ]);
    setNewAnnouncement({ title: '', category: '', status: 'Draft' });
    setShowForm(false);
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
      {/* Announcements Panel */}
      <div className="xl:col-span-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white">Announcements & Events</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all"
          >
            <Icon name="PlusIcon" size={14} />
            New Post
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddAnnouncement} className="glass-card rounded-2xl p-6 mb-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Add New Announcement</h3>
            <input
              type="text"
              placeholder="Announcement title..."
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category (e.g. Tournament)"
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement((p) => ({ ...p, category: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              />
              <select
                value={newAnnouncement.status}
                onChange={(e) => setNewAnnouncement((p) => ({ ...p, status: e.target.value as 'Draft' | 'Published' }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Draft" className="bg-[#1A1A1A]">Draft</option>
                <option value="Published" className="bg-[#1A1A1A]">Published</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
                Save Post
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="glass-card rounded-2xl overflow-hidden">
          {announcements.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-center justify-between px-5 py-4 ${i !== announcements.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors group`}
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{a.category}</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      a.status === 'Published' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-orange-400/10 text-orange-400'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="text-white text-sm font-bold truncate">{a.title}</p>
                <p className="text-white/30 text-xs">{a.date}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100" aria-label="Edit announcement">
                  <Icon name="PencilSquareIcon" size={13} />
                </button>
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Delete announcement"
                >
                  <Icon name="TrashIcon" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Availability Panel */}
      <div>
        <h2 className="text-xl font-black text-white mb-5">Facility Availability</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          {availability.map((f, i) => (
            <div
              key={f.name}
              className={`flex items-center justify-between px-5 py-4 ${i !== availability.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div>
                <p className="text-white text-sm font-bold">{f.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${f.available ? 'text-[#25D366]' : 'text-primary'}`}>
                  {f.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <button
                onClick={() => toggleAvailability(i)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${f.available ? 'bg-[#25D366]' : 'bg-white/10'}`}
                aria-label={`Toggle ${f.name} availability`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${f.available ? 'left-7' : 'left-1'}`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Revenue Card */}
        <div className="glass-card rounded-2xl p-6 mt-4">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Icon name="ChartBarIcon" size={16} className="text-accent" />
            Revenue Overview
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Today', value: 'RM 1,020', bar: 40 },
              { label: 'This Week', value: 'RM 5,340', bar: 65 },
              { label: 'This Month', value: 'RM 12,450', bar: 85 },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40 font-medium">{r.label}</span>
                  <span className="font-bold text-white">{r.value}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${r.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}