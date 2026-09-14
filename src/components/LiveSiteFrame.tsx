import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

type LiveSiteFrameProps = {
  url: string;
  title: string;
  height?: number;
};

/** Browser-chrome framed live view of a project site. Only use for embeddable hosts. */
export default function LiveSiteFrame({ url, title, height = 600 }: LiveSiteFrameProps) {
  const [loaded, setLoaded] = useState(false);
  let host = url;
  try {
    host = new URL(url).host;
  } catch {}

  return (
    <div className="rounded-xl overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[color:var(--color-border)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="mono text-xs text-[color:var(--color-muted)] ml-2 truncate flex-1">{host}</span>
        <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-accent)] flex items-center gap-1.5 shrink-0">
          <span className="dot-pulse" /> Live
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] inline-flex items-center gap-1 shrink-0"
        >
          Open <ExternalLink size={12} />
        </a>
      </div>
      <div className="relative bg-[color:var(--color-surface-2)]" style={{ height }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mono text-xs text-[color:var(--color-muted)] animate-pulse">loading live site…</div>
          </div>
        )}
        <iframe
          src={url}
          title={`${title} — live preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
