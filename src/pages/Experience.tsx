import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import type { Experience as Exp } from '../lib/api';
import TypeReveal from '../components/motion/TypeReveal';

function formatDate(iso: string | null | undefined, current?: boolean) {
  if (current) return 'Present';
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Experience() {
  const [experience, setExperience] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Experience — Alagbe Fareed Adebayo';
    apiGet<Exp[]>('/api/experience').then(setExperience).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 fade-in">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">CV</div>
        <h1 className="serif text-5xl sm:text-6xl leading-[1.02] tracking-tight">
          <TypeReveal text="Eight years" as="span" /><br />of <TypeReveal text="shipping software." as="span" className="italic" />
        </h1>
        <p className="mt-6 text-[color:var(--color-muted)]">
          <TypeReveal text="From backend platform teams to founding engineer roles — here's what I've been up to." as="span" speed={18} />
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        {loading ? (
          <div className="text-[color:var(--color-muted)]">Loading…</div>
        ) : (
          <div className="space-y-16">
            {experience.map((e) => (
              <article key={e.id} className="grid md:grid-cols-[160px_1fr] gap-6 md:gap-10 border-t border-[color:var(--color-border)] pt-8">
                <div>
                  <div className="mono text-xs uppercase tracking-widest text-[color:var(--color-muted)]">
                    {formatDate(e.start_date)} – {formatDate(e.end_date, e.current)}
                  </div>
                  {e.location && <div className="mono text-xs text-[color:var(--color-subtle)] mt-1">{e.location}</div>}
                </div>
                <div>
                  <h2 className="serif text-3xl leading-tight"><TypeReveal text={e.role} as="span" /></h2>
                  <div className="text-lg text-[color:var(--color-muted)] mt-1">{e.company}</div>
                  <p className="mt-4 leading-relaxed">{e.description}</p>
                  {e.responsibilities && e.responsibilities.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {e.responsibilities.map((r, i) => (
                        <li key={i} className="flex gap-3 text-[color:var(--color-fg)]/90">
                          <span className="mono text-[color:var(--color-subtle)] text-xs pt-1.5">—</span>
                          <span className="text-sm leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.technologies && e.technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {e.technologies.map((t) => (
                        <span key={t} className="mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-muted)]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
