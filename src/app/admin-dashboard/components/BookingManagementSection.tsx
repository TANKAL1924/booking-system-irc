import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type PaymentType = '50% Deposit' | 'Full Payment';
type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  arena: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  paymentType: PaymentType;
  amount: string;
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  { id: 'BK-001', customerName: 'Mohd Faizal bin Ismail', phone: '+60 12-345 6789', arena: 'Upper Field', date: '24 Apr 2026', timeStart: '8:00 AM', timeEnd: '10:00 AM', paymentType: 'Full Payment', amount: 'RM 300', status: 'Confirmed' },
  { id: 'BK-002', customerName: 'Siti Nurhaliza bte Rashid', phone: '+60 11-234 5678', arena: 'Banquet Hall', date: '25 Apr 2026', timeStart: '10:00 AM', timeEnd: '6:00 PM', paymentType: '50% Deposit', amount: 'RM 1,500', status: 'Pending' },
  { id: 'BK-003', customerName: 'Rajesh Kumar Pillai', phone: '+60 16-789 0123', arena: 'Hockey Turf', date: '25 Apr 2026', timeStart: '3:00 PM', timeEnd: '5:00 PM', paymentType: 'Full Payment', amount: 'RM 360', status: 'Confirmed' },
  { id: 'BK-004', customerName: 'Lim Wei Xian', phone: '+60 17-456 7890', arena: '100m Track', date: '26 Apr 2026', timeStart: '7:00 AM', timeEnd: '9:00 AM', paymentType: '50% Deposit', amount: 'RM 80', status: 'Pending' },
  { id: 'BK-005', customerName: 'Azlan bin Hamzah', phone: '+60 13-678 9012', arena: 'Lower Field', date: '26 Apr 2026', timeStart: '4:00 PM', timeEnd: '6:00 PM', paymentType: 'Full Payment', amount: 'RM 240', status: 'Confirmed' },
  { id: 'BK-006', customerName: 'Priya Devi Subramaniam', phone: '+60 19-012 3456', arena: 'Glasshouse Hall', date: '27 Apr 2026', timeStart: '2:00 PM', timeEnd: '8:00 PM', paymentType: '50% Deposit', amount: 'RM 900', status: 'Pending' },
  { id: 'BK-007', customerName: 'Hafiz bin Othman', phone: '+60 12-901 2345', arena: 'Upper Field', date: '22 Apr 2026', timeStart: '9:00 AM', timeEnd: '11:00 AM', paymentType: 'Full Payment', amount: 'RM 300', status: 'Completed' },
  { id: 'BK-008', customerName: 'Tan Mei Ling', phone: '+60 14-567 8901', arena: 'Hockey Turf', date: '21 Apr 2026', timeStart: '5:00 PM', timeEnd: '7:00 PM', paymentType: '50% Deposit', amount: 'RM 180', status: 'Cancelled' },
  { id: 'BK-009', customerName: 'Ahmad Zulkifli bin Nordin', phone: '+60 18-234 5678', arena: 'Garden Hall', date: '28 Apr 2026', timeStart: '11:00 AM', timeEnd: '5:00 PM', paymentType: '50% Deposit', amount: 'RM 750', status: 'Pending' },
  { id: 'BK-010', customerName: 'Kavitha Krishnan', phone: '+60 11-890 1234', arena: 'Lower Field', date: '29 Apr 2026', timeStart: '6:00 AM', timeEnd: '8:00 AM', paymentType: 'Full Payment', amount: 'RM 240', status: 'Confirmed' },
];

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: 'bg-[#25D366]/10 text-[#25D366]',
  Pending: 'bg-orange-400/10 text-orange-400',
  Cancelled: 'bg-primary/10 text-primary',
  Completed: 'bg-white/10 text-white/50',
};

const paymentBadge: Record<PaymentType, string> = {
  'Full Payment': 'bg-accent/10 text-accent',
  '50% Deposit': 'bg-blue-400/10 text-blue-400',
};

const filterOptions: Array<BookingStatus | 'All'> = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

export default function BookingManagementSection() {
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === 'All' || b.status === filter;
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.arena.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Booking Management</h2>
          <p className="text-white/40 text-sm mt-1">View and manage all customer bookings with payment status</p>
        </div>
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: bookings.length, color: 'text-white' },
          { label: 'Confirmed', value: bookings.filter((b) => b.status === 'Confirmed').length, color: 'text-[#25D366]' },
          { label: 'Pending', value: bookings.filter((b) => b.status === 'Pending').length, color: 'text-orange-400' },
          { label: 'Cancelled', value: bookings.filter((b) => b.status === 'Cancelled').length, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              filter === f ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Booking Management Section — mobile-friendly card layout */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">ID</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Customer</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden md:table-cell">Arena</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden lg:table-cell">Date & Time</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Payment</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-accent font-bold text-xs">{b.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{b.customerName}</p>
                    <p className="text-white/30 text-xs">{b.phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-white/70 text-sm">{b.arena}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-white/70 text-xs">{b.date}</p>
                    <p className="text-white/30 text-xs">{b.timeStart} – {b.timeEnd}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${paymentBadge[b.paymentType]}`}>
                        {b.paymentType}
                      </span>
                      <p className="font-black text-white text-sm mt-1">{b.amount}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {b.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(b.id, 'Confirmed')}
                          className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                          aria-label="Confirm booking"
                          title="Confirm"
                        >
                          <Icon name="CheckIcon" size={13} />
                        </button>
                      )}
                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button
                          onClick={() => updateStatus(b.id, 'Cancelled')}
                          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                          aria-label="Cancel booking"
                          title="Cancel"
                        >
                          <Icon name="XMarkIcon" size={13} />
                        </button>
                      )}
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => updateStatus(b.id, 'Completed')}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          aria-label="Mark completed"
                          title="Complete"
                        >
                          <Icon name="CheckCircleIcon" size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden divide-y divide-white/5">
          {filtered.map((b) => (
            <div key={b.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-accent font-bold text-xs block mb-0.5">{b.id}</span>
                  <p className="font-bold text-white text-sm leading-tight">{b.customerName}</p>
                  <p className="text-white/30 text-xs">{b.phone}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 ${statusStyles[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-white/30 font-bold uppercase tracking-widest text-[9px] mb-0.5">Arena</p>
                  <p className="text-white/70">{b.arena}</p>
                </div>
                <div>
                  <p className="text-white/30 font-bold uppercase tracking-widest text-[9px] mb-0.5">Date</p>
                  <p className="text-white/70">{b.date}</p>
                </div>
                <div>
                  <p className="text-white/30 font-bold uppercase tracking-widest text-[9px] mb-0.5">Time</p>
                  <p className="text-white/70">{b.timeStart} – {b.timeEnd}</p>
                </div>
                <div>
                  <p className="text-white/30 font-bold uppercase tracking-widest text-[9px] mb-0.5">Amount</p>
                  <p className="text-white font-black">{b.amount}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${paymentBadge[b.paymentType]}`}>
                  {b.paymentType}
                </span>
                <div className="flex gap-1.5">
                  {b.status === 'Pending' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Confirmed')}
                      className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                      aria-label="Confirm booking"
                    >
                      <Icon name="CheckIcon" size={13} />
                    </button>
                  )}
                  {(b.status === 'Pending' || b.status === 'Confirmed') && (
                    <button
                      onClick={() => updateStatus(b.id, 'Cancelled')}
                      className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                      aria-label="Cancel booking"
                    >
                      <Icon name="XMarkIcon" size={13} />
                    </button>
                  )}
                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Completed')}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="Mark completed"
                    >
                      <Icon name="CheckCircleIcon" size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-white/30 text-sm">No bookings found.</div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">Showing {filtered.length} of {bookings.length} bookings</p>
        </div>
      </div>
    </div>
  );
}
