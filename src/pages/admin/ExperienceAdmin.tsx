import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';
import type { Experience } from '../../lib/api';
import { useToast } from '../../components/Toast';

const emptyExp: Partial<Experience> = {
  company: '', role: '', location: '', start_date: new Date().toISOString().split('T')[0],
  end_date: null, current: false, description: '', responsibilities: [], technologies: [], display_order: 100,
};

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [draft, setDraft] = useState<Partial<Experience>>(emptyExp);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({});
  const toast = useToast();

  const load = () => apiGet<Experience[]>('/api/experience').then(setItems);
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.company || !draft.role) return;
    await apiPost('/api/experience', draft);
    setDraft(emptyExp);
    load();
    toast.push('Experience added.', 'success');
  };

  const startEdit = (e: Experience) => { setEditing(e.id); setForm(e); };
  const cancel = () => { setEditing(null); setForm({}); };
  const save = async () => {
    await apiPut('/api/experience', form);
    setEditing(null); load();
    toast.push('Saved.', 'success');
  };
  const remove = async (e: Experience) => { if (!confirm(`Delete ${e.role} @ ${e.company}?`)) return; await apiDelete('/api/experience', { id: e.id }); load(); };

  return (
    <AdminLayout title="Experience">
      <details className="border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] mb-6">
        <summary className="cursor-pointer px-5 py-3 font-medium flex items-center gap-2"><Plus size={14} /> Add experience</summary>
        <div className="px-5 pb-5 space-y-3 border-t border-[color:var(--color-border)] pt-4">
          <ExpFields form={draft} setForm={setDraft} />
          <button onClick={add} className="px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm">Add entry</button>
        </div>
      </details>

      <div className="space-y-3">
        {items.map((e) => (
          <div key={e.id} className="border border-[color:var(--color-border)] rounded-lg p-5 bg-[color:var(--color-surface)]">
            {editing === e.id ? (
              <div className="space-y-3">
                <ExpFields form={form} setForm={setForm} />
                <div className="flex gap-2">
                  <button onClick={save} className="px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm inline-flex items-center gap-2"><Save size={14} /> Save</button>
                  <button onClick={cancel} className="px-4 py-2 rounded-md border border-[color:var(--color-border)] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="serif text-2xl">{e.role}</div>
                  <div className="text-sm text-[color:var(--color-muted)]">{e.company} · {e.start_date?.slice(0, 7)} – {e.current ? 'present' : e.end_date?.slice(0, 7) || ''}</div>
                  <p className="mt-2 text-sm">{e.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(e)} className="px-3 py-1.5 text-xs rounded border border-[color:var(--color-border)]">Edit</button>
                  <button onClick={() => remove(e)} className="w-8 h-8 rounded inline-flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function ExpFields({ form, setForm }: { form: Partial<Experience>; setForm: (f: any) => void }) {
  const set = (patch: any) => setForm({ ...form, ...patch });
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <FieldLabel label="Role"><input value={form.role || ''} onChange={(e) => set({ role: e.target.value })} className={inputClass} /></FieldLabel>
        <FieldLabel label="Company"><input value={form.company || ''} onChange={(e) => set({ company: e.target.value })} className={inputClass} /></FieldLabel>
        <FieldLabel label="Location"><input value={form.location || ''} onChange={(e) => set({ location: e.target.value })} className={inputClass} /></FieldLabel>
        <FieldLabel label="Order"><input type="number" value={form.display_order || 100} onChange={(e) => set({ display_order: Number(e.target.value) })} className={inputClass} /></FieldLabel>
        <FieldLabel label="Start date"><input type="date" value={form.start_date?.split('T')[0] || ''} onChange={(e) => set({ start_date: e.target.value })} className={inputClass + ' mono text-sm'} /></FieldLabel>
        <FieldLabel label="End date">
          <div className="flex items-center gap-2">
            <input type="date" value={form.end_date?.split('T')[0] || ''} disabled={form.current} onChange={(e) => set({ end_date: e.target.value })} className={inputClass + ' mono text-sm'} />
            <label className="text-xs flex items-center gap-1 text-[color:var(--color-muted)]"><input type="checkbox" checked={!!form.current} onChange={(e) => set({ current: e.target.checked, end_date: e.target.checked ? null : form.end_date })} /> current</label>
          </div>
        </FieldLabel>
      </div>
      <FieldLabel label="Description"><textarea rows={3} value={form.description || ''} onChange={(e) => set({ description: e.target.value })} className={inputClass} /></FieldLabel>
      <FieldLabel label="Responsibilities (one per line)">
        <textarea rows={4} value={(form.responsibilities || []).join('\n')} onChange={(e) => set({ responsibilities: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} className={inputClass} />
      </FieldLabel>
      <FieldLabel label="Technologies (comma separated)">
        <input value={(form.technologies || []).join(', ')} onChange={(e) => set({ technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className={inputClass + ' mono text-sm'} />
      </FieldLabel>
    </>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">{label}</div>{children}</label>;
}

const inputClass = 'w-full px-2.5 py-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-sm focus:outline-none focus:border-[color:var(--color-accent)]';
