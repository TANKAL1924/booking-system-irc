import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const statusId = params.get('status_id');   // 1=success, 2=pending, 3=fail
  const orderId = params.get('order_id');     // booking id

  const [status, setStatus] = useState<'success' | 'pending' | 'fail' | 'unknown'>('unknown');

  useEffect(() => {
    if (statusId === '1') setStatus('success');
    else if (statusId === '2') setStatus('pending');
    else if (statusId === '3') setStatus('fail');
    else setStatus('unknown');
  }, [statusId]);

  const config = {
    success: {
      icon: 'CheckCircleIcon',
      iconColor: 'text-[#25D366]',
      iconBg: 'bg-[#25D366]/20',
      title: 'Payment Successful!',
      message: 'Your payment has been received. Our team will confirm your booking shortly.',
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
  }[status];

  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Icon name={config.icon as Parameters<typeof Icon>[0]['name']} size={32} className={config.iconColor} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">{config.title}</h2>
            <p className="text-white text-sm leading-relaxed mb-2">{config.message}</p>
            {orderId && (
              <p className="text-white text-xs mb-8">
                Booking reference: <span className="text-accent font-bold">#{orderId}</span>
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
              <Link
                to="/homepage"
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
