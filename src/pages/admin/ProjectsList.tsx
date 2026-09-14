import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiDelete, apiGet, apiPut } from '../../lib/api';
import type { Project } from '../../lib/api';
import { useToast } from '../../components/Toast';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    apiGet<Project[]>('/api/projects?all=true').then(setProjects).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (p: Project) => {
    await apiPut('/api/projects', { id: p.id, published: !p.published });
    toast.push(!p.published ? 'Published to portfolio.' : 'Moved to drafts.', 'success');
    load();
  };

  const toggleFeatured = async (p: Project) => {
    await apiPut('/api/projects', { id: p.id, featured: !p.featured });
    load();
  };

  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.name}"? This is permanent.`)) return;
    await apiDelete('/api/projects', { id: p.id });
    toast.push('Project deleted.', 'success');
    load();
  };

  return (
    <AdminLayout
      title="Projects"
      action={
        <Link to="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm">
          <Plus size={14} /> New project
        </Link>
      }
    >
      {loading ? (
        <div className="text-[color:var(--color-muted)]">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[color:var(--color-border)] rounded-lg">
          <p className="text-[color:var(--color-muted)]">No projects yet.</p>
          <Link to="/admin/projects/new" className="inline-block mt-4 link-underline text-sm">Add your first project</Link>
        </div>
      ) : (
        <div className="border border-[color:var(--color-border)] rounded-lg overflow-hidden bg-[color:var(--color-surface)]">
          {projects.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-[color:var(--color-border)]' : ''}`}>
              <div className="w-14 h-14 rounded-md bg-[color:var(--color-surface-2)] flex-shrink-0 overflow-hidden">
                {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/admin/projects/${p.id}/edit`} className="font-medium hover:text-[color:var(--color-accent)]">{p.name}</Link>
                <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{p.category} · {p.technologies.slice(0, 3).join(', ')}</div>
              </div>
              <button
                onClick={() => toggleFeatured(p)}
                title={p.featured ? 'Unfeature' : 'Feature on home'}
                className={`w-8 h-8 rounded-md inline-flex items-center justify-center ${p.featured ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--color-subtle)] hover:text-[color:var(--color-fg)]'}`}
              >
                <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => togglePublish(p)}
                className={`mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded ${p.published ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]' : 'bg-[color:var(--color-surface-2)] text-[color:var(--color-muted)]'}`}
              >
                {p.published ? 'Live' : 'Draft'}
              </button>
              <button onClick={() => remove(p)} className="w-8 h-8 rounded-md inline-flex items-center justify-center text-[color:var(--color-subtle)] hover:text-[color:var(--color-accent)]">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
