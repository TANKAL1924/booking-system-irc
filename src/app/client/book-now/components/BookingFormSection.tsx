import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useBase } from '@/lib/useBase';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

/* ── Types ── */
interface FacilitySlot {
  start: string;
  end: string;
  hour: number;
  price: number;
}

interface FacilityAddOn {
  name: string;
  price: number;
  hour_add_on: number;
  pic_add_on: string;
}

interface Facility {
  id: number;
  name: string | null;
  status: boolean | null;
  type: boolean | null;
  slots: FacilitySlot[] | null;
  add_on: FacilityAddOn[] | null;
}

interface SelectedAddOn {
  addOn: FacilityAddOn;
  hours: number;
}

interface CartItem {
  facilityId: number;
  facilityName: string;
  slot: FacilitySlot;
  date: string;
  addOns: SelectedAddOn[];
}

/* booking_item row shape (only fields we need for conflict check) */
interface BookedItem {
  facility_id: number;
  date: string;
  time_start: string; // "HH:MM:SS" from postgres time type
  time_end: string;
}

const emptyItemForm = {
  facilityId: '',
  date: '',
  selectedSlotIndices: [] as number[],
  slotAddOns: {} as Record<number, SelectedAddOn[]>,
};

/* ── Helpers ── */
/* normalise "HH:MM" or "HH:MM:SS" to comparable "HH:MM" */
const toHHMM = (t: string) => t.slice(0, 5);

/* true if slot [sStart,sEnd) overlaps any booked item on given facility+date */
function hasConflict(
  bookedItems: BookedItem[],
  facilityId: number,
  date: string,
  slotStart: string,
  slotEnd: string,
): boolean {
  return bookedItems.some(
    (b) =>
      b.facility_id === facilityId &&
      b.date === date &&
      toHHMM(b.time_start) < slotEnd &&
      toHHMM(b.time_end) > slotStart,
  );
}

/* ── Input style ── */
const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white focus:outline-none focus:border-primary transition-colors';

export default function BookingFormSection() {
  const { base } = useBase();

  /* facilities from supabase */
  const [facilities, setFacilities] = useState<Facility[]>([]);
  useEffect(() => {
    supabase
      .from('facilities')
      .select('id, name, status, type, slots, add_on')
      .eq('status', true)
      .order('id')
      .then(({ data }) => setFacilities((data as Facility[]) ?? []));
  }, []);

  /* contact */
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });

  /* cart */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  /* booked items for selected facility (conflict check) */
  const [bookedItems, setBookedItems] = useState<BookedItem[]>([]);
  const [loadingBooked, setLoadingBooked] = useState(false);

  /* ui */
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [tncAccepted, setTncAccepted] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* derived */
  const selectedFacility = facilities.find((f) => f.id === Number(itemForm.facilityId));
  const slots = selectedFacility?.slots ?? [];
  const addOns = selectedFacility?.add_on ?? [];

  /* fetch booked items whenever facility changes */
  useEffect(() => {
    if (!itemForm.facilityId) { setBookedItems([]); return; }
    setLoadingBooked(true);
    supabase
      .from('booking_item')
      .select('facility_id, date, time_start, time_end')
      .eq('facility_id', Number(itemForm.facilityId))
      .gte('date', new Date().toISOString().split('T')[0])
      .then(({ data }) => {
        setBookedItems((data as BookedItem[]) ?? []);
        setLoadingBooked(false);
      });
  }, [itemForm.facilityId]);

  /* check if a slot is booked on the currently selected date */
  const isSlotBooked = (slotIdx: number) => {
    const slot = slots[slotIdx];
    if (!slot || !itemForm.facilityId || !itemForm.date) return false;
    return hasConflict(bookedItems, Number(itemForm.facilityId), itemForm.date, slot.start, slot.end);
  };

  /* multi-select toggle — initialise empty add-ons entry when slot is added */
  const toggleSlot = (idx: number) => {
    if (isSlotBooked(idx)) return;
    setItemForm((p) => {
      const already = p.selectedSlotIndices.includes(idx);
      const newIndices = already
        ? p.selectedSlotIndices.filter((i) => i !== idx)
        : [...p.selectedSlotIndices, idx];
      const newSlotAddOns = { ...p.slotAddOns };
      if (already) delete newSlotAddOns[idx];
      else newSlotAddOns[idx] = [];
      return { ...p, selectedSlotIndices: newIndices, slotAddOns: newSlotAddOns };
    });
  };

  const toggleAddOn = (slotIdx: number, addOn: FacilityAddOn) => {
    setItemForm((p) => {
      const current = p.slotAddOns[slotIdx] ?? [];
      const exists = current.some((a) => a.addOn.name === addOn.name);
      return {
        ...p,
        slotAddOns: {
          ...p.slotAddOns,
          [slotIdx]: exists
            ? current.filter((a) => a.addOn.name !== addOn.name)
            : [...current, { addOn, hours: 1 }],
        },
      };
    });
  };

  const setAddOnHours = (slotIdx: number, name: string, hours: number) =>
    setItemForm((p) => ({
      ...p,
      slotAddOns: {
        ...p.slotAddOns,
        [slotIdx]: (p.slotAddOns[slotIdx] ?? []).map((a) =>
          a.addOn.name === name ? { ...a, hours } : a
        ),
      },
    }));

  const itemTotal = (slot: FacilitySlot, selectedAddOns: SelectedAddOn[]) =>
    slot.price + selectedAddOns.reduce((sum, a) => sum + a.addOn.price * a.hours, 0);

  const cartTotal = cart.reduce((sum, i) => sum + itemTotal(i.slot, i.addOns), 0);
  const payAmount = paymentOption === 'deposit' ? Math.ceil(cartTotal * 0.5) : cartTotal;

  const canAddItem =
    itemForm.facilityId !== '' &&
    itemForm.date !== '' &&
    itemForm.selectedSlotIndices.length > 0;

  const addToCart = () => {
    if (!canAddItem || !selectedFacility) return;
    const newItems: CartItem[] = itemForm.selectedSlotIndices
      .map((idx) => ({ slot: slots[idx], addOns: itemForm.slotAddOns[idx] ?? [] }))
      .filter((x) => Boolean(x.slot))
      .map(({ slot, addOns }) => ({
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name ?? '',
        slot,
        date: itemForm.date,
        addOns,
      }));
    setCart((prev) => [...prev, ...newItems]);
    /* keep facility + date — clear slots and per-slot add-ons */
    setItemForm((p) => ({ ...emptyItemForm, facilityId: p.facilityId, date: p.date }));
  };

  const removeFromCart = (idx: number) =>
    setCart((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tncAccepted || cart.length === 0) return;
    setSubmitError('');
    setSubmitting(true);

    /* final conflict safety check across all cart items */
    for (const item of cart) {
      const { data: conflicts } = await supabase
        .from('booking_item')
        .select('id')
        .eq('facility_id', item.facilityId)
        .eq('date', item.date)
        .lt('time_start', item.slot.end)
        .gt('time_end', item.slot.start)
        .limit(1);
      if (conflicts && conflicts.length > 0) {
        setSubmitError(
          `"${item.facilityName}" on ${item.date} at ${item.slot.start}–${item.slot.end} was just booked by someone else. Please remove it from your cart.`
        );
        setSubmitting(false);
        return;
      }
    }

    /* insert booking header */
    const { data: bookingRow, error: bookingErr } = await supabase
      .from('booking')
      .insert({
        customer_name: contact.name,
        phone: contact.phone,
        email: contact.email,
        payment_type: paymentOption === 'full',
        total_amount: payAmount,
      })
      .select('id')
      .single();

    if (bookingErr || !bookingRow) {
      setSubmitError('Failed to create booking. Please try again.');
      setSubmitting(false);
      return;
    }

    /* insert booking items */
    const items = cart.map((item) => ({
      booking_id: bookingRow.id,
      facility_id: item.facilityId,
      facility_name: item.facilityName,
      date: item.date,
      time_start: item.slot.start,
      time_end: item.slot.end,
      slot_price: item.slot.price,
      add_ons: item.addOns.map((a) => ({
        name: a.addOn.name,
        price_per_hour: a.addOn.price,
        hours: a.hours,
        subtotal: a.addOn.price * a.hours,
      })),
      item_amount: itemTotal(item.slot, item.addOns),
    }));

    const { error: itemsErr } = await supabase.from('booking_item').insert(items);
    if (itemsErr) {
      setSubmitError('Booking created but items failed to save. Please contact us.');
      setSubmitting(false);
      return;
    }

    /* call Edge Function to create Toyyib bill */
    const facilitySummary = cart.map((i) => `${i.facilityName} ${i.date}`).join(', ');
    const billDescription = `Arena IRC Booking #${bookingRow.id} - ${facilitySummary}`.slice(0, 100).replace(/[^a-zA-Z0-9 _]/g, '_');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_FUNCTIONS_URL}/create-toyyib-bill`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: bookingRow.id,
            customerName: contact.name,
            customerEmail: contact.email,
            customerPhone: contact.phone,
            amountCents: payAmount * 100,
            description: billDescription,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.paymentUrl) {
        setSubmitError('Booking saved but payment link failed. Please contact us with booking #' + bookingRow.id);
        setSubmitting(false);
        return;
      }
      /* redirect to Toyyib payment page */
      window.location.href = data.paymentUrl;
    } catch {
      setSubmitError('Booking saved but payment redirect failed. Please contact us with booking #' + bookingRow.id);
      setSubmitting(false);
    }
  };

  const reset = () => {
    setContact({ name: '', phone: '', email: '' });
    setCart([]);
    setItemForm(emptyItemForm);
    setPaymentOption('deposit');
    setTncAccepted(false);
    setSubmitted(false);
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="glass-card rounded-3xl p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircleIcon" size={32} className="text-[#25D366]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Booking Request Sent!</h2>
            <p className="text-white text-sm leading-relaxed mb-2">
              Thank you, <strong className="text-white">{contact.name}</strong>. Your{' '}
              <strong className="text-accent">{cart.length} booking{cart.length > 1 ? 's' : ''}</strong> ha{cart.length > 1 ? 've' : 's'} been received.
            </p>
            <p className="text-white text-xs mb-8">Our team will confirm within 24 hours.</p>

            <div className="text-left space-y-2 mb-8">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-white font-bold text-sm">{item.facilityName}</p>
                    <p className="text-white text-xs">{item.date} · {item.slot.start} – {item.slot.end}</p>
                    {item.addOns.length > 0 && (
                      <p className="text-white text-xs mt-0.5">+{item.addOns.map((a) => `${a.addOn.name} ${a.hours}hr`).join(', ')}</p>
                    )}
                  </div>
                  <span className="text-accent font-black text-sm">RM {itemTotal(item.slot, item.addOns)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="px-10 py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              Make Another Booking
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ── Main form ── */
  return (
    <section id="booking-form" className="pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10"
        >
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Reserve</span>
          <h2 className="font-black text-3xl md:text-5xl tracking-tighter text-white">
            BOOKING <span className="gradient-text-brand">FORM</span>
          </h2>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* ── Left: steps ── */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">

              {/* T&C */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTncOpen(!tncOpen)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Icon name="DocumentTextIcon" size={20} className="text-accent shrink-0" />
                    <span className="font-bold text-white text-sm">Terms & Conditions</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Must Read
                    </span>
                  </div>
                  <Icon name={tncOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={18} className="text-white shrink-0" />
                </button>
                {tncOpen && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-white/5">
                    <ol className="space-y-3 mt-4">
                      {(base?.tnc ?? []).map((item, i) => (
                        <li key={i} className="flex gap-3 text-white text-xs leading-relaxed">
                          <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="tnc"
                    checked={tncAccepted}
                    onChange={(e) => setTncAccepted(e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer shrink-0"
                  />
                  <label htmlFor="tnc" className="text-sm text-white cursor-pointer">
                    I have read and agree to the Terms & Conditions
                  </label>
                </div>
              </div>

              {/* Step 1 – Contact */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">1</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="Ahmad bin Abdullah"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                      required
                      placeholder="+60 12-345 6789"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                      required
                      placeholder="ahmad@email.com"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 – Add booking items */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">2</span>
                  Add Booking
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Facility select */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Select Facility</label>
                    <select
                      value={itemForm.facilityId}
                      onChange={(e) => setItemForm({ facilityId: e.target.value, date: '', selectedSlotIndices: [], slotAddOns: {} })}
                      className={inputCls}
                    >
                      <option value="" className="bg-[#1A1A1A]">Choose a facility...</option>
                      {facilities.map((f) => (
                        <option key={f.id} value={f.id} className="bg-[#1A1A1A]">
                          {f.name} {f.type ? '(Facility)' : '(Hall)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Date</label>
                    <input
                      type="date"
                      value={itemForm.date}
                      onChange={(e) => setItemForm((p) => ({ ...p, date: e.target.value, selectedSlotIndices: [] }))}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={!itemForm.facilityId}
                      className={`${inputCls} disabled:opacity-30 disabled:cursor-not-allowed`}
                    />
                  </div>

                  {/* Slot toggles */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Time Slot</label>
                    {slots.length === 0 ? (
                      <p className="text-white text-xs px-4 py-3 rounded-xl bg-white/5 border border-white/5">Select a facility first...</p>
                    ) : !itemForm.date ? (
                      <p className="text-white text-xs px-4 py-3 rounded-xl bg-white/5 border border-white/5">Pick a date to see availability...</p>
                    ) : loadingBooked ? (
                      <p className="text-white text-xs px-4 py-3 rounded-xl bg-white/5 border border-white/5">Checking availability...</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {slots.map((s, i) => {
                          const active = itemForm.selectedSlotIndices.includes(i);
                          const booked = isSlotBooked(i);
                          if (active) return null;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleSlot(i)}
                              disabled={booked}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                                booked
                                  ? 'border-white/5 bg-white/5 text-white cursor-not-allowed line-through'
                                  : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <Icon name="ClockIcon" size={12} />
                              {s.start} – {s.end} · {s.hour}hr
                              {booked
                                ? <span className="text-red-400/60 font-black">Booked</span>
                                : <span className="text-white">RM {s.price}</span>
                              }
                            </button>
                          );
                        })}
                        {slots.every((_, i) => itemForm.selectedSlotIndices.includes(i) || isSlotBooked(i)) && (
                          <p className="text-white text-xs px-4 py-3 rounded-xl bg-white/5 border border-white/5">All available slots selected.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Per-slot Add-ons */}
                {addOns.length > 0 && itemForm.selectedSlotIndices.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Add-ons per Slot (optional)</p>
                    {itemForm.selectedSlotIndices.map((slotIdx) => {
                      const slot = slots[slotIdx];
                      if (!slot) return null;
                      const slotAddOns = itemForm.slotAddOns[slotIdx] ?? [];
                      const slotAddOnTotal = slotAddOns.reduce((sum, a) => sum + a.addOn.price * a.hours, 0);
                      return (
                        <div key={slotIdx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                          {/* Slot header */}
                          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <Icon name="ClockIcon" size={13} className="text-primary" />
                              <span className="text-white font-bold text-sm">{slot.start} – {slot.end}</span>
                              <span className="text-white text-xs">· {slot.hour}hr</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {slotAddOnTotal > 0 && (
                                <span className="text-accent font-black text-xs">+RM {slotAddOnTotal}</span>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleSlot(slotIdx)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white hover:text-red-400 hover:bg-red-400/10 transition-all"
                                title="Remove this slot"
                              >
                                <Icon name="XMarkIcon" size={13} />
                              </button>
                            </div>
                          </div>
                          {/* Add-on rows */}
                          <div className="p-2 space-y-1">
                            {addOns.map((addOn, i) => {
                              const selected = slotAddOns.find((a) => a.addOn.name === addOn.name);
                              const checked = !!selected;
                              return (
                                <div
                                  key={i}
                                  className={`rounded-lg border transition-all ${
                                    checked ? 'border-primary/40 bg-primary/10' : 'border-white/5 bg-white/5'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleAddOn(slotIdx, addOn)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                                  >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                      checked ? 'border-primary bg-primary' : 'border-white/30'
                                    }`}>
                                      {checked && <Icon name="CheckIcon" size={10} className="text-white" />}
                                    </div>
                                    <span className="text-white text-sm flex-1">{addOn.name}</span>
                                    <span className="text-white text-xs shrink-0">RM {addOn.price}/hr</span>
                                  </button>
                                  {checked && selected && (
                                    <div className="flex items-center gap-3 px-3 pb-2.5">
                                      <span className="text-white text-xs">Hours:</span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setAddOnHours(slotIdx, addOn.name, Math.max(1, selected.hours - 1))}
                                          className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                        >
                                          <Icon name="MinusIcon" size={12} />
                                        </button>
                                        <span className="text-white font-black text-sm w-5 text-center">{selected.hours}</span>
                                        <button
                                          type="button"
                                          onClick={() => setAddOnHours(slotIdx, addOn.name, selected.hours + 1)}
                                          className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                        >
                                          <Icon name="PlusIcon" size={12} />
                                        </button>
                                      </div>
                                      <span className="text-accent font-black text-sm ml-auto">+RM {addOn.price * selected.hours}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!canAddItem}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest border transition-all ${
                    canAddItem
                      ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
                      : 'border-white/5 bg-white/5 text-white cursor-not-allowed'
                  }`}
                >
                  <Icon name="PlusIcon" size={16} />
                  {canAddItem
                    ? `Add ${itemForm.selectedSlotIndices.length} Item${itemForm.selectedSlotIndices.length > 1 ? 's' : ''} to Cart`
                    : 'Add to Cart'}
                </button>
              </div>

              {/* Cart items */}
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.div
                    className="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">3</span>
                      Your Bookings
                      <span className="text-white font-normal text-sm ml-1">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
                    </h3>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {cart.map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 12 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-sm truncate">{item.facilityName}</p>
                              <p className="text-white text-xs">{item.date} · {item.slot.start} – {item.slot.end} · {item.slot.hour}hr</p>
                              {item.addOns.length > 0 && (
                                <p className="text-white text-xs mt-0.5">
                                  +{item.addOns.map((a) => `${a.addOn.name} ${a.hours}hr`).join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="text-accent font-black text-sm shrink-0">RM {itemTotal(item.slot, item.addOns)}</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(i)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                            >
                              <Icon name="XMarkIcon" size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4 – Payment */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">
                    {cart.length > 0 ? '4' : '3'}
                  </span>
                  Payment Option
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['deposit', 'full'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPaymentOption(opt)}
                      className={`p-4 sm:p-5 rounded-xl border text-left transition-all ${
                        paymentOption === opt ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === opt ? 'border-primary' : 'border-white/30'}`}>
                          {paymentOption === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="font-bold text-white text-sm">{opt === 'deposit' ? '50% Deposit' : 'Full Payment'}</span>
                      </div>
                      <p className="text-white text-xs">
                        {opt === 'deposit' ? 'Pay half now, balance before event day.' : 'Pay in full and get priority confirmation.'}
                      </p>
                      {cart.length > 0 && (
                        <p className="text-accent font-black text-lg mt-2">
                          RM {opt === 'deposit' ? Math.ceil(cartTotal * 0.5) : cartTotal}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-white text-xs">Payment via FPX, credit/debit card, or bank transfer.</p>
              </div>

              {/* Submit */}
              {submitError && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <Icon name="ExclamationCircleIcon" size={14} className="shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={!tncAccepted || cart.length === 0 || submitting}
                className={`w-full py-4 sm:py-5 rounded-full font-black text-sm sm:text-base uppercase tracking-widest transition-all ${
                  tncAccepted && cart.length > 0 && !submitting
                    ? 'bg-primary text-white hover:bg-red-700 pulse-glow-anim'
                    : 'bg-white/10 text-white cursor-not-allowed'
                }`}
              >
                {submitting
                  ? 'Submitting…'
                  : !tncAccepted
                  ? 'Accept T&C to Continue'
                  : cart.length === 0
                  ? 'Add at Least One Booking'
                  : `Submit ${cart.length} Booking${cart.length > 1 ? 's' : ''}`}
              </button>
            </div>

            {/* ── Right: summary ── */}
            <div className="space-y-4 lg:sticky lg:top-28 h-fit">
              <div className="glass-card rounded-2xl p-5 sm:p-6">
                <h3 className="font-bold text-white text-base mb-5 flex items-center gap-2">
                  <Icon name="ClipboardDocumentListIcon" size={18} className="text-accent" />
                  Booking Summary
                </h3>

                {cart.length === 0 ? (
                  <p className="text-white text-xs text-center py-6">No bookings added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, i) => (
                      <div key={i} className="space-y-0.5 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex justify-between text-sm">
                          <span className="text-white font-bold truncate flex-1 pr-2">{item.facilityName}</span>
                          <span className="text-accent font-black shrink-0">RM {itemTotal(item.slot, item.addOns)}</span>
                        </div>
                        <p className="text-white text-xs">{item.date} · {item.slot.start} – {item.slot.end}</p>
                        {item.addOns.length > 0 && (
                          <p className="text-white text-xs">
                            +{item.addOns.map((a) => `${a.addOn.name} ${a.hours}hr (RM ${a.addOn.price * a.hours})`).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Subtotal</span>
                        <span className="text-white font-bold">RM {cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{paymentOption === 'deposit' ? '50% Deposit' : 'Full Payment'}</span>
                        <span className="text-accent font-black text-lg">RM {payAmount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact preview */}
              {(contact.name || contact.phone || contact.email) && (
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Contact</p>
                  <div className="space-y-1">
                    {contact.name && <p className="text-white text-sm font-bold">{contact.name}</p>}
                    {contact.phone && <p className="text-white text-xs">{contact.phone}</p>}
                    {contact.email && <p className="text-white text-xs">{contact.email}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
