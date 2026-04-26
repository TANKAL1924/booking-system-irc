import React from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/components/ui/AppImage';


const facilities = [
{
  id: 1,
  name: 'Upper Field',
  capacity: '22 players',
  area: '100m × 64m',
  desc: 'Full-size multipurpose grass field suitable for football, corporate sports days, and large-scale outdoor events.',
  features: ['Floodlights', 'Changing Rooms', 'Spectator Seating'],
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_193c682ef-1771574869268.png",
  alt: 'Green football field with white boundary lines under bright stadium floodlights, dark evening atmosphere',
  price: 'From RM 150/hr'
},
{
  id: 2,
  name: 'Lower Field',
  capacity: '22 players',
  area: '90m × 60m',
  desc: 'Secondary grass field for training sessions, smaller tournaments, and recreational sports activities.',
  features: ['Floodlights', 'Parking Access', 'PA System'],
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_12c32fd0c-1776975283536.png",
  alt: 'Empty soccer pitch at dusk with green grass, stadium lights warming up, dark blue sky in background',
  price: 'From RM 120/hr'
},
{
  id: 3,
  name: 'Hockey Turf',
  capacity: '22 players',
  area: '91m × 55m',
  desc: 'FIFA-standard artificial turf with water-based surface system for competitive and recreational hockey play.',
  features: ['Water-Based Turf', 'Electronic Scoreboard', 'VIP Gallery'],
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1c8247553-1775345406456.png",
  alt: 'Green artificial hockey turf with white goal posts, dramatic stadium floodlights, dark atmosphere',
  price: 'From RM 180/hr'
},
{
  id: 4,
  name: '100m Athletic Track',
  capacity: '8 lanes',
  area: '100m straight',
  desc: 'Certified polyurethane athletic track for sprinting competitions, training camps, and school sports days.',
  features: ['8 Lanes', 'Timing System', 'Jump Pit'],
  img: "https://images.unsplash.com/photo-1601918110797-b72525451a15",
  alt: 'Red running track lanes with white markings, empty stadium, dim overhead lighting casting long shadows',
  price: 'From RM 80/hr'
},
{
  id: 5,
  name: 'Glasshouse Hall',
  capacity: 'Up to 300 pax',
  area: '800 sqm',
  desc: 'Elegant glass-paneled event hall with natural lighting, perfect for weddings, engagements, and corporate dinners.',
  features: ['Air-Conditioned', 'Stage Setup', 'Catering Kitchen'],
  img: "https://images.unsplash.com/photo-1723642393810-eee2bbe316f4",
  alt: 'Elegant banquet hall with round tables, warm lighting, glass ceiling panels, dark romantic atmosphere',
  price: 'Contact for pricing',
  contactOnly: true
},
{
  id: 6,
  name: 'Banquet Hall',
  capacity: 'Up to 900 pax',
  area: '2,500 sqm',
  desc: 'Grand banquet hall — the largest in Negeri Sembilan. Ideal for graduation ceremonies, galas, and large weddings.',
  features: ['900 Pax Capacity', 'Stage & PA', 'Full AV System'],
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_146d1f4db-1772486454436.png",
  alt: 'Grand ballroom with rows of chairs, dramatic stage lighting, dark atmospheric ceiling, large event setup',
  price: 'Contact for pricing',
  contactOnly: true
}];


export default function FacilitiesGridSection() {
  return (
    <section id="facilities" className="pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Our Venues</span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            ALL <span className="gradient-text-brand">FACILITIES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities?.map((f) =>
          <div key={f?.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <AppImage
                src={f?.img}
                alt={f?.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                {f?.contactOnly &&
              <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-black text-[9px] font-bold uppercase tracking-widest rounded-full">
                    Contact Required
                  </div>
              }
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-black text-white">{f?.name}</h3>
                  <span className="text-accent font-black text-sm whitespace-nowrap ml-2">{f?.price}</span>
                </div>
                <div className="flex gap-4 mb-3">
                  <span className="text-[10px] font-bold text-white/30 uppercase">{f?.capacity}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase">{f?.area}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed mb-4 flex-1">{f?.desc}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}