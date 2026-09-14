import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/** Subtle magnetic pull toward the cursor on hover. */
export default function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 17 });
  const sy = useSpring(y, { stiffness: 220, damping: 17 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  );
}
