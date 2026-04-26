import AppImage from '@/components/ui/AppImage';
import { Link } from 'react-router-dom';

const facilities = [
{
  id: 'upper-field',
  name: 'Upper Field',
  price: 'RM 150',
  unit: '/hour',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_12c32fd0c-1776975283536.png",
  alt: 'Football field with white lines under stadium floodlights, dark atmospheric evening',
  tags: ['Football', 'Events', 'Sports Day'],
  available: true
},
{
  id: 'lower-field',
  name: 'Lower Field',
  price: 'RM 120',
  unit: '/hour',
  img: "https://images.unsplash.com/photo-1592340393582-b0117838cd9f",
  alt: 'Green soccer pitch at dusk, stadium lights, dark blue sky',
  tags: ['Football', 'Training', 'Futsal'],
  available: true
},
{
  id: 'hockey-turf',
  name: 'Hockey Turf',
  price: 'RM 180',
  unit: '/hour',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1c8247553-1775345406456.png",
  alt: 'Artificial hockey turf with goal posts, dramatic floodlights, dark stadium',
  tags: ['Hockey', 'Tournament', 'Training'],
  available: true
},
{
  id: 'athletic-track',
  name: '100m Athletic Track',
  price: 'RM 80',
  unit: '/hour',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1829cf204-1772228343102.png",
  alt: 'Red athletic track with lane markings, stadium atmosphere, overhead lighting',
  tags: ['Athletics', 'Sprint', 'Training'],
  available: true
},
{
  id: 'glasshouse',
  name: 'Glasshouse Hall',
  price: 'Contact Us',
  unit: '',
  img: "https://images.unsplash.com/photo-1698934641149-93431f3bd4f7",
  alt: 'Elegant glass event hall with warm lighting, romantic atmosphere, event setup',
  tags: ['Wedding', 'Engagement', 'Corporate'],
  available: false,
  contactOnly: true
},
{
  id: 'garden-hall',
  name: 'Garden Hall',
  price: 'Contact Us',
  unit: '',
  img: "https://images.unsplash.com/photo-1734894503998-0ffc4f50502f",
  alt: 'Grand banquet hall with stage lighting, rows of chairs, dark atmospheric ceiling',
  tags: ['Banquet', 'Graduation', 'Events'],
  available: false,
  contactOnly: true
}];


export default function FacilityPricingSection() {
  return (
    <section className="py-12 px-4 sm:px-6" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Pricing</span>
          <h2 className="font-black text-3xl md:text-5xl tracking-tighter text-white">
            FACILITIES & <span className="gradient-text-brand">PRICING</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities?.map((f) =>
          <div key={f?.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
              <div className="relative h-40 overflow-hidden">
                <AppImage
                src={f?.img}
                alt={f?.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                {f?.contactOnly &&
              <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-black text-[9px] font-bold uppercase tracking-widest rounded-full">
                    Enquiry Only
                  </div>
              }
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-black text-white">{f?.name}</h3>
                  <div className="text-right ml-2">
                    <span className="text-accent font-black text-base">{f?.price}</span>
                    {f?.unit && <span className="text-white/30 text-xs">{f?.unit}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {f?.tags?.map((tag) =>
                <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-bold uppercase text-white/40 rounded-full">
                      {tag}
                    </span>
                )}
                </div>
                <div className="mt-auto">
                  {f?.contactOnly ?
                <Link
                  to="/contact"
                  className="block w-full py-3 text-center bg-white/10 border border-white/15 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/15 transition-all">

                      Contact for Pricing
                    </Link> :

                <a
                  href="#booking-form"
                  className="block w-full py-3 text-center bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all">

                      Select & Book
                    </a>
                }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}