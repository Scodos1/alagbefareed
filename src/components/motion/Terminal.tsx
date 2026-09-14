import { useEffect, useState } from 'react';

export type TermLine = { cmd: string; out: string };

const DEFAULT_LINES: TermLine[] = [
  { cmd: 'whoami', out: 'fareed — full-stack developer' },
  { cmd: 'stack --short', out: 'python · django · react · postgres · supabase' },
  { cmd: 'status', out: 'open to work — freelance · contract · full-time' },
];

type TerminalProps = {
  title?: string;
  lines?: TermLine[];
  className?: string;
};

/** macOS-style terminal window that types out commands line by line. */
export default function Terminal({ title = 'fareed@portfolio: ~', lines = DEFAULT_LINES, className }: TerminalProps) {
  const [doneLines, setDoneLines] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDoneLines(lines.length);
      return;
    }
    if (doneLines >= lines.length) return;
    const current = lines[doneLines].cmd;
    if (chars < current.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 34);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDoneLines((d) => d + 1);
      setChars(0);
    }, 420);
    return () => clearTimeout(t);
  }, [chars, doneLines, lines]);

  return (
    <div
      className={`rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] overflow-hidden ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[color:var(--color-border)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="mono text-xs text-[color:var(--color-muted)] ml-2 truncate">{title}</span>
      </div>
      <div className="mono text-[13px] leading-7 p-5 min-h-[218px]">
        {lines.slice(0, doneLines).map((l, i) => (
          <div key={i}>
            <div>
              <span className="text-[color:var(--color-accent)]">$ </span>
              <span>{l.cmd}</span>
            </div>
            <div className="text-[color:var(--color-muted)]">{l.out}</div>
          </div>
        ))}
        {doneLines < lines.length && (
          <div>
            <span className="text-[color:var(--color-accent)]">$ </span>
            <span>{lines[doneLines].cmd.slice(0, chars)}</span>
            <span className="term-caret ml-1" />
          </div>
        )}
        {doneLines >= lines.length && (
          <div>
            <span className="text-[color:var(--color-accent)]">$ </span>
            <span className="term-caret ml-1" />
          </div>
        )}
      </div>
    </div>
  );
}
