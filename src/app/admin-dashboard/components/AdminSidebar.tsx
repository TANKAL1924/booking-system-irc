import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/AppIcon';

export type AdminSection =
  | 'Dashboard' |'Home' |'Events' |'Facilities' |'Bookings' |'Payments' |'Members';

interface AdminSidebarProps {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
}

const navItems: Array<{ label: AdminSection; icon: string; description: string }> = [
  { label: 'Dashboard', icon: 'HomeIcon', description: 'Overview & stats' },
  { label: 'Home', icon: 'PencilSquareIcon', description: 'About, company, social' },
  { label: 'Events', icon: 'MegaphoneIcon', description: 'Add & manage events' },
  { label: 'Facilities', icon: 'BuildingOffice2Icon', description: 'Facilities & pricing' },
  { label: 'Bookings', icon: 'CalendarDaysIcon', description: 'Customer bookings' },
  { label: 'Payments', icon: 'CreditCardIcon', description: 'Payment methods' },
  { label: 'Members', icon: 'UsersIcon', description: 'Member management' },
];

export default function AdminSidebar({ active, onNavigate }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-white/5 min-h-[calc(100vh-80px)] sticky top-20 bg-[#0A0A0A]">
      <div className="p-4 border-b border-white/5">
        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-1">Admin Panel</p>
          <p className="text-sm font-bold text-white">Arena IRC</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
              active === item.label
                ? 'bg-primary/15 text-primary border border-primary/20' :'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name={item.icon as 'HomeIcon'} size={17} />
            <div className="text-left">
              <p className="leading-tight">{item.label}</p>
              <p className={`text-[9px] font-medium leading-tight mt-0.5 ${active === item.label ? 'text-primary/60' : 'text-white/20'}`}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <Link
          to="/homepage"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Icon name="ArrowLeftOnRectangleIcon" size={17} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}