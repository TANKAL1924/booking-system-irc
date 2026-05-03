import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Event {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  pic_link: string | null;
}

const emptyForm = { name: '', start_date: '', end_date: '', imageFile: null as File | null, imagePreview: '' };

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
    const { data } = await supabase.from('events').select('*').order('start_date', { ascending: true });
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
    if (!form.name || !form.start_date) return;
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

    await supabase.from('events').insert({
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date || null,
      pic_link,
    });
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

  const formatDateRange = (start: string, end: string | null) => {
    if (!end || end === start) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Event Management</h2>
          <p className="text-white text-sm mt-1">Add or delete events and upload event posters</p>
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
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Event Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder=""
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">End Date <span className="normal-case font-medium text-white/60">(optional)</span></label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white mb-2">Event Poster / Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
              >
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon name="PhotoIcon" size={22} className="text-white" />
                    </div>
                    <p className="text-white text-sm">Click to upload event poster</p>
                    <p className="text-white text-xs">PNG, JPG, WEBP up to 5MB</p>
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
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {events.length === 0 && (
          <div className="px-5 py-12 text-center text-white text-sm">No events yet. Add your first event.</div>
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
                <Icon name="CalendarDaysIcon" size={22} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{ev.name}</p>
              <span className="text-white text-xs flex items-center gap-1 mt-1">
                <Icon name="CalendarIcon" size={11} />
                {formatDateRange(ev.start_date, ev.end_date ?? null)}
              </span>
            </div>
            <button
              onClick={() => handleDelete(ev.id)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-primary hover:bg-primary/10 transition-all sm:opacity-0 sm:group-hover:opacity-100"
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


