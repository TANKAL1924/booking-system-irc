import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

interface Booking {
  id: string;
  name: string;
  facility: string;
  date: string;
  time: string;
  payment: string;
  amount: string;
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  { id: 'BK-001', name: 'Mohd Faizal bin Ismail', facility: 'Upper Field', date: '24 Apr 2026', time: '8:00 AM – 10:00 AM', payment: 'Full', amount: 'RM 300', status: 'Confirmed' },
  { id: 'BK-002', name: 'Siti Nurhaliza bte Rashid', facility: 'Banquet Hall', date: '25 Apr 2026', time: '10:00 AM – 6:00 PM', payment: '50% Deposit', amount: 'RM 1,500', status: 'Pending' },
  { id: 'BK-003', name: 'Rajesh Kumar Pillai', facility: 'Hockey Turf', date: '25 Apr 2026', time: '3:00 PM – 5:00 PM', payment: 'Full', amount: 'RM 360', status: 'Confirmed' },
  { id: 'BK-004', name: 'Lim Wei Xian', facility: '100m Track', date: '26 Apr 2026', time: '7:00 AM – 9:00 AM', payment: '50% Deposit', amount: 'RM 80', status: 'Pending' },
  { id: 'BK-005', name: 'Azlan bin Hamzah', facility: 'Lower Field', date: '26 Apr 2026', time: '4:00 PM – 6:00 PM', payment: 'Full', amount: 'RM 240', status: 'Confirmed' },
  { id: 'BK-006', name: 'Priya Devi Subramaniam', facility: 'Glasshouse Hall', date: '27 Apr 2026', time: '2:00 PM – 8:00 PM', payment: '50% Deposit', amount: 'RM 900', status: 'Pending' },
  { id: 'BK-007', name: 'Hafiz bin Othman', facility: 'Upper Field', date: '22 Apr 2026', time: '9:00 AM – 11:00 AM', payment: 'Full', amount: 'RM 300', status: 'Completed' },
  { id: 'BK-008', name: 'Tan Mei Ling', facility: 'Hockey Turf', date: '21 Apr 2026', time: '5:00 PM – 7:00 PM', payment: '50% Deposit', amount: 'RM 180', status: 'Cancelled' },
];

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: 'bg-[#25D366]/10 text-[#25D366]',
  Pending: 'bg-orange-400/10 text-orange-400',
  Cancelled: 'bg-primary/10 text-primary',
  Completed: 'bg-white/10 text-white/50',
};

const filters: Array<BookingStatus | 'All'> = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

export default function BookingsTableSection() {
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = mockBookings.filter((b) => {
    const matchStatus = filter === 'All' || b.status === filter;
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.facility.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-black text-white">Bookings Management</h2>
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

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              filter === f
                ? 'bg-primary text-white' :'bg-white/5 border border-white/10 text-white/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Booking ID</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Client</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden md:table-cell">Facility</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden lg:table-cell">Date & Time</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden sm:table-cell">Amount</th>
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
                    <p className="font-bold text-white text-sm">{b.name}</p>
                    <p className="text-white/30 text-xs">{b.payment}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-white/70 text-sm">{b.facility}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-white/70 text-xs">{b.date}</p>
                    <p className="text-white/30 text-xs">{b.time}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="font-black text-white text-sm">{b.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="View booking">
                        <Icon name="EyeIcon" size={14} />
                      </button>
                      {b.status === 'Pending' && (
                        <button className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all" aria-label="Confirm booking">
                          <Icon name="CheckIcon" size={14} />
                        </button>
                      )}
                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all" aria-label="Cancel booking">
                          <Icon name="XMarkIcon" size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">Showing {filtered.length} of {mockBookings.length} bookings</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all" aria-label="Previous page">
              <Icon name="ChevronLeftIcon" size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all" aria-label="Next page">
              <Icon name="ChevronRightIcon" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}