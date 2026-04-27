import { motion } from 'framer-motion';

const orbs = [
  {
    color: 'radial-gradient(circle, rgba(220,38,38,0.28) 0%, transparent 70%)',
    size: 700,
    initial: { x: '-10%', y: '-10%' },
    animate: { x: ['-10%', '15%', '-5%', '-10%'], y: ['-10%', '20%', '40%', '-10%'] },
    duration: 5,
  },
  {
    color: 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 70%)',
    size: 650,
    initial: { x: '60%', y: '50%' },
    animate: { x: ['60%', '40%', '70%', '60%'], y: ['50%', '20%', '60%', '50%'] },
    duration: 6,
  },
  {
    color: 'radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)',
    size: 550,
    initial: { x: '30%', y: '80%' },
    animate: { x: ['30%', '55%', '20%', '30%'], y: ['80%', '60%', '90%', '80%'] },
    duration: 7,
  },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            background: orb.color,
            borderRadius: '50%',
            filter: 'blur(80px)',
            left: 0,
            top: 0,
          }}
          initial={orb.initial}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
