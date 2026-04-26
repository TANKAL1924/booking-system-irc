import { Link } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const quickLinks = [
  { href: '/homepage', label: 'Upcoming Events' },
  { href: '/the-arena', label: 'About Arena IRC' },
  { href: '/the-arena', label: 'Gallery' },
  { href: '/contact', label: 'Host an Event' },
];

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: 'GlobeAltIcon' },
  { href: 'https://instagram.com', label: 'Instagram', icon: 'GlobeAltIcon' },
  { href: 'https://tiktok.com', label: 'TikTok', icon: 'GlobeAltIcon' },
  { href: 'https://youtube.com', label: 'YouTube', icon: 'GlobeAltIcon' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 px-6 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Left: Logo + Tagline + Social + Book Now */}
        <div className="flex flex-col gap-6">
          <Link to="/homepage" className="flex items-center gap-3">
            <AppLogo size={48} />
          </Link>
          <p className="text-[11px] font-black tracking-[0.2em] uppercase text-white/40">
            Where Energy Comes Alive
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <Icon name={s.icon as 'GlobeAltIcon'} size={15} />
              </a>
            ))}
          </div>
          <div>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-black text-[11px] tracking-[0.2em] uppercase rounded hover:bg-primary hover:text-white transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-black tracking-[0.2em] uppercase text-white">
            Quick Links
          </h4>
          <div className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-black tracking-[0.2em] uppercase text-white">
            Contact
          </h4>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:info@arenairc.com"
              className="flex items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors"
            >
              <Icon name="EnvelopeIcon" size={15} className="text-primary shrink-0" />
              info@arenairc.com
            </a>
            <div className="flex items-start gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white/40">
              <Icon name="MapPinIcon" size={15} className="text-primary shrink-0 mt-0.5" />
              <span>Arena IRC, Negeri Sembilan Darul Khusus</span>
            </div>
            <a
              href="tel:+601112345678"
              className="flex items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors"
            >
              <Icon name="PhoneIcon" size={15} className="text-primary shrink-0" />
              +601112345678
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
          © 2026 Arena IRC · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
