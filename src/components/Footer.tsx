import { Link } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const footerLinks = [
  { href: '/homepage', label: 'Home' },
  { href: '/the-arena', label: 'The Arena' },
  { href: '/book-now', label: 'Book Now' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', icon: 'GlobeAltIcon' },
  { href: 'https://facebook.com', label: 'Facebook', icon: 'GlobeAltIcon' },
  { href: 'https://tiktok.com', label: 'TikTok', icon: 'GlobeAltIcon' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + Brand */}
          <Link to="/homepage" className="flex items-center gap-3 group">
            <AppLogo size={32} />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">
                Arena <span className="text-primary">IRC</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/30">
                Negeri Sembilan Club
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[13px] font-medium text-white/40 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="text-[13px] font-medium text-white/40 hover:text-white transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/contact" className="text-[13px] font-medium text-white/40 hover:text-white transition-colors duration-200">
              Terms
            </Link>
          </div>

          {/* Social + Copyright */}
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
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20 font-medium">
            © 2026 Arena IRC & IRC Negeri Sembilan Club. All rights reserved.
          </p>
          <p className="text-[12px] text-white/20 font-medium">
            Mon–Sat · 8:00 AM – 5:30 PM
          </p>
        </div>
      </div>
    </footer>
  );
}