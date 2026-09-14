import type { ReactNode } from 'react';

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  label?: string;
};

/** Infinite marquee ticker. Duplicates content for a seamless loop; pauses on hover. */
export default function Marquee({ items, className, label }: MarqueeProps) {
  return (
    <div className={`marquee ${className ?? ''}`} role={label ? undefined : 'presentation'}>
      {label && <span className="sr-only">{label}</span>}
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-10 pr-10 shrink-0">
            {items.map((item, i) => (
              <span key={i} className="shrink-0">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
