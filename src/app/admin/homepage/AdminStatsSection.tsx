import Icon from '@/components/ui/AppIcon';

const stats = [
  {
    label: "Today\'s Bookings",
    value: '8',
    change: '+3 from yesterday',
    positive: true,
    icon: 'CalendarDaysIcon',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    label: 'Revenue This Month',
    value: 'RM 12,450',
    change: '+18% from last month',
    positive: true,
    icon: 'CurrencyDangSignIcon',
    color: 'text-[#25D366]',
    bg: 'bg-[#25D366]/10',
  },
  {
    label: 'Active Members',
    value: '247',
    change: '+12 new this month',
    positive: true,
    icon: 'UsersIcon',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Pending Confirmations',
    value: '5',
    change: 'Requires action',
    positive: false,
    icon: 'ClockIcon',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
];

export default function AdminStatsSection() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
        <p className="text-white/40 text-sm mt-1">Arena IRC Admin · April 2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon name={s.icon as 'CalendarDaysIcon'} size={18} className={s.color} />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  s.positive ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-orange-400/10 text-orange-400'
                }`}
              >
                {s.positive ? '↑' : '!'} {s.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}