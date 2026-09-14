import { useEffect, useState } from 'react';
import { Mail, Trash2, MailOpen } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiDelete, apiGet, apiPut } from '../../lib/api';
import type { ContactMessage } from '../../lib/api';

export default function MessagesAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => apiGet<ContactMessage[]>('/api/contact').then(setItems);
  useEffect(() => { load(); }, []);

  const openMsg = async (m: ContactMessage) => {
    setSelected(m);
    if (!m.read) {
      await apiPut('/api/contact', { id: m.id, read: true });
      load();
    }
  };

  const remove = async (m: ContactMessage) => {
    if (!confirm('Delete this message?')) return;
    await apiDelete('/api/contact', { id: m.id });
    if (selected?.id === m.id) setSelected(null);
    load();
  };

  return (
    <AdminLayout title="Inbox">
      <div className="grid md:grid-cols-[320px_1fr] gap-4">
        <div className="border border-[color:var(--color-border)] rounded-lg overflow-hidden bg-[color:var(--color-surface)] max-h-[70vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-[color:var(--color-muted)]"><Mail size={16} className="inline mr-2" /> No messages yet.</div>
          ) : items.map((m, i) => (
            <button
              key={m.id}
              onClick={() => openMsg(m)}
              className={`w-full text-left p-3 ${i > 0 ? 'border-t border-[color:var(--color-border)]' : ''} ${selected?.id === m.id ? 'bg-[color:var(--color-surface-2)]' : ''} hover:bg-[color:var(--color-surface-2)]`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate text-sm">{m.subject}</div>
                {!m.read && <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)] flex-shrink-0" />}
              </div>
              <div className="text-xs text-[color:var(--color-muted)] truncate">{m.name} · {m.email}</div>
              <div className="mono text-[10px] text-[color:var(--color-subtle)] mt-1">{new Date(m.created_at).toLocaleString()}</div>
            </button>
          ))}
        </div>

        <div className="border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] p-6 min-h-[400px]">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="serif text-3xl">{selected.subject}</h2>
                  <div className="text-sm text-[color:var(--color-muted)] mt-1">from <span className="font-medium text-[color:var(--color-fg)]">{selected.name}</span> · <a href={`mailto:${selected.email}`} className="link-underline">{selected.email}</a></div>
                  <div className="mono text-[10px] text-[color:var(--color-subtle)] mt-1">{new Date(selected.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="px-3 py-1.5 text-xs border border-[color:var(--color-border-strong)] rounded inline-flex items-center gap-1"><MailOpen size={12} /> Reply</a>
                  <button onClick={() => remove(selected)} className="px-3 py-1.5 text-xs border border-[color:var(--color-border)] rounded inline-flex items-center gap-1 text-[color:var(--color-accent)]"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
              <div className="prose-editorial whitespace-pre-wrap border-t border-[color:var(--color-border)] pt-4">
                {selected.message}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[color:var(--color-muted)] text-sm">Select a message to read.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
