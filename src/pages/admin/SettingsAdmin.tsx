import { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiGet, apiPut } from '../../lib/api';
import type { SiteSettings } from '../../lib/api';
import { useToast } from '../../components/Toast';
import supabase from '../../lib/supabase';

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
    body: JSON.stringify({ fileName: `resume-${Date.now()}-${file.name}`, fileBase64: base64, contentType: file.type }),
  });
  if (!res.ok) throw new Error('Upload failed');
  const { url } = await res.json();
  return url;
}

export default function SettingsAdmin() {
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { apiGet<SiteSettings>('/api/settings').then((s) => { setForm(s); setLoading(false); }); }, []);

  const update = (patch: Partial<SiteSettings>) => setForm((f) => ({ ...f, ...patch }));
  const updateSocial = (k: string, v: string) => setForm((f) => ({ ...f, social_links: { ...(f.social_links || {}), [k]: v } }));

  const save = async () => {
    await apiPut('/api/settings', form);
    toast.push('Settings saved.', 'success');
  };

  const onResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadFile(f);
      update({ resume_url: url });
      await apiPut('/api/settings', { ...form, resume_url: url });
      toast.push('Résumé uploaded.', 'success');
    } catch (err: any) {
      toast.push(err.message, 'error');
    }
  };

  if (loading) return <AdminLayout title="Settings"><div className="text-[color:var(--color-muted)]">Loading…</div></AdminLayout>;

  return (
    <AdminLayout title="Site settings" action={
      <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm">
        <Save size={14} /> Save changes
      </button>
    }>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Identity">
          <Field label="Name"><input value={form.name || ''} onChange={(e) => update({ name: e.target.value })} className={inputClass} /></Field>
          <Field label="Title"><input value={form.title || ''} onChange={(e) => update({ title: e.target.value })} className={inputClass} /></Field>
          <Field label="Email"><input value={form.email || ''} onChange={(e) => update({ email: e.target.value })} className={inputClass + ' mono text-sm'} /></Field>
          <Field label="Location"><input value={form.location || ''} onChange={(e) => update({ location: e.target.value })} className={inputClass} /></Field>
        </Card>

        <Card title="Availability">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.available_for_work} onChange={(e) => update({ available_for_work: e.target.checked })} /> Available for work</label>
          <Field label="Availability line (shown in hero)">
            <input value={form.availability || ''} onChange={(e) => update({ availability: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Currently building">
            <textarea rows={2} value={form.currently_building || ''} onChange={(e) => update({ currently_building: e.target.value })} className={inputClass} />
          </Field>
        </Card>

        <Card title="About">
          <Field label="Bio"><textarea rows={4} value={form.bio || ''} onChange={(e) => update({ bio: e.target.value })} className={inputClass} /></Field>
          <Field label="Philosophy"><textarea rows={4} value={form.philosophy || ''} onChange={(e) => update({ philosophy: e.target.value })} className={inputClass} /></Field>
          <Field label="Current focus"><textarea rows={3} value={form.current_focus || ''} onChange={(e) => update({ current_focus: e.target.value })} className={inputClass} /></Field>
        </Card>

        <Card title="Social links">
          <Field label="GitHub URL"><input value={form.social_links?.github || ''} onChange={(e) => updateSocial('github', e.target.value)} className={inputClass + ' mono text-sm'} /></Field>
          <Field label="LinkedIn URL"><input value={form.social_links?.linkedin || ''} onChange={(e) => updateSocial('linkedin', e.target.value)} className={inputClass + ' mono text-sm'} /></Field>
          <Field label="Twitter / X URL"><input value={form.social_links?.twitter || ''} onChange={(e) => updateSocial('twitter', e.target.value)} className={inputClass + ' mono text-sm'} /></Field>
        </Card>

        <Card title="Résumé">
          <div className="text-sm text-[color:var(--color-muted)]">
            {form.resume_url ? <>Current: <a href={form.resume_url} target="_blank" rel="noreferrer" className="link-underline mono text-xs">view PDF</a></> : 'No résumé uploaded.'}
          </div>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[color:var(--color-border-strong)] rounded-md p-6 cursor-pointer hover:bg-[color:var(--color-surface-2)]">
            <Upload size={18} />
            <span className="text-xs text-[color:var(--color-muted)]">Upload new résumé (PDF)</span>
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={onResume} />
          </label>
        </Card>
      </div>
    </AdminLayout>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] focus:outline-none focus:border-[color:var(--color-accent)]';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[color:var(--color-border)] rounded-lg p-5 bg-[color:var(--color-surface)] space-y-4">
      <h2 className="serif text-xl">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1.5">{label}</div>{children}</label>;
}
