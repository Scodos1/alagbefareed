import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin accent scroll progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-[color:var(--color-accent)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
