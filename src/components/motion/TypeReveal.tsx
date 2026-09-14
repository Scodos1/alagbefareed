import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const TYPED_KEY = 'portfolio_typed';

type TypeRevealProps = {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
};

/**
 * Scroll-triggered typewriter. Types `text` character-by-character
 * when the element enters the viewport. Only animates once per session —
 * after the first visit, text appears instantly.
 */
export default function TypeReveal({
  text,
  className,
  speed = 28,
  delay = 0,
  as: Tag = 'span',
}: TypeRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-64px' });
  const reduce = useReducedMotion();
  const alreadyTyped = typeof window !== 'undefined' && sessionStorage.getItem(TYPED_KEY) === '1';
  const skip = reduce || alreadyTyped;

  const [chars, setChars] = useState(skip ? text.length : 0);
  const [started, setStarted] = useState(false);
  const done = chars >= text.length;

  // Mark as typed after first animation completes
  useEffect(() => {
    if (done && !skip && !reduce) {
      sessionStorage.setItem(TYPED_KEY, '1');
    }
  }, [done, skip, reduce]);

  // Delay before typing starts
  useEffect(() => {
    if (!inView || skip || started) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [inView, skip, delay, started]);

  // Typing interval
  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => {
      setChars((c) => {
        if (c >= text.length) return c;
        return c + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [started, done, text, speed]);

  return (
    <Tag ref={ref as any} className={className}>
      {text.slice(0, chars)}
      {started && !done && <span className="term-caret ml-0.5" />}
    </Tag>
  );
}
