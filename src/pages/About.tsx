import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import type { SiteSettings, Skill, Experience } from '../lib/api';
import SectionTitle from '../components/SectionTitle';

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'About — Alagbe Fareed Adebayo';
    Promise.all([
      apiGet<SiteSettings>('/api/settings'),
      apiGet<Skill[]>('/api/skills'),
      apiGet<Experience[]>('/api/experience'),
    ])
      .then(([s, sk, ex]) => { setSettings(s); setSkills(sk); setExperience(ex); })
      .finally(() => setLoading(false));
  }, []);

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  if (loading) return <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-[color:var(--color-muted)]">Loading…</div>;

  return (
    <div>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 fade-in">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">About</div>
        <h1 className="serif text-5xl sm:text-6xl leading-[1.02] tracking-tight">
          I build software the way I'd want<br /><span className="italic">someone to build it for me.</span>
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <div className="prose-editorial">
          <p className="serif text-2xl leading-relaxed text-[color:var(--color-muted)]">
            {settings?.bio}
          </p>

          <h2>Philosophy</h2>
          <p>{settings?.philosophy}</p>

          <h2>Currently</h2>
          <p>{settings?.current_focus}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <SectionTitle eyebrow="Skills">A short list of<br /><span className="italic">things I do well.</span></SectionTitle>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {Object.entries(skillsByCategory).map(([cat, list]) => (
            <div key={cat}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-3 pb-2 border-b border-[color:var(--color-border)]">{cat}</div>
              <ul className="space-y-1.5">
                {list.map((s) => <li key={s.id} className="text-sm">{s.name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 border-t border-[color:var(--color-border)]">
        <SectionTitle eyebrow="Trajectory">Where I've<br /><span className="italic">spent my time.</span></SectionTitle>
        <div className="space-y-10">
          {experience.map((e) => (
            <div key={e.id} className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 md:gap-6">
              <div className="mono text-xs text-[color:var(--color-muted)] md:pt-1">
                {new Date(e.start_date).getFullYear()}
                <span className="text-[color:var(--color-subtle)]"> – {e.current ? 'now' : e.end_date ? new Date(e.end_date).getFullYear() : ''}</span>
              </div>
              <div>
                <div className="serif text-xl sm:text-2xl leading-tight">{e.role}</div>
                <div className="text-sm text-[color:var(--color-muted)] mt-0.5">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <p className="mt-3 text-[color:var(--color-fg)] leading-relaxed">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
