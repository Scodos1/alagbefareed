import type { ReactNode } from 'react';

export default function SectionTitle({
  eyebrow,
  children,
  align = 'left',
  action,
}: { eyebrow?: string; children: ReactNode; align?: 'left' | 'center'; action?: ReactNode }) {
  return (
    <div className={`mb-10 flex ${align === 'center' ? 'flex-col items-center text-center' : 'items-end justify-between flex-wrap gap-4'}`}>
      <div>
        {eyebrow && (
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-[color:var(--color-border-strong)]" />
            {eyebrow}
          </div>
        )}
        <h2 className="serif text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-2xl">{children}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
