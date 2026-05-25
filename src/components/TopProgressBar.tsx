import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopProgressBar() {
  const { state } = useNavigation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (state === 'loading' || state === 'submitting') {
      setProgress(0);
      setVisible(true);
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          const step = Math.max((90 - prev) * 0.08, 0.5);
          return Math.min(prev + step, 90);
        });
      }, 50);
    } else {
      clearTimer();
      setProgress(100);
      const hide = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(hide);
    }
    return clearTimer;
  }, [state]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="top-progress-bar"
          className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-primary shadow-[0_0_8px_2px_rgba(220,38,38,0.6)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
