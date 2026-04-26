import React from 'react';
import Icon from '@/components/ui/AppIcon';

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'RM 50',
    period: '/month',
    badge: null,
    color: 'border-white/10',
    headerBg: 'bg-white/5',
    benefits: [
      'Access to all public facilities',
      '10% discount on hourly bookings',
      'Priority booking (3 days advance)',
      'Member newsletter & announcements',
      'Free parking (2 hours)',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'RM 120',
    period: '/month',
    badge: 'Most Popular',
    color: 'border-primary/40',
    headerBg: 'bg-primary/10',
    benefits: [
      'All Basic benefits',
      '20% discount on all bookings',
      'Priority booking (7 days advance)',
      'Free locker & changing room',
      'Access to academy training sessions',
      'Monthly coaching consultation (1hr)',
      'Free parking (unlimited)',
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 'RM 250',
    period: '/month',
    badge: 'Best Value',
    color: 'border-accent/30',
    headerBg: 'bg-accent/10',
    benefits: [
      'All Pro benefits',
      '30% discount on all bookings',
      'VIP priority booking (14 days)',
      'Dedicated account manager',
      'Unlimited academy sessions',
      'VIP event access & seating',
      'Annual sports kit (jersey + bag)',
      'Family member add-on (RM 80/pax)',
    ]
  },
];

export default function MembershipTiersSection() {
  return (
    <section className="pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            Membership Plans
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            CHOOSE YOUR <span className="gradient-text-brand">TIER</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers?.map((tier) => (
            <div
              key={tier?.id}
              className={`glass-card rounded-2xl overflow-hidden border ${tier?.color} flex flex-col relative`}
            >
              {tier?.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-black text-[9px] font-black uppercase tracking-widest rounded-full z-10">
                  {tier?.badge}
                </div>
              )}
              <div className={`${tier?.headerBg} p-6 sm:p-8 border-b border-white/5`}>
                <h3 className="text-2xl font-black text-white mb-1">{tier?.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-accent">{tier?.price}</span>
                  <span className="text-white/40 text-sm mb-1">{tier?.period}</span>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1 mb-8">
                  {tier?.benefits?.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-white/70">
                      <Icon name="CheckCircleIcon" size={16} className="text-accent shrink-0 mt-0.5" variant="solid" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}