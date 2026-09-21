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
      {settings?.resume_url && (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-8 print:hidden">
          <a
            href={settings.resume_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
      )}

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
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 link-underline">
                <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
            {social.github && (
              <a href={social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 link-underline">
                <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                GitHub
              </a>
            )}
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
                  {p.description && (
                    <ul className="mt-1.5 space-y-0.5 text-sm">
                      {p.description.split(/\.\s+/).filter(Boolean).map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[color:var(--color-subtle)] shrink-0">·</span>
                          <span>{s.replace(/\.$/, '')}.</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.technologies.length > 0 && (
                    <p className="mt-1 mono text-xs text-[color:var(--color-subtle)]">{p.technologies.join(' · ')}</p>
                  )}
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
