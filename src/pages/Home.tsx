import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { Project, Technology, SiteSettings } from '../lib/api';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/motion/Reveal';
import Magnetic from '../components/motion/Magnetic';
import Marquee from '../components/motion/Marquee';
import Terminal from '../components/motion/Terminal';

const GLYPHS = [
  { ch: '{ }', top: '12%', left: '4%', delay: '0s', rot: '-8deg' },
  { ch: '</>', top: '20%', right: '6%', delay: '1.2s', rot: '6deg' },
  { ch: '$ _', top: '58%', left: '2%', delay: '2s', rot: '4deg' },
  { ch: '[ ]', top: '70%', right: '3%', delay: '0.6s', rot: '-6deg' },
];

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featured, setFeatured] = useState<Project[]>([]);
  const [techs, setTechs] = useState<Technology[]>([]);
  const [stats, setStats] = useState<{ projects: number; technologies: number; experience: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    Promise.all([
      apiGet<SiteSettings>('/api/settings'),
      apiGet<Project[]>('/api/projects?featured=true'),
      apiGet<Technology[]>('/api/technologies'),
      apiGet<any>('/api/stats'),
    ])
      .then(([s, p, t, st]) => {
        setSettings(s);
        setFeatured(p.slice(0, 3));
        setTechs(t);
        setStats(st);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const techByCategory = techs.reduce<Record<string, Technology[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  const termLines = [
    { cmd: 'whoami', out: `${settings?.name || 'Alagbe Fareed Adebayo'} — ${settings?.title || 'Full-Stack Developer'}` },
    { cmd: 'stack --short', out: techs.slice(0, 5).map((t) => t.name.toLowerCase()).join(' · ') || 'python · django · react · postgres · supabase' },
    { cmd: 'status', out: settings?.availability || 'Available for new opportunities' },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="code-grid absolute inset-0" aria-hidden />
        {!reduce &&
          GLYPHS.map((g, i) => (
            <span
              key={i}
              aria-hidden
              className="drift hidden md:block absolute mono text-sm text-[color:var(--color-accent)] opacity-40 select-none"
              style={{ top: g.top, left: g.left, right: g.right, animationDelay: g.delay, ['--drift-rot' as any]: g.rot }}
            >
              {g.ch}
            </span>
          ))}
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20">
          <div className="flex flex-col gap-10">
            {/* Hero text + terminal side by side on desktop */}
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 lg:pt-8 w-full order-1 lg:order-2">
                <Terminal lines={termLines} />
                {stats && (
                  <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <div className="serif text-3xl">{stats.projects}</div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mt-1">Projects</div>
                    </div>
                    <div>
                      <div className="serif text-3xl">{stats.technologies}</div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mt-1">Tech stack</div>
                    </div>
                    <div>
                      <div className="serif text-3xl">1</div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mt-1">Yrs shipped</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6 flex items-center gap-3">
                  <span className={settings?.available_for_work ? 'dot-pulse' : 'inline-block w-2 h-2 rounded-full bg-[color:var(--color-subtle)]'} />
                  <span>
                    <span className="text-[color:var(--color-accent)]">$ </span>
                    {settings?.availability || 'Available for new opportunities'}
                  </span>
                </div>
                <h1 className="serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight">
                  {settings?.name || 'Alagbe Fareed Adebayo'}<span className="italic text-[color:var(--color-muted)]"> —</span><br />
                  builds <span className="italic text-[color:var(--color-accent)]">scalable</span>
                  <br />web systems.
                </h1>
                <p className="mt-8 text-lg sm:text-xl text-[color:var(--color-muted)] max-w-xl leading-relaxed">
                  {settings?.bio || 'Full-Stack Developer building modern, scalable web applications — thoughtful frontend experiences backed by robust APIs, databases, and AI-powered functionality.'}
                </p>
              </div>
            </div>

          {/* Buttons — below terminal on mobile, inline on desktop */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm font-medium hover:shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--color-accent)_60%,transparent)] transition-shadow"
              >
                View selected work
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[color:var(--color-border-strong)] text-sm font-medium hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
              >
                Start a conversation
              </Link>
            </Magnetic>
          </div>
        </div>
        </div>
      </section>

      {/* Rolling ticker of technologies */}
      <section className="border-y border-[color:var(--color-border)] py-4 bg-[color:var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center gap-3 sm:gap-6">
          <span className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] shrink-0">
            <span className="text-[color:var(--color-accent)]">$ </span>stack --today
          </span>
          <Marquee
            label="Current stack"
            items={techs.slice(0, 12).map((t) => (
              <span key={t.id} className="mono text-xs text-[color:var(--color-muted)]">
                <span className="text-[color:var(--color-accent)] mr-2">▸</span>
                {t.name}
              </span>
            ))}
          />
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <Reveal>
          <SectionTitle
            eyebrow="$ selected-work"
            action={<Link to="/projects" className="mono text-xs uppercase tracking-widest text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] inline-flex items-center gap-1">All projects <ArrowUpRight size={14} /></Link>}
          >
            Case studies from<br /><span className="italic">production systems.</span>
          </SectionTitle>
        </Reveal>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[color:var(--color-border)] rounded-lg h-80 animate-pulse bg-[color:var(--color-surface-2)]" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-[color:var(--color-muted)] py-16 text-center border border-dashed border-[color:var(--color-border)] rounded-lg">
            No featured projects yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 0.08, 0.24)}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CAPABILITIES */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-t border-[color:var(--color-border)]">
        <Reveal>
          <SectionTitle eyebrow="$ capabilities">
            A generalist mindset,<br /><span className="italic">specialised depth.</span>
          </SectionTitle>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {Object.entries(techByCategory).map(([cat, list], ci) => (
            <Reveal key={cat} delay={Math.min(ci * 0.06, 0.2)}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-4 pb-2 border-b border-[color:var(--color-border)]">{cat}</div>
              <ul className="space-y-2">
                {list.slice(0, 8).map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm group">
                    <span className="group-hover:text-[color:var(--color-accent)] transition-colors">{t.name}</span>
                    <span className="mono text-[10px] text-[color:var(--color-accent)] tracking-widest">
                      {'■'.repeat(t.skill_level)}{'□'.repeat(Math.max(0, 5 - t.skill_level))}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24 border-t border-[color:var(--color-border)]">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">$ get-in-touch</div>
            <p className="serif text-[clamp(2.5rem,6vw,5rem)] leading-[1] tracking-tight">
              Have a system that needs{' '}<span className="italic text-[color:var(--color-accent)]">someone who cares?</span>
            </p>
            <Magnetic className="inline-block mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm font-medium hover:shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--color-accent)_60%,transparent)] transition-shadow"
              >
                Write me a note <ArrowRight size={16} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
