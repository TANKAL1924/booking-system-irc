import AppImage from '@/components/ui/AppImage';
import { Link } from 'react-router-dom';

const useCases = [
{
  id: 1,
  title: 'Daily Sports Booking',
  desc: 'Book fields and courts by the hour for your regular training sessions, casual games, or fitness routines. Flexible slots 7 days a week.',
  capacity: 'Any group size',
  duration: 'Min. 1 hour',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1575eeb83-1772168189945.png",
  alt: 'Athletes training on sports field at night, stadium lights illuminating the pitch, dark sky background'
},
{
  id: 2,
  title: 'School Sports Day',
  desc: 'Comprehensive packages for school sports days including multiple fields, PA system, timing equipment, and dedicated staff support.',
  capacity: 'Up to 500 students',
  duration: 'Full day',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_11c560a1c-1767183657018.png",
  alt: 'Students running on athletic track, school sports event, bright daylight, cheerful stadium atmosphere'
},
{
  id: 3,
  title: 'Graduation Ceremonies',
  desc: 'Host your convocation in our grand Banquet Hall accommodating up to 900 guests with stage, AV system, and full event coordination.',
  capacity: 'Up to 900 pax',
  duration: 'Half or full day',
  img: "https://images.unsplash.com/photo-1622775112326-346215e7e2d5",
  alt: 'Graduation ceremony in large hall with rows of chairs, warm ceremonial lighting, dark atmospheric ceiling'
},
{
  id: 4,
  title: 'Weddings & Engagements',
  desc: 'Create unforgettable memories in our elegant Glasshouse or Garden Hall. Customisable décor packages and catering coordination available.',
  capacity: 'Up to 300 pax',
  duration: 'Full day',
  img: "https://images.unsplash.com/photo-1727729890956-88233128a7cc",
  alt: 'Elegant wedding reception setup in glass hall with warm fairy lights, romantic dim atmosphere, floral decorations'
},
{
  id: 5,
  title: 'Tournaments & Sports Events',
  desc: 'Full tournament management support with multiple fields, electronic scoreboards, live commentary systems, and VIP galleries.',
  capacity: 'Up to 1,000 spectators',
  duration: 'Multi-day events',
  img: "https://images.unsplash.com/photo-1662318616540-46f046dba067",
  alt: 'Sports tournament in progress at large arena, crowd in stadium seating, dramatic overhead lighting on the field'
}];


export default function RentalUseCasesSection() {
  return (
    <section className="py-16 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            Use Cases
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            EVERY <span className="gradient-text-brand">OCCASION</span>
          </h2>
          <p className="text-white/40 text-base mt-4 max-w-xl mx-auto">
            From daily training to grand ceremonies — Arena IRC adapts to your needs.
          </p>
        </div>

        <div className="space-y-6">
          {useCases?.map((uc, i) =>
          <div
            key={uc?.id}
            className={`glass-card rounded-2xl overflow-hidden flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} group`}>

              <div className="relative w-full md:w-2/5 h-52 md:h-64 shrink-0 overflow-hidden">
                <AppImage
                src={uc?.img}
                alt={uc?.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 40vw" />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141414]/50" />
              </div>
              <div className="flex flex-col justify-between p-8 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-px bg-primary" />
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                      Use Case {String(uc?.id)?.padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{uc?.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-md">{uc?.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Capacity</span>
                    <span className="text-sm font-bold text-accent">{uc?.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Duration</span>
                    <span className="text-sm font-bold text-white">{uc?.duration}</span>
                  </div>
                  <Link
                  to="/book-now"
                  className="ml-auto px-6 py-3 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">

                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}