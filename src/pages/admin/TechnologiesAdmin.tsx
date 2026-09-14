import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';
import type { Technology } from '../../lib/api';
import { useToast } from '../../components/Toast';

export default function TechnologiesAdmin() {
  const [items, setItems] = useState<Technology[]>([]);
  const [draft, setDraft] = useState<Partial<Technology>>({ name: '', category: 'Frontend', skill_level: 4, display_order: 100 });
  const toast = useToast();

  const load = () => apiGet<Technology[]>('/api/technologies').then(setItems);
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name) return;
    await apiPost('/api/technologies', draft);
    setDraft({ name: '', category: 'Frontend', skill_level: 4, display_order: 100 });
    load();
    toast.push('Technology added.', 'success');
  };

  const update = async (t: Technology, patch: Partial<Technology>) => {
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...patch } : x)));
  };
  const persist = async (t: Technology) => {
    await apiPut('/api/technologies', t);
    toast.push('Saved.', 'success');
  };

  const remove = async (t: Technology) => {
    if (!confirm(`Remove ${t.name}?`)) return;
    await apiDelete('/api/technologies', { id: t.id });
    load();
  };

  return (
    <AdminLayout title="Technologies">
      <div className="border border-[color:var(--color-border)] rounded-lg p-4 bg-[color:var(--color-surface)] mb-6 grid sm:grid-cols-[1fr_1fr_100px_100px_auto] gap-3 items-end">
        <label className="block">
          <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Name</div>
          <input value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Category</div>
          <input value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Level 1-5</div>
          <input type="number" min={1} max={5} value={draft.skill_level || 4} onChange={(e) => setDraft({ ...draft, skill_level: Number(e.target.value) })} className={inputClass} />
        </label>
        <label className="block">
          <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Order</div>
          <input type="number" value={draft.display_order || 100} onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })} className={inputClass} />
        </label>
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm">
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="border border-[color:var(--color-border)] rounded-lg overflow-hidden bg-[color:var(--color-surface)]">
        {items.map((t, i) => (
          <div key={t.id} className={`grid grid-cols-[1fr_1fr_100px_100px_auto_auto] gap-3 items-center p-3 ${i > 0 ? 'border-t border-[color:var(--color-border)]' : ''}`}>
            <input value={t.name} onChange={(e) => update(t, { name: e.target.value })} className={inputClass} />
            <input value={t.category} onChange={(e) => update(t, { category: e.target.value })} className={inputClass} />
            <input type="number" min={1} max={5} value={t.skill_level} onChange={(e) => update(t, { skill_level: Number(e.target.value) })} className={inputClass} />
            <input type="number" value={t.display_order} onChange={(e) => update(t, { display_order: Number(e.target.value) })} className={inputClass} />
            <button onClick={() => persist(t)} className="w-8 h-8 rounded-md inline-flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"><Save size={14} /></button>
            <button onClick={() => remove(t)} className="w-8 h-8 rounded-md inline-flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

const inputClass = 'w-full px-2.5 py-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-sm focus:outline-none focus:border-[color:var(--color-accent)]';
