import { useEffect, useRef, useState } from 'react';

const BOOT_KEY = 'portfolio_booted';

const CHARS = 28;
const LINE_GAP = 280;
const POST_TYPE_PAUSE = 500;
const ZOOM_MS = 700;

type Phase = 'idle' | 'typing' | 'zoom' | 'done';

function buildLines(count: number | null) {
  return [
    'boot --portfolio',
    'loading modules...          ok',
    'initializing fareed@portfolio... ok',
    'connecting to supabase...    ok',
    count !== null ? `fetching projects...         ${count} found` : 'fetching projects...         ok',
    'rendering ui...              done',
  ];
}

export default function BootScreen({ children }: { children: React.ReactNode }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (sessionStorage.getItem(BOOT_KEY)) return false;
    if (reduced) return false;
    return true;
  });

  const [phase, setPhase] = useState<Phase>(showBoot ? 'idle' : 'done');
  const [typedCount, setTypedCount] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [lines, setLines] = useState(() => buildLines(null));

  // Clear typed flag so scroll-typing plays on first visit
  useEffect(() => {
    if (showBoot) sessionStorage.removeItem('portfolio_typed');
  }, [showBoot]);

  // Fetch count, then start typing
  useEffect(() => {
    if (!showBoot || phase !== 'idle') return;

    let cancelled = false;

    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d)) {
          setLines(buildLines(d.length));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPhase('typing');
      });

    return () => { cancelled = true; };
  }, [showBoot, phase]);

  // Typing engine
  const linesRef = useRef(lines);
  linesRef.current = lines;

  useEffect(() => {
    if (phase !== 'typing') return;

    const currentLines = linesRef.current;
    let line = 0;
    let ch = 0;
    let t: ReturnType<typeof setTimeout>;

    function tick() {
      if (line >= currentLines.length) {
        setTimeout(() => setPhase('zoom'), POST_TYPE_PAUSE);
        return;
      }
      ch++;
      setCharIdx(ch);
      if (ch >= currentLines[line].length) {
        setTypedCount(line + 1);
        setCharIdx(0);
        line++;
        ch = 0;
        t = setTimeout(tick, LINE_GAP);
      } else {
        t = setTimeout(tick, CHARS);
      }
    }

    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [phase]);

  // Zoom out → done
  useEffect(() => {
    if (phase === 'zoom') {
      const t = setTimeout(() => {
        sessionStorage.setItem(BOOT_KEY, '1');
        setShowBoot(false);
      }, ZOOM_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (!showBoot) return <>{children}</>;

  const currentLine = typedCount < lines.length ? lines[typedCount] : null;
  const currentText = currentLine ? currentLine.slice(0, charIdx) : '';

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black ${
        phase === 'zoom' ? 'boot-zoom-out' : ''
      }`}
    >
      <div className="relative w-full max-w-lg mx-4 boot-terminal">
        <div className="flex items-center gap-2 px-4 py-3 rounded-t-xl border border-b-0 border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="mono text-xs text-[color:var(--color-muted)] ml-2">fareed@portfolio:~</span>
        </div>

        <div className="mono text-[13px] leading-7 p-5 rounded-b-xl border border-t-0 border-[color:var(--color-border)] bg-[color:var(--color-surface)] min-h-[260px]">
          {lines.slice(0, typedCount).map((line, i) => (
            <div key={i}>
              <span className="text-[color:var(--color-accent)]">$ </span>
              <span>{line}</span>
            </div>
          ))}

          {currentLine && phase === 'typing' && (
            <div>
              <span className="text-[color:var(--color-accent)]">$ </span>
              <span>{currentText}</span>
              <span className="term-caret ml-1" />
            </div>
          )}

          {phase !== 'typing' && phase !== 'idle' && (
            <div className="mt-2 text-[color:var(--color-accent)]">
              $ portfolio ready — launching<span className="term-caret ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
