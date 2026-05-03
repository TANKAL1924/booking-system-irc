import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const amenities = [
  {
    icon: 'CalendarDaysIcon',
    label: 'Daily Booking',
    description: 'Flexible hourly slots available every day for individuals, teams, and casual groups.',
  },
  {
    icon: 'UserGroupIcon',
    label: 'School Sport Day',
    description: 'Dedicated packages for schools hosting annual sports days, inter-class, or district competitions.',
  },
  {
    icon: 'AcademicCapIcon',
    label: 'Graduation',
    description: 'Host your graduation ceremony in our grand hall with a capacity of up to 900 guests.',
  },
  {
    icon: 'HeartIcon',
    label: 'Wedding / Engagement',
    description: 'Create unforgettable memories with a celebration held in our elegant and spacious arena.',
  },
  {
    icon: 'TrophyIcon',
    label: 'Any Suitable Sport Event',
    description: 'From official tournaments to friendly matches — we accommodate any sport at any scale.',
  },
];

export default function AmenitiesSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Heading */}
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            What We Offer
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            ARENA <span className="gradient-text-brand">AMENITIES</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {amenities.map((item, idx) => (
            <motion.div
              key={item.label}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={22} className="text-primary" />
              </div>

              {/* Label */}
              <p className="text-white font-black text-base leading-tight">{item.label}</p>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
