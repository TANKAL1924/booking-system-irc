import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS  = 30000;

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const statusId = params.get('status_id');  // 1=success, 2=pending, 3=fail
  const orderId  = params.get('order_id');   // session UUID

  // 'confirming' — paid, waiting for callback to create booking
  // 'confirmed'  — callback ran, booking_id found
  // 'delayed'    — paid but booking_id still null after timeout
  // 'pending' / 'fail' / 'unknown' — non-success paths
  const [status, setStatus] = useState<
    'confirming' | 'confirmed' | 'delayed' | 'pending' | 'fail' | 'unknown'
  >('confirming');

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const stopPolling = () => {
    if (pollRef.current)    clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (statusId === '2') { setStatus('pending');  return; }
    if (statusId === '3') { setStatus('fail');     return; }
    if (statusId !== '1' || !orderId) { setStatus('unknown'); return; }

    // Payment success — poll booking_session until callback sets booking_id
    setStatus('confirming');

    const poll = async () => {
      // orderId from Toyyibpay is the 32-char hex billRef — reconstruct UUID
      const sessionUUID = orderId && orderId.length === 32
        ? `${orderId.slice(0,8)}-${orderId.slice(8,12)}-${orderId.slice(12,16)}-${orderId.slice(16,20)}-${orderId.slice(20)}`
        : orderId;
      const { data } = await supabase
        .from('booking_session')
        .select('booking_id')
        .eq('id', sessionUUID)
        .maybeSingle();

      if (data?.booking_id) {
        stopPolling();
        setStatus('confirmed');
        // Best-effort receipt email (server callback is primary path)
        const sessionUUIDForReceipt = orderId && orderId.length === 32
          ? `${orderId.slice(0,8)}-${orderId.slice(8,12)}-${orderId.slice(12,16)}-${orderId.slice(16,20)}-${orderId.slice(20)}`
          : orderId;
        fetch(`${import.meta.env.VITE_FUNCTIONS_URL}/send-booking-receipt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ sessionId: sessionUUIDForReceipt }),
        }).catch(() => {});
      }
    };

    poll();
    pollRef.current    = setInterval(poll, POLL_INTERVAL_MS);
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setStatus('delayed'); // payment went through but callback is late
    }, POLL_TIMEOUT_MS);

    return () => stopPolling();
  }, [statusId, orderId]);

  type StatusConfig = {
    icon: Parameters<typeof Icon>[0]['name'];
    iconColor: string;
    iconBg: string;
    title: string;
    message: string;
  };

  const config: Record<typeof status, StatusConfig> = {
    confirming: {
      icon: 'ArrowPathIcon',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/20',
      title: 'Confirming Your Booking…',
      message: 'Payment received. Please wait while we confirm your booking.',
    },
    confirmed: {
      icon: 'CheckCircleIcon',
      iconColor: 'text-[#25D366]',
      iconBg: 'bg-[#25D366]/20',
      title: 'Booking Confirmed!',
      message: 'Your payment was successful and your booking is confirmed. A receipt has been sent to your email.',
    },
    delayed: {
      icon: 'ClockIcon',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/20',
      title: 'Payment Received',
      message: 'Your payment went through but your booking is still being processed. You will receive a confirmation email shortly. If you don\'t hear back within 15 minutes, please contact us with your reference below.',
    },
    pending: {
      icon: 'ClockIcon',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/20',
      title: 'Payment Pending',
      message: 'Your payment is being processed. We will notify you once it is confirmed.',
    },
    fail: {
      icon: 'XCircleIcon',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-400/20',
      title: 'Payment Failed',
      message: 'Something went wrong with your payment. Please try again or contact us.',
    },
    unknown: {
      icon: 'QuestionMarkCircleIcon',
      iconColor: 'text-white',
      iconBg: 'bg-white/10',
      title: 'Payment Status Unknown',
      message: 'We could not determine the payment status. Please contact us.',
    },
  };

  const c = config[status];

  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className={`w-16 h-16 ${c.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Icon
                name={c.icon}
                size={32}
                className={`${c.iconColor}${status === 'confirming' ? ' animate-spin' : ''}`}
              />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">{c.title}</h2>
            <p className="text-white text-sm leading-relaxed mb-2">{c.message}</p>
            {orderId && status !== 'confirmed' && (
              <p className="text-white text-xs mb-8">
                Reference: <span className="text-accent font-bold">{orderId.slice(0, 8).toUpperCase()}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {status === 'fail' && (
                <Link
                  to="/book-now"
                  className="px-8 py-3 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                  Try Again
                </Link>
              )}
              {status !== 'confirming' && (
                <Link
                  to="/homepage"
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Back to Home
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

