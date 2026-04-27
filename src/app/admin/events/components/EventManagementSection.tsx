import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Event {
  id: number;
  name: string;
  date: string;
  pic_link: string | null;
}

const emptyForm = { name: '', date: '', imageFile: null as File | null, imagePreview: '' };

export default function EventManagementSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showSaved = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (data) setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((p) => ({ ...p, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    setSubmitting(true);

    let pic_link: string | null = null;

    if (form.imageFile) {
      const ext = form.imageFile.name.split('.').pop();
      const path = `event-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(path, form.imageFile, { upsert: false });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('events').getPublicUrl(path);
        pic_link = urlData.publicUrl;
      }
    }

    await supabase.from('events').insert({ name: form.name, date: form.date, pic_link });
    await fetchEvents();
    setForm(emptyForm);
    setShowForm(false);
    setSubmitting(false);
    showSaved('Event added!');
  };

  const handleDelete = async (id: number) => {
    await supabase.from('events').delete().eq('id', id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showSaved('Event deleted.');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Event Management</h2>
          <p className="text-white/40 text-sm mt-1">Add or delete events and upload event posters</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shrink-0"
        >
          <Icon name="PlusIcon" size={14} />
          Add Event
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
          <h3 className="font-bold text-white text-sm border-b border-white/5 pb-4">Add New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Event Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. NS State Hockey Championship 2026"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Event Poster / Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
              >
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon name="PhotoIcon" size={22} className="text-white/30" />
                    </div>
                    <p className="text-white/30 text-sm">Click to upload event poster</p>
                    <p className="text-white/20 text-xs">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {form.imagePreview && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, imageFile: null, imagePreview: '' }))}
                  className="mt-2 text-xs text-primary hover:text-red-400 transition-colors"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Add Event'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {events.length === 0 && (
          <div className="px-5 py-12 text-center text-white/30 text-sm">No events yet. Add your first event.</div>
        )}
        {events.map((ev, i) => (
          <div
            key={ev.id}
            className={`flex items-center gap-4 px-4 sm:px-5 py-4 ${i !== events.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors group`}
          >
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {ev.pic_link ? (
                <img src={ev.pic_link} alt={ev.name} className="w-full h-full object-cover" />
              ) : (
                <Icon name="CalendarDaysIcon" size={22} className="text-white/20" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{ev.name}</p>
              <span className="text-white/30 text-xs flex items-center gap-1 mt-1">
                <Icon name="CalendarIcon" size={11} />
                {formatDate(ev.date)}
              </span>
            </div>
            <button
              onClick={() => handleDelete(ev.id)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Delete event"
            >
              <Icon name="TrashIcon" size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


const emptyEvent: Omit<Event, 'id'> = {
  title: '', category: '', date: '', time: '', venue: '', description: '', image: '', status: 'Draft',
};

export default function EventManagementSection() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Event, 'id'>>(emptyEvent);
  const [savedMsg, setSavedMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showSaved = (msg = 'Saved successfully!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const openAdd = () => {
    setForm(emptyEvent);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ev: Event) => {
    const { id, ...rest } = ev;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showSaved('Event deleted.');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingId ? { ...form, id: editingId } : ev)));
      showSaved('Event updated!');
    } else {
      setEvents((prev) => [{ ...form, id: Date.now() }, ...prev]);
      showSaved('Event added!');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyEvent);
  };

  const statusStyle = (s: string) =>
    s === 'Published' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-orange-400/10 text-orange-400';

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Event Management</h2>
          <p className="text-white/40 text-sm mt-1">Add, edit or delete events and upload event posters</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shrink-0"
        >
          <Icon name="PlusIcon" size={14} />
          Add Event
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
            {editingId !== null ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Event Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                placeholder="e.g. NS State Hockey Championship 2026"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
                placeholder="e.g. Tournament, Sports, Events"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Venue</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
                required
                placeholder="e.g. Hockey Turf"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Time</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                placeholder="e.g. 8:00 AM"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'Draft' | 'Published' }))}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Event description..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">Event Poster / Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
              >
                {form.image ? (
                  <img src={form.image} alt="Event poster preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon name="PhotoIcon" size={22} className="text-white/30" />
                    </div>
                    <p className="text-white/30 text-sm">Click to upload event poster</p>
                    <p className="text-white/20 text-xs">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, image: '' }))}
                  className="mt-2 text-xs text-primary hover:text-red-400 transition-colors"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">
              {editingId !== null ? 'Update Event' : 'Add Event'}
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

      {/* Events List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {events.length === 0 && (
          <div className="px-5 py-12 text-center text-white/30 text-sm">No events found. Add your first event.</div>
        )}
        {events.map((ev, i) => (
          <div
            key={ev.id}
            className={`flex flex-col sm:flex-row items-start gap-4 px-4 sm:px-5 py-4 sm:py-5 ${i !== events.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors group`}
          >
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {ev.image ? (
                <img src={ev.image} alt={`${ev.title} poster`} className="w-full h-full object-cover" />
              ) : (
                <Icon name="CalendarDaysIcon" size={22} className="text-white/20" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{ev.category}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${statusStyle(ev.status)}`}>
                  {ev.status}
                </span>
              </div>
              <p className="text-white font-bold text-sm truncate">{ev.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Icon name="CalendarIcon" size={11} />
                  {ev.date}
                </span>
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Icon name="ClockIcon" size={11} />
                  {ev.time}
                </span>
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Icon name="MapPinIcon" size={11} />
                  {ev.venue}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(ev)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Edit event"
              >
                <Icon name="PencilSquareIcon" size={13} />
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                aria-label="Delete event"
              >
                <Icon name="TrashIcon" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
