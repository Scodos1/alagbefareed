import { useEffect, useState } from 'react';
import { Download, Mail, MapPin } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { SiteSettings, Skill, Technology, Project } from '../lib/api';

type ExpData = {
  id: number;
  company: string;
  role: string;
  location?: string | null;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  responsibilities?: string[];
  technologies?: string[];
};

const SUMMARY = 'Full-stack developer specializing in modern, scalable web applications that solve real-world problems. Skilled in building end-to-end solutions spanning responsive frontends, REST APIs, databases, and AI-powered features. Focused on clean code, practical architecture, and shipping products people can actually use.';

const EDUCATION = {
  school: 'Lagos State University',
  degree: 'BSc Computer Science',
  dates: 'May 2023 – Jul 2026',
};

function formatDate(d: string | null) {
  if (!d) return 'Present';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Resume() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [techs, setTechs] = useState<Technology[]>([]);
  const [exps, setExps] = useState<ExpData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Resume — Alagbe Fareed Adebayo';
    Promise.all([
      apiGet<SiteSettings>('/api/settings'),
      apiGet<Skill[]>('/api/skills'),
      apiGet<Technology[]>('/api/technologies'),
      apiGet<ExpData[]>('/api/experience'),
      apiGet<Project[]>('/api/projects'),
    ])
      .then(([s, sk, t, ex, p]) => { setSettings(s); setSkills(sk); setTechs(t); setExps(ex); setProjects(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-[color:var(--color-muted)]">Loading…</div>;

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const techByCategory = techs.reduce<Record<string, Technology[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  const social = settings?.social_links || {};

  return (
    <>
      {/* Toolbar — hidden on print */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      {/* Resume content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 print:px-0 print:py-0 print:max-w-none">
        {/* Header */}
        <header className="mb-8">
          <h1 className="serif text-4xl sm:text-5xl tracking-tight">Alagbe Fareed Adebayo</h1>
          <p className="mt-1 text-lg text-[color:var(--color-muted)]">Full-Stack Developer</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 mono text-xs text-[color:var(--color-muted)]">
            {settings?.email && (
              <span className="inline-flex items-center gap-1">
                <Mail size={12} /> {settings.email}
              </span>
            )}
            {settings?.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {settings.location}
              </span>
            )}
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a>}
            {social.github && <a href={social.github} target="_blank" rel="noreferrer" className="link-underline">GitHub</a>}
          </div>
        </header>

        {/* Summary */}
        <Section title="Professional Summary">
          <p className="text-sm leading-relaxed">{SUMMARY}</p>
        </Section>

        {/* Experience */}
        {exps.length > 0 && (
          <Section title="Experience">
            <div className="space-y-6">
              {exps.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="font-medium">{e.role}</span>
                      <span className="text-[color:var(--color-muted)]"> · {e.company}</span>
                      {e.location && <span className="text-[color:var(--color-muted)]"> · {e.location}</span>}
                    </div>
                    <span className="mono text-xs text-[color:var(--color-muted)] whitespace-nowrap">
                      {formatDate(e.start_date)} – {e.current ? 'Present' : formatDate(e.end_date)}
                    </span>
                  </div>
                  {e.description && <p className="mt-1 text-sm text-[color:var(--color-muted)]">{e.description}</p>}
                  {e.responsibilities && e.responsibilities.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                      {e.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-5">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">{p.name}</span>
                    <span className="mono text-xs text-[color:var(--color-muted)] whitespace-nowrap">{p.project_date?.slice(0, 4)}</span>
                  </div>
                  {p.tagline && <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">{p.tagline}</p>}
                  {p.technologies.length > 0 && (
                    <p className="mt-1 mono text-xs text-[color:var(--color-subtle)]">{p.technologies.join(' · ')}</p>
                  )}
                  <div className="flex gap-3 mt-1">
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="mono text-xs link-underline">Live</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="mono text-xs link-underline">Code</a>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        <Section title="Education">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <span className="font-medium">{EDUCATION.school}</span>
              <span className="text-[color:var(--color-muted)]"> · {EDUCATION.degree}</span>
            </div>
            <span className="mono text-xs text-[color:var(--color-muted)] whitespace-nowrap">{EDUCATION.dates}</span>
          </div>
        </Section>

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <Section title="Skills">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat}>
                  <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">{cat}</div>
                  <p className="text-sm">{list.map((s) => s.name).join(' · ')}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Technologies */}
        {Object.keys(techByCategory).length > 0 && (
          <Section title="Technologies">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(techByCategory).map(([cat, list]) => (
                <div key={cat}>
                  <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">{cat}</div>
                  <p className="text-sm">{list.map((t) => t.name).join(' · ')}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h2 className="mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] border-b border-[color:var(--color-border)] pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
