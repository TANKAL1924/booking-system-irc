import { Link } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useBase } from '@/lib/useBase';

const quickLinks = [
  { href: '/homepage', label: 'Upcoming Events' },
  { href: '/the-arena', label: 'About Arena IRC' },
  { href: '/the-arena', label: 'Gallery' },
  { href: '/contact', label: 'Host an Event' },
];

export default function Footer() {
  const { base } = useBase();
  const socialLinks = [
    { href: base?.facebook ?? 'https://facebook.com', label: 'Facebook', icon: 'GlobeAltIcon' },
    { href: base?.insta ?? 'https://instagram.com', label: 'Instagram', icon: 'GlobeAltIcon' },
    { href: base?.tiktok ?? 'https://tiktok.com', label: 'TikTok', icon: 'GlobeAltIcon' },
    { href: 'https://youtube.com', label: 'YouTube', icon: 'GlobeAltIcon' },
  ];
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left: Logo + Tagline + Social + Book Now */}
        <div className="flex flex-col gap-4">
          <Link to="/homepage" className="flex items-center gap-3">
            <AppLogo size={48} />
          </Link>
          <p className="text-[11px] font-black tracking-[0.2em] uppercase text-white">
            ARENA IRC
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <Icon name={s.icon as 'GlobeAltIcon'} size={15} />
              </a>
            ))}
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
                className="text-[11px] font-bold tracking-[0.12em] uppercase text-white hover:text-white transition-colors duration-200"
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
              className="flex items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-white transition-colors"
            >
              <Icon name="EnvelopeIcon" size={15} className="text-primary shrink-0" />
              info@arenairc.com
            </a>
            <div className="flex items-start gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white">
              <Icon name="MapPinIcon" size={15} className="text-primary shrink-0 mt-0.5" />
              <span>{base?.address ?? 'Arena IRC, Negeri Sembilan Darul Khusus'}</span>
            </div>
            <a
              href={base?.whatsapp ?? 'https://wa.me/601112345678'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-white transition-colors"
            >
              <Icon name="PhoneIcon" size={15} className="text-primary shrink-0" />
              {base?.whatsapp ?? '+601112345678'}
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/5">
        <p className="text-[10px] text-white font-bold uppercase tracking-widest text-center">
          © 2026 Arena IRC · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
