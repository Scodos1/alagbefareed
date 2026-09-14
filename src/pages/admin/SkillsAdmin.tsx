import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';
import type { Skill } from '../../lib/api';
import { useToast } from '../../components/Toast';

export default function SkillsAdmin() {
  const [items, setItems] = useState<Skill[]>([]);
  const [draft, setDraft] = useState<Partial<Skill>>({ name: '', category: 'Engineering', display_order: 100 });
  const toast = useToast();

  const load = () => apiGet<Skill[]>('/api/skills').then(setItems);
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name) return;
    await apiPost('/api/skills', draft);
    setDraft({ name: '', category: 'Engineering', display_order: 100 });
    load();
    toast.push('Added.', 'success');
  };

  const update = (s: Skill, patch: Partial<Skill>) => setItems((p) => p.map((x) => x.id === s.id ? { ...x, ...patch } : x));
  const persist = async (s: Skill) => { await apiPut('/api/skills', s); toast.push('Saved.', 'success'); };
  const remove = async (s: Skill) => { if (!confirm(`Remove ${s.name}?`)) return; await apiDelete('/api/skills', { id: s.id }); load(); };

  return (
    <AdminLayout title="Skills">
      <div className="border border-[color:var(--color-border)] rounded-lg p-4 bg-[color:var(--color-surface)] mb-6 grid sm:grid-cols-[1fr_1fr_100px_auto] gap-3 items-end">
        <label><div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Skill</div><input value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} /></label>
        <label><div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Category</div><input value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputClass} /></label>
        <label><div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Order</div><input type="number" value={draft.display_order || 100} onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })} className={inputClass} /></label>
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm"><Plus size={14} /> Add</button>
      </div>

      <div className="border border-[color:var(--color-border)] rounded-lg overflow-hidden bg-[color:var(--color-surface)]">
        {items.map((s, i) => (
          <div key={s.id} className={`grid grid-cols-[1fr_1fr_100px_auto_auto] gap-3 items-center p-3 ${i > 0 ? 'border-t border-[color:var(--color-border)]' : ''}`}>
            <input value={s.name} onChange={(e) => update(s, { name: e.target.value })} className={inputClass} />
            <input value={s.category} onChange={(e) => update(s, { category: e.target.value })} className={inputClass} />
            <input type="number" value={s.display_order} onChange={(e) => update(s, { display_order: Number(e.target.value) })} className={inputClass} />
            <button onClick={() => persist(s)} className="w-8 h-8 rounded-md inline-flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"><Save size={14} /></button>
            <button onClick={() => remove(s)} className="w-8 h-8 rounded-md inline-flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

const inputClass = 'w-full px-2.5 py-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-sm focus:outline-none focus:border-[color:var(--color-accent)]';
