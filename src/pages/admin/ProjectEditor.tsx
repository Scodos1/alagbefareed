import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload as UploadIcon, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiGet, apiPost, apiPut } from '../../lib/api';
import type { Project } from '../../lib/api';
import { useToast } from '../../components/Toast';
import supabase from '../../lib/supabase';

const empty: Partial<Project> = {
  slug: '', name: '', tagline: '', description: '', category: 'Web app',
  technologies: [], image_url: null, screenshots: [],
  problem: '', solution: '', features: [], architecture: '',
  challenges: '', results: '', lessons_learned: '',
  github_url: '', live_url: '', project_date: new Date().toISOString().split('T')[0],
  featured: false, published: false,
};

async function uploadFile(file: File): Promise<string> {
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify({ fileName: `${Date.now()}-${file.name}`, fileBase64: base64, contentType: file.type }),
  });
  if (!res.ok) throw new Error('Upload failed');
  const { url } = await res.json();
  return url;
}

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<Partial<Project>>(empty);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGet<Project[]>('/api/projects?all=true').then((list) => {
      const p = list.find((x) => x.id === Number(id));
      if (p) setForm(p);
      setLoading(false);
    });
  }, [id]);

  const update = <K extends keyof Project>(k: K, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (publish?: boolean) => {
    if (!form.name?.trim() || !form.slug?.trim()) {
      toast.push('Name and slug are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, published: publish ?? form.published };
      if (id) await apiPut('/api/projects', { ...payload, id: Number(id) });
      else await apiPost('/api/projects', payload);
      toast.push('Saved.', 'success');
      navigate('/admin/projects');
    } catch (e: any) {
      toast.push(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'main' | 'screenshot') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        urls.push(await uploadFile(f));
      }
      if (kind === 'main') update('image_url', urls[0]);
      else update('screenshots', [...(form.screenshots || []), ...urls]);
      toast.push('Uploaded.', 'success');
    } catch (err: any) {
      toast.push(err.message, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeScreenshot = (url: string) => update('screenshots', (form.screenshots || []).filter((s) => s !== url));

  if (loading) return <AdminLayout title="Editing…"><div className="text-[color:var(--color-muted)]">Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
          <ArrowLeft size={14} /> All projects
        </Link>
      </div>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <h1 className="serif text-4xl tracking-tight">{id ? 'Edit project' : 'New project'}</h1>
        <div className="flex gap-2">
          <button onClick={() => save(false)} disabled={saving} className="px-4 py-2 rounded-md border border-[color:var(--color-border-strong)] text-sm disabled:opacity-60">Save draft</button>
          <button onClick={() => save(true)} disabled={saving} className="px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm disabled:opacity-60">{saving ? 'Saving…' : 'Save & publish'}</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Field label="Project name">
            <input value={form.name || ''} onChange={(e) => update('name', e.target.value)} className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Slug (URL)">
              <input value={form.slug || ''} onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))} className={inputClass + ' mono text-sm'} placeholder="my-project" />
            </Field>
            <Field label="Category">
              <input value={form.category || ''} onChange={(e) => update('category', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Tagline (one line)">
            <input value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Short description">
            <textarea rows={3} value={form.description || ''} onChange={(e) => update('description', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Technologies (comma separated)">
            <input
              value={(form.technologies || []).join(', ')}
              onChange={(e) => update('technologies', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              className={inputClass + ' mono text-sm'}
              placeholder="React, TypeScript, Postgres"
            />
          </Field>

          <Section title="Case study">
            <Field label="The problem"><textarea rows={3} value={form.problem || ''} onChange={(e) => update('problem', e.target.value)} className={inputClass} /></Field>
            <Field label="The solution / approach"><textarea rows={3} value={form.solution || ''} onChange={(e) => update('solution', e.target.value)} className={inputClass} /></Field>
            <Field label="Features (one per line)">
              <textarea
                rows={4}
                value={(form.features || []).join('\n')}
                onChange={(e) => update('features', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                className={inputClass}
              />
            </Field>
            <Field label="Architecture"><textarea rows={3} value={form.architecture || ''} onChange={(e) => update('architecture', e.target.value)} className={inputClass} /></Field>
            <Field label="Challenges"><textarea rows={3} value={form.challenges || ''} onChange={(e) => update('challenges', e.target.value)} className={inputClass} /></Field>
            <Field label="Outcomes / results"><textarea rows={3} value={form.results || ''} onChange={(e) => update('results', e.target.value)} className={inputClass} /></Field>
            <Field label="Lessons learned"><textarea rows={3} value={form.lessons_learned || ''} onChange={(e) => update('lessons_learned', e.target.value)} className={inputClass} /></Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Status">
            <Field label="Project status">
              <select value={form.status || 'completed'} onChange={(e) => update('status', e.target.value)} className={inputClass}>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.published} onChange={(e) => update('published', e.target.checked)} />
              Published (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => update('featured', e.target.checked)} />
              Featured on homepage
            </label>
            <Field label="Project date">
              <input type="date" value={form.project_date?.split('T')[0] || ''} onChange={(e) => update('project_date', e.target.value)} className={inputClass + ' mono text-sm'} />
            </Field>
          </Section>

          <Section title="Links">
            <Field label="GitHub URL"><input value={form.github_url || ''} onChange={(e) => update('github_url', e.target.value)} className={inputClass + ' mono text-sm'} placeholder="https://github.com/..." /></Field>
            <Field label="Live URL"><input value={form.live_url || ''} onChange={(e) => update('live_url', e.target.value)} className={inputClass + ' mono text-sm'} placeholder="https://" /></Field>
          </Section>

          <Section title="Main image">
            {form.image_url ? (
              <div className="relative rounded-md overflow-hidden border border-[color:var(--color-border)]">
                <img src={form.image_url} alt="" className="w-full aspect-[16/10] object-cover" />
                <button onClick={() => update('image_url', null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[color:var(--color-border-strong)] rounded-md p-6 cursor-pointer hover:bg-[color:var(--color-surface-2)]">
                <UploadIcon size={18} />
                <span className="text-xs text-[color:var(--color-muted)]">{uploading ? 'Uploading…' : 'Choose image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onImageUpload(e, 'main')} />
              </label>
            )}
          </Section>

          <Section title="Screenshots">
            <div className="grid grid-cols-2 gap-2">
              {(form.screenshots || []).map((s) => (
                <div key={s} className="relative rounded overflow-hidden border border-[color:var(--color-border)]">
                  <img src={s} alt="" className="w-full aspect-square object-cover" />
                  <button onClick={() => removeScreenshot(s)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"><X size={12} /></button>
                </div>
              ))}
            </div>
            <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[color:var(--color-border-strong)] rounded-md p-4 cursor-pointer hover:bg-[color:var(--color-surface-2)]">
              <UploadIcon size={16} />
              <span className="text-xs text-[color:var(--color-muted)]">Add screenshots</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onImageUpload(e, 'screenshot')} />
            </label>
          </Section>
        </div>
      </div>
    </AdminLayout>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-accent)] transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[color:var(--color-border)] rounded-lg p-5 bg-[color:var(--color-surface)] space-y-4">
      <h3 className="serif text-xl">{title}</h3>
      {children}
    </section>
  );
}
