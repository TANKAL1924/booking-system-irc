import { Link } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useBase } from '@/lib/useBase';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa6';

const quickLinks = [
  { href: '/homepage', label: 'Home' },
  { href: '/the-arena', label: 'The Arena' },
  { href: '/membership', label: 'Membership' },
  { href: '/book-now', label: 'Book Now' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  const { base } = useBase();
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left: Logo + Name + Social Icons */}
        <div className="flex flex-col gap-4">
          <Link to="/homepage" className="flex items-center gap-3">
            <AppLogo size={48} />
          </Link>
          <p className="text-[11px] font-black tracking-[0.2em] uppercase text-white">
            ARENA IRC
          </p>
          <div className="flex items-center gap-3">
            {base?.facebook && (
              <a href={base.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30 transition-all">
                <FaFacebook size={15} />
              </a>
            )}
            {base?.insta && (
              <a href={base.insta} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30 transition-all">
                <FaInstagram size={15} />
              </a>
            )}
            {base?.tiktok && (
              <a href={base.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30 transition-all">
                <FaTiktok size={15} />
              </a>
            )}
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
            {base?.email && (
              <a
                href={`mailto:${base.email}`}
                className="flex items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-white transition-colors"
              >
                <Icon name="EnvelopeIcon" size={15} className="text-primary shrink-0" />
                {base.email}
              </a>
            )}
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
