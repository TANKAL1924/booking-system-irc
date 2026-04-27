import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useBase } from '@/lib/useBase';
import { Scene, Reveal } from 'react-kino';

const facilities = [
  'Upper Field',
  'Lower Field',
  'Hockey Turf',
  '100m Athletic Track',
];

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

const tncItems = [
  'Booking is only confirmed upon receipt of deposit or full payment.',
  'A 50% deposit is required to secure the booking slot.',
  'Cancellations made 48 hours before the event will receive a 50% refund of the deposit.',
  'No refund for cancellations made less than 24 hours before the event.',
  'The facility must be vacated by the agreed end time. Overtime charges apply.',
  'The hirer is responsible for any damage caused during the rental period.',
  'Alcohol, gambling, and illegal activities are strictly prohibited.',
  'Arena IRC reserves the right to cancel bookings due to unforeseen circumstances.',
  'All bookings are subject to availability and management approval.',
  'Payment can be made via FPX, credit/debit card, or online transfer.',
];

export default function BookingFormSection() {
  const { base } = useBase();
  const [tncAccepted, setTncAccepted] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    facility: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    pax: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tncAccepted) return;
    setSubmitted(true);
  };

  const pricingMap: Record<string, number> = {
    'Upper Field': 150,
    'Lower Field': 120,
    'Hockey Turf': 180,
    '100m Athletic Track': 80,
  };

  const getEstimate = () => {
    if (!form.facility || !form.startTime || !form.endTime) return null;
    const start = timeSlots.indexOf(form.startTime);
    const end = timeSlots.indexOf(form.endTime);
    if (end <= start) return null;
    const hours = end - start;
    const total = (pricingMap[form.facility] || 0) * hours;
    return { hours, total, deposit: Math.ceil(total * 0.5) };
  };

  const estimate = getEstimate();

  if (submitted) {
    return (
      <section id="booking-form" className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircleIcon" size={32} className="text-[#25D366]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Booking Request Sent!</h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Thank you, <strong className="text-white">{form.name}</strong>. Your booking request for <strong className="text-accent">{form.facility}</strong> on <strong className="text-accent">{form.date}</strong> has been received. Our team will confirm within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name:'',phone:'',email:'',facility:'',date:'',startTime:'',endTime:'',purpose:'',pax:'' }); setTncAccepted(false); setStep(1); }}
              className="px-10 py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              Make Another Booking
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Scene duration="200vh" pin={false}>
    <section id="booking-form" className="pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal animation="fade-up" at={0.05}>
        <div className="mb-10">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Reserve</span>
          <h2 className="font-black text-3xl md:text-5xl tracking-tighter text-white">
            BOOKING <span className="gradient-text-brand">FORM</span>
          </h2>
        </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* T&C Accordion */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setTncOpen(!tncOpen)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <Icon name="DocumentTextIcon" size={20} className="text-accent shrink-0" />
                  <span className="font-bold text-white text-sm">Terms & Conditions</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Must Read
                  </span>
                </div>
                <Icon name={tncOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={18} className="text-white/40 shrink-0" />
              </button>
              {tncOpen && (
                <div className="px-5 sm:px-6 pb-6 border-t border-white/5">
                  <ol className="space-y-3 mt-4">
                    {(base?.tnc ?? tncItems).map((item, i) => (
                      <li key={i} className="flex gap-3 text-white/50 text-xs leading-relaxed">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tnc"
                  checked={tncAccepted}
                  onChange={(e) => setTncAccepted(e.target.checked)}
                  className="w-5 h-5 accent-red-600 cursor-pointer shrink-0"
                />
                <label htmlFor="tnc" className="text-sm text-white/60 cursor-pointer">
                  I have read and agree to the Terms & Conditions
                </label>
              </div>
            </div>

            {/* Personal Info */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">1</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Ahmad bin Abdullah"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+60 12-345 6789"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="ahmad@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Facility & Schedule */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">2</span>
                Facility & Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Select Facility *</label>
                  <select
                    name="facility"
                    value={form.facility}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-[#1A1A1A]">Choose a facility...</option>
                    {facilities.map((f) => (
                      <option key={f} value={f} className="bg-[#1A1A1A]">{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Estimated Pax</label>
                  <input
                    type="number"
                    name="pax"
                    value={form.pax}
                    onChange={handleChange}
                    placeholder="e.g. 22"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Start Time *</label>
                  <select
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-[#1A1A1A]">Select time...</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="bg-[#1A1A1A]">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">End Time *</label>
                  <select
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="" className="bg-[#1A1A1A]">Select time...</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="bg-[#1A1A1A]">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Purpose / Event Name</label>
                  <textarea
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Football training session, School sports day..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Option */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">3</span>
                Payment Option
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentOption('deposit')}
                  className={`p-4 sm:p-5 rounded-xl border text-left transition-all ${
                    paymentOption === 'deposit' ?'border-primary bg-primary/10' :'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === 'deposit' ? 'border-primary' : 'border-white/30'}`}>
                      {paymentOption === 'deposit' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-bold text-white text-sm">50% Deposit</span>
                  </div>
                  <p className="text-white/40 text-xs">Pay half now, balance before event day.</p>
                  {estimate && (
                    <p className="text-accent font-black text-lg mt-2">RM {estimate.deposit}</p>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('full')}
                  className={`p-4 sm:p-5 rounded-xl border text-left transition-all ${
                    paymentOption === 'full' ?'border-primary bg-primary/10' :'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === 'full' ? 'border-primary' : 'border-white/30'}`}>
                      {paymentOption === 'full' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-bold text-white text-sm">Full Payment</span>
                  </div>
                  <p className="text-white/40 text-xs">Pay in full and get priority confirmation.</p>
                  {estimate && (
                    <p className="text-accent font-black text-lg mt-2">RM {estimate.total}</p>
                  )}
                </button>
              </div>
              <p className="text-white/30 text-xs">Payment via FPX, credit/debit card, or bank transfer.</p>
            </div>

            <button
              type="submit"
              disabled={!tncAccepted}
              className={`w-full py-4 sm:py-5 rounded-full font-black text-sm sm:text-base uppercase tracking-widest transition-all ${
                tncAccepted
                  ? 'bg-primary text-white hover:bg-red-700 pulse-glow-anim' :'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {tncAccepted ? 'Submit Booking Request' : 'Accept T&C to Continue'}
            </button>
          </form>

          {/* Booking Summary */}
          <div className="space-y-4 lg:sticky lg:top-28 h-fit">
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-white text-base mb-5 flex items-center gap-2">
                <Icon name="ClipboardDocumentListIcon" size={18} className="text-accent" />
                Booking Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Facility</span>
                  <span className="font-bold text-white">{form.facility || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Date</span>
                  <span className="font-bold text-white">{form.date || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Time</span>
                  <span className="font-bold text-white text-right">
                    {form.startTime && form.endTime ? `${form.startTime} – ${form.endTime}` : '—'}
                  </span>
                </div>
                {estimate && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Duration</span>
                      <span className="font-bold text-white">{estimate.hours} hour{estimate.hours > 1 ? 's' : ''}</span>
                    </div>
                    <div className="border-t border-white/5 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Total</span>
                        <span className="font-black text-white text-base">RM {estimate.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">
                          {paymentOption === 'deposit' ? '50% Deposit' : 'Full Payment'}
                        </span>
                        <span className="font-black text-accent text-lg">
                          RM {paymentOption === 'deposit' ? estimate.deposit : estimate.total}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Scene>
  );
}