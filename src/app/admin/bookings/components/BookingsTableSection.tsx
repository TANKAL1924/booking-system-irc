import { useState, useEffect, Fragment } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  fetchBookings,
  deleteBooking,
} from '../service/BookingAdmin';
import type { Booking } from '../service/BookingAdmin';

function fmtAmount(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BookingsTableSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState<'all' | 'full' | 'deposit'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setFetchError('');
    try {
      setBookings(await fetchBookings());
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setUpdating(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (expanded === id) setExpanded(null);
    } catch { /* silent */ }
    setUpdating(null);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.customer_name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      String(b.id).includes(q) ||
      b.booking_item.some((i) => i.facility_name.toLowerCase().includes(q));
    const matchPay =
      payFilter === 'all' ||
      (payFilter === 'full' && b.payment_type) ||
      (payFilter === 'deposit' && !b.payment_type);
    return matchSearch && matchPay;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/30 gap-3">
        <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
        <span className="text-sm">Loading bookings…</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-white/30 text-sm">{fetchError}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-black text-white">Bookings Management</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Refresh"
          >
            <Icon name="ArrowPathIcon" size={15} />
          </button>
          <div className="relative w-full sm:w-64">
            <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Payment Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {([['all', 'All'], ['full', 'Full Payment'], ['deposit', '50% Deposit']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setPayFilter(val)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              payFilter === val
                ? 'bg-primary text-white'
                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">ID</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Client</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden sm:table-cell">Payment</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden sm:table-cell">Amount</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const isExpanded = expanded === b.id;
                return (
                  <Fragment key={b.id}>
                    <tr
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : ''}`}
                      onClick={() => setExpanded(isExpanded ? null : b.id)}
                    >
                      <td className="px-5 py-4">
                        <span className="text-accent font-bold text-xs">#{b.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white text-sm">{b.customer_name}</p>
                        <p className="text-white/30 text-xs">{b.phone}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {b.booking_item.length === 0 ? (
                          <span className="text-white/20 text-xs">—</span>
                        ) : (
                          <div className="space-y-1.5">
                            {b.booking_item.map((item) => (
                              <div key={item.id}>
                                <p className="text-white/70 text-sm">{item.facility_name}</p>
                                <p className="text-white/30 text-xs">{fmtDate(item.date)} · {item.time_start}–{item.time_end}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={`text-xs font-bold ${b.payment_type ? 'text-[#25D366]' : 'text-orange-400'}`}>
                          {b.payment_type ? 'Full' : '50% Deposit'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="font-black text-white text-sm">{fmtAmount(b.total_amount)}</span>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setExpanded(isExpanded ? null : b.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                            aria-label="View booking"
                          >
                            <Icon name="EyeIcon" size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            disabled={updating === b.id}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                            aria-label="Delete booking"
                          >
                            <Icon name="TrashIcon" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-6 text-xs text-white/40 mb-1">
                              <span>
                                <span className="text-white/20 uppercase tracking-widest text-[10px] mr-1">Email:</span>
                                {b.email}
                              </span>
                              <span>
                                <span className="text-white/20 uppercase tracking-widest text-[10px] mr-1">Booked:</span>
                                {new Date(b.created_at).toLocaleString('en-MY')}
                              </span>
                            </div>
                            <div className="grid gap-2">
                              {b.booking_item.map((item) => (
                                <div key={item.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-start justify-between flex-wrap gap-2">
                                  <div>
                                    <p className="text-white font-bold text-sm">{item.facility_name}</p>
                                    <p className="text-white/40 text-xs mt-0.5">
                                      {fmtDate(item.date)} · {item.time_start}–{item.time_end}
                                    </p>
                                    {item.add_ons.length > 0 && (
                                      <div className="mt-1.5 space-y-0.5">
                                        {item.add_ons.map((a, j) => (
                                          <p key={j} className="text-white/30 text-xs">
                                            + {a.name} × {a.hours}h = RM {a.subtotal.toFixed(2)}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-white font-black text-sm">{fmtAmount(item.item_amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/30 text-sm">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-xs text-white/30">Showing {filtered.length} of {bookings.length} bookings</p>
        </div>
      </div>
    </div>
  );
}





