import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import { createAdminBooking } from '../service/BookingAdmin';
import type { Facility, FacilitySlot } from '@/app/admin/facilities/service/FacilitiesAdmin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CartItem {
  facilityId: number;
  facilityName: string;
  date: string;
  slot: FacilitySlot;
  item_amount: number;
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors';

const selectCls =
  'w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors [&>option]:bg-[#1a1a2e] [&>option]:text-white';

function itemTotal(slot: FacilitySlot) {
  return slot.price;
}

const toHHMM = (t: string) => t.slice(0, 5);

export default function AdminCreateBookingModal({ isOpen, onClose, onCreated }: Props) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [conflictError, setConflictError] = useState('');

  // Item form state
  const [selFacilityId, setSelFacilityId] = useState('');
  const [selDate, setSelDate] = useState('');
  const [selSlotIdx, setSelSlotIdx] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    supabase
      .from('facilities')
      .select('id, name, status, type, slots, add_on, pic_contact, off_day, pic_link, purpose, description, morning_fee, night_fee')
      .eq('status', true)
      .order('id')
      .then(({ data }) => { if (data) setFacilities(data as Facility[]); });
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const selectedFacility = facilities.find((f) => f.id === Number(selFacilityId));
  const slots: FacilitySlot[] = selectedFacility?.slots ?? [];

  const cartTotal = cart.reduce((sum, i) => sum + i.item_amount, 0);
  const payAmount = paymentType === 'deposit' ? Math.ceil(cartTotal * 0.5) : cartTotal;

  const addItem = async () => {
    if (!selFacilityId || !selDate || selSlotIdx === '') return;
    const slot = slots[Number(selSlotIdx)];
    if (!slot) return;
    setConflictError('');
    setCheckingConflict(true);

    // Check against existing DB bookings
    const { data: conflicts } = await supabase
      .from('booking_item')
      .select('id')
      .eq('facility_id', Number(selFacilityId))
      .eq('date', selDate)
      .lt('time_start', slot.end)
      .gt('time_end', slot.start)
      .limit(1);

    // Also check against items already in cart
    const cartConflict = cart.some(
      (c) =>
        c.facilityId === Number(selFacilityId) &&
        c.date === selDate &&
        toHHMM(c.slot.start) < slot.end &&
        toHHMM(c.slot.end) > slot.start
    );

    setCheckingConflict(false);

    if ((conflicts && conflicts.length > 0) || cartConflict) {
      setConflictError(
        `This slot (${slot.start}–${slot.end}) on ${selDate} is already booked. Please choose a different slot.`
      );
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        facilityId: Number(selFacilityId),
        facilityName: selectedFacility?.name ?? '',
        date: selDate,
        slot,
        item_amount: itemTotal(slot),
      },
    ]);
    setSelSlotIdx('');
    setConflictError('');
  };

  const removeItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setError('');
    if (!contact.name || !contact.phone) { setError('Name and phone are required.'); return; }
    if (cart.length === 0) { setError('Add at least one booking item.'); return; }

    setSubmitting(true);
    try {
      await createAdminBooking({
        customer_name: contact.name,
        phone: contact.phone,
        email: contact.email,
        payment_type: paymentType === 'full',
        total_amount: payAmount,
        items: cart.map((i) => ({
          facility_id: i.facilityId,
          facility_name: i.facilityName,
          date: i.date,
          time_start: i.slot.start,
          time_end: i.slot.end,
          slot_price: i.slot.price,
          add_ons: [],
          item_amount: i.item_amount,
        })),
      });
      // reset
      setContact({ name: '', phone: '', email: '' });
      setCart([]);
      setSelFacilityId('');
      setSelDate('');
      setSelSlotIdx('');
      setPaymentType('full');
      onCreated();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card rounded-3xl border border-white/10 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Icon name="PlusCircleIcon" size={20} className="text-primary" />
            Create Booking (Admin)
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Customer Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full name *"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                className={inputCls}
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                className={inputCls}
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Add Item */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Add Booking Item</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={selFacilityId}
                onChange={(e) => { setSelFacilityId(e.target.value); setSelSlotIdx(''); setConflictError(''); }}
                className={selectCls}
              >
                <option value="">Select facility</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={selDate}
                onChange={(e) => { setSelDate(e.target.value); setConflictError(''); }}
                className={inputCls}
              />
              <select
                value={selSlotIdx}
                onChange={(e) => { setSelSlotIdx(e.target.value); setConflictError(''); }}
                disabled={slots.length === 0}
                className={selectCls}
              >
                <option value="">Select slot</option>
                {slots.map((s, i) => (
                  <option key={i} value={i}>{s.start} – {s.end} (RM {s.price})</option>
                ))}
              </select>
            </div>
            {conflictError && (
              <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <Icon name="ExclamationCircleIcon" size={13} className="shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}
            <button
              type="button"
              onClick={addItem}
              disabled={!selFacilityId || !selDate || selSlotIdx === '' || checkingConflict}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {checkingConflict
                ? <><Icon name="ArrowPathIcon" size={13} className="animate-spin" />Checking…</>
                : <><Icon name="PlusIcon" size={13} />Add to Booking</>}
            </button>
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Items</p>
              <div className="space-y-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-bold">{item.facilityName}</p>
                      <p className="text-white/60 text-xs">{item.date} · {item.slot.start}–{item.slot.end}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-accent font-black text-sm">RM {item.item_amount}</span>
                      <button onClick={() => removeItem(i)} className="text-white/40 hover:text-red-400 transition-colors">
                        <Icon name="XMarkIcon" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Payment Type</p>
            <div className="flex gap-3">
              {(['full', 'deposit'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPaymentType(opt)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    paymentType === opt
                      ? opt === 'deposit' ? 'bg-orange-400/20 border border-orange-400/40 text-orange-400' : 'bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]'
                      : 'bg-white/5 border border-white/10 text-white/50'
                  }`}
                >
                  {opt === 'full' ? 'Full Payment' : '50% Deposit'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-white/60 text-sm">{paymentType === 'deposit' ? '50% Deposit' : 'Total'}</span>
              <span className="text-accent font-black text-lg">RM {payAmount}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <Icon name="ExclamationCircleIcon" size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Notice */}
          <p className="text-white/40 text-xs flex items-center gap-1.5">
            <Icon name="InformationCircleIcon" size={13} />
            This booking will be saved as <span className="text-[#25D366] font-bold">Paid</span> directly — no payment gateway involved.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0 || !contact.name || !contact.phone}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
              {submitting ? 'Saving…' : 'Create Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
