import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function NotFound() {
  const reduce = useReducedMotion();
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-32 text-center">
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-4">404</div>
        <h1 className="serif text-6xl italic">Not here.</h1>
        <p className="mt-6 text-[color:var(--color-muted)] max-w-md mx-auto">
          The page you were looking for either moved or never existed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm"
          >
            Go home
          </Link>
          <Link
            to="/projects"
            className="inline-block px-5 py-2.5 rounded-full border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] text-sm transition-colors"
          >
            View projects
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
