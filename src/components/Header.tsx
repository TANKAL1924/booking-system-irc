import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import LoginModal from '@/components/LoginModal';
import BookingModal from '@/components/BookingModal';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { href: '/homepage', label: 'Home' },
  { href: '/the-arena', label: 'The Arena' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleMenuScroll = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleMenuScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleMenuScroll);
  }, []);

  const { user, clearAuth } = useAuthStore();

  const handleLogin = () => {
    navigate('/admin-dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    navigate('/homepage');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/homepage" className="flex items-center gap-3 group">
            <AppLogo size={36} onClick={() => {}} />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white leading-tight">
                Arena <span className="text-primary">IRC</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/30 hidden sm:block">
                NS Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                to={link?.href}
                className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-200 ${
                  pathname === link?.href
                    ? 'text-primary' : 'text-white/50 hover:text-white'
                }`}
              >
                {link?.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!user && (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 text-white/60 rounded-full font-bold text-[11px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Icon name="LockClosedIcon" size={13} />
                Admin
              </button>
            )}
            <button
              onClick={() => setBookingOpen(true)}
              className="magnetic-btn px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all duration-300"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99] bg-[#0A0A0A]/98 backdrop-blur-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <Link to="/homepage" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <AppLogo size={36} />
              <span className="font-bold text-sm text-white">Arena <span className="text-primary">IRC</span></span>
            </Link>
            <button
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 py-8 flex-1">
            {navLinks?.map((link, i) => (
              <Link
                key={link?.href}
                to={link?.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between py-4 border-b border-white/5 text-lg font-bold tracking-tight transition-colors ${
                  pathname === link?.href ? 'text-primary' : 'text-white/70 hover:text-white'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link?.label}
                <Icon name="ChevronRightIcon" size={18} className="text-white/20" />
              </Link>
            ))}
            <div className="mt-6 space-y-3">
              {!user && (
                <button
                  onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
                  className="flex items-center justify-center gap-2 w-full py-4 border border-white/10 bg-white/5 text-white/60 rounded-full font-bold text-sm uppercase tracking-widest hover:text-white transition-all"
                >
                  <Icon name="LockClosedIcon" size={15} />
                  Admin Login
                </button>
              )}
              <button
                onClick={() => { setMenuOpen(false); setBookingOpen(true); }}
                className="block w-full py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest text-center hover:bg-red-700 transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
          <div className="px-6 py-6 border-t border-white/5">
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
              Mon–Sat · 8:00 AM – 5:30 PM
            </p>
          </div>
        </div>
      )}

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}