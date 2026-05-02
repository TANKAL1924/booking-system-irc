import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './homepage/AdminSidebar';
import type { AdminSection } from './homepage/AdminSidebar';
import HomeManagementSection from './home/components/HomeManagementSection';
import AdminAnnouncementsSection from './homepage/AdminAnnouncementsSection';
import EventManagementSection from './events/components/EventManagementSection';
import FacilitiesManagementSection from './facilities/components/FacilitiesManagementSection';
import BookingsTableSection from './bookings/components/BookingsTableSection';
import AdminTiersSection from './tiers/components/AdminTiersSection';
import SportManagementSection from './sport/components/SportManagementSection';
import Icon from '@/components/ui/AppIcon';

const sectionTitles: Record<AdminSection, string> = {
  Home: 'Home Management',
  Events: 'Event Management',
  Facilities: 'Facilities Management',
  Bookings: 'Booking Management',
  Tiers: 'Membership Tiers',
  Sport: 'Sport Management',
};

const mobileNavItems: Array<{ label: AdminSection; icon: string }> = [
  { label: 'Home', icon: 'PencilSquareIcon' },
  { label: 'Events', icon: 'MegaphoneIcon' },
  { label: 'Facilities', icon: 'BuildingOffice2Icon' },
  { label: 'Bookings', icon: 'CalendarDaysIcon' },
  { label: 'Tiers', icon: 'StarIcon' },
  { label: 'Sport', icon: 'TrophyIcon' },
];

export default function AdminDashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { section = 'home' } = useParams<{ section: string }>();
  const activeSection = (section.charAt(0).toUpperCase() + section.slice(1)) as AdminSection;
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HomeManagementSection />;
      case 'Events':
        return (
          <>
            <AdminAnnouncementsSection />
            <EventManagementSection />
          </>
        );
      case 'Facilities':
        return <FacilitiesManagementSection />;
      case 'Bookings':
        return <BookingsTableSection />;
      case 'Tiers':
        return <AdminTiersSection />;
      case 'Sport':
        return <SportManagementSection />;
      default:
        return null;
    }
  };

  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="flex">
        <AdminSidebar onMobileNavigate={() => setMobileMenuOpen(false)} />

        <div className="flex-1 min-w-0">
          {/* Mobile Top Bar */}
          <div className="lg:hidden sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon name="LockClosedIcon" size={13} className="text-primary" />
              </div>
              <h1 className="text-sm font-black text-white truncate">{sectionTitles[activeSection]}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/homepage"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs font-bold hover:text-white transition-colors"
              >
                <Icon name="ArrowLeftOnRectangleIcon" size={14} />
                <span className="hidden xs:inline">Site</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold"
              >
                <Icon name={mobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={16} />
                <span className="hidden xs:inline">Menu</span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#0A0A0A]/98 border-b border-white/5 px-4 py-3 grid grid-cols-2 gap-2">
              {mobileNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(`/admin-dashboard/${item.label.toLowerCase()}`); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeSection === item.label
                      ? 'bg-primary/15 text-primary border border-primary/20' :'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon name={item.icon as 'HomeIcon'} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            {renderSection()}
          </div>
        </div>
      </div>
    </main>
  );
}