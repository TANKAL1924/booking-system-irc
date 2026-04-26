import { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import BookingFormSection from './BookingFormSection';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">Reserve</p>
            <h2 className="text-xl font-black text-white tracking-tight">Book a Facility</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close booking form"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Form content */}
        <div className="px-2 sm:px-4">
          <BookingFormSection />
        </div>
      </div>
    </div>
  );
}
