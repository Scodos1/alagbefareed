import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { Project } from '../lib/api';
import LiveSiteFrame from '../components/LiveSiteFrame';
import { canEmbedLive } from '../lib/embed';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiGet<Project>(`/api/projects?slug=${slug}`)
      .then((p) => {
        setProject(p);
        document.title = `${p.name} — Alagbe Fareed Adebayo`;
      })
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-[color:var(--color-muted)]">Loading case study…</div>;
  if (error || !project) return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
      <p className="text-[color:var(--color-muted)]">{error || 'Not found'}</p>
      <Link to="/projects" className="link-underline text-sm mt-4 inline-block">Back to projects</Link>
    </div>
  );

  const features = project.features || [];

  return (
    <article>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-12">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
          <ArrowLeft size={14} /> All projects
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 pb-10">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] flex items-center gap-3 mb-6">
          <span>{project.category}</span>
          <span className="w-6 h-px bg-[color:var(--color-border-strong)]" />
          <span>{new Date(project.project_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
        <h1 className="serif text-5xl sm:text-7xl leading-[0.98] tracking-tight">{project.name}</h1>
        <p className="mt-6 text-xl text-[color:var(--color-muted)] max-w-2xl leading-relaxed">{project.tagline || project.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm">
              <ExternalLink size={14} /> Live site
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[color:var(--color-border-strong)] text-sm">
              <Github size={14} /> Source
            </a>
          )}
        </div>
      </header>

      {project.live_url && canEmbedLive(project.slug) ? (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-16">
          <LiveSiteFrame url={project.live_url} title={project.name} />
        </div>
      ) : project.image_url && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-16">
          <div className="rounded-lg overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
            <img src={project.image_url} alt={project.name} className="w-full h-auto" />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-3 gap-6 pb-16 border-b border-[color:var(--color-border)]">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-2">Role</div>
            <div className="text-sm">Design, engineering, deployment</div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-2">Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <span key={t} className="mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-muted)]">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-2">Shipped</div>
            <div className="text-sm">{new Date(project.project_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <div className="prose-editorial py-16">
          {project.problem && (<><h2>The problem</h2><p>{project.problem}</p></>)}
          {project.solution && (<><h2>The approach</h2><p>{project.solution}</p></>)}

          {features.length > 0 && (
            <>
              <h2>What it does</h2>
              <ul>
                {features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </>
          )}

          {project.architecture && (<><h2>Architecture</h2><p>{project.architecture}</p></>)}
          {project.challenges && (<><h2>Challenges</h2><p>{project.challenges}</p></>)}
          {project.results && (<><h2>Outcomes</h2><p>{project.results}</p></>)}
          {project.lessons_learned && (<><h2>What I'd do differently</h2><p>{project.lessons_learned}</p></>)}
        </div>

        {project.screenshots && project.screenshots.length > 0 && (
          <div className="pb-24">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">Screens</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.screenshots.map((s, i) => (
                <img key={i} src={s} alt={`${project.name} — ${i + 1}`} loading="lazy" className="w-full rounded-lg border border-[color:var(--color-border)]" />
              ))}
            </div>
          </div>
        )}

        <div className="py-16 border-t border-[color:var(--color-border)]">
          <Link to="/projects" className="serif text-3xl italic hover:text-[color:var(--color-accent)]">
            ← More projects
          </Link>
        </div>
      </div>
    </article>
  );
}
