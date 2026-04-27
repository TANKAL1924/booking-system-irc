import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        const step = Math.max((100 - prev) * 0.07, 0.4);
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      const timer = setTimeout(onDone, 400);
      return () => clearTimeout(timer);
    }
  }, [percent, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141414]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <AppLogo size={72} />
      </motion.div>

      {/* Percentage */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        className="mb-4"
      >
        <span className="text-6xl font-black text-white tabular-nums">
          {Math.floor(percent)}
          <span className="text-primary">%</span>
        </span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30"
      >
        Where Energy Comes Alive
      </motion.p>
    </motion.div>
  );
}
