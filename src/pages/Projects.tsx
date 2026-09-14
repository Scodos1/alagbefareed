import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api';
import type { Project } from '../lib/api';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [tech, setTech] = useState<string>('All');

  useEffect(() => {
    document.title = 'Projects — Alagbe Fareed Adebayo';
    apiGet<Project[]>('/api/projects')
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const techs = useMemo(() => ['All', ...Array.from(new Set(projects.flatMap((p) => p.technologies)))], [projects]);

  const filtered = projects.filter((p) => (category === 'All' || p.category === category) && (tech === 'All' || p.technologies.includes(tech)));

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10 fade-in">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">Selected work</div>
        <h1 className="serif text-5xl sm:text-6xl leading-[1.02] tracking-tight max-w-3xl">
          Projects, each one<br />with a <span className="italic">reason it exists.</span>
        </h1>
        <p className="mt-6 text-[color:var(--color-muted)] max-w-xl">
          These are systems I designed, shipped and iterated on — either at companies or under my own name. Filter by discipline or by stack.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <div className="border-y border-[color:var(--color-border)] py-4 flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mr-1">Category</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  category === c
                    ? 'bg-[color:var(--color-fg)] text-[color:var(--color-bg)] border-[color:var(--color-fg)]'
                    : 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]'
                }`}
              >{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mr-1">Stack</span>
            {techs.slice(0, 10).map((t) => (
              <button
                key={t}
                onClick={() => setTech(t)}
                className={`mono text-[10px] uppercase tracking-wide px-2 py-1 rounded transition-colors ${
                  tech === t
                    ? 'bg-[color:var(--color-accent)] text-white'
                    : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]'
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 rounded-lg bg-[color:var(--color-surface-2)] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-[color:var(--color-muted)] border border-dashed border-[color:var(--color-border)] rounded-lg">
            No projects match those filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
