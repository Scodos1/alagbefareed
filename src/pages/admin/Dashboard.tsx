import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Upload, Mail } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { apiGet } from '../../lib/api';
import type { ContactMessage, Project } from '../../lib/api';

type Stats = {
  projects: number;
  published_projects: number;
  draft_projects: number;
  articles: number;
  published_articles: number;
  experience: number;
  skills: number;
  technologies: number;
  messages: number;
  unread_messages: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    Promise.all([
      apiGet<Stats>('/api/stats'),
      apiGet<Project[]>('/api/projects?all=true'),
      apiGet<ContactMessage[]>('/api/contact'),
    ]).then(([s, p, m]) => {
      setStats(s);
      setRecentProjects(p.slice(0, 4));
      setRecentMessages(m.slice(0, 3));
    });
  }, []);

  return (
    <AdminLayout title="Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={stats?.projects ?? '—'} sub={`${stats?.published_projects ?? 0} published · ${stats?.draft_projects ?? 0} draft`} />
        <StatCard label="Technologies" value={stats?.technologies ?? '—'} sub={`${stats?.skills ?? 0} skills tracked`} />
        <StatCard label="Experience" value={stats?.experience ?? '—'} sub="roles tracked" />
        <StatCard label="Messages" value={stats?.messages ?? '—'} sub={`${stats?.unread_messages ?? 0} unread`} accent={(stats?.unread_messages ?? 0) > 0} />
      </div>

      <section className="mt-10">
        <h2 className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-3">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction to="/admin/projects/new" icon={PlusCircle} label="Add project" />
          <QuickAction to="/admin/messages" icon={Mail} label="Check messages" />
          <QuickAction to="/admin/experience" icon={Briefcase} label="Add experience" />
          <QuickAction to="/admin/settings" icon={Upload} label="Upload résumé" />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)]">Recent projects</h2>
            <Link to="/admin/projects" className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">Manage →</Link>
          </div>
          <div className="divide-y divide-[color:var(--color-border)] border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)]">
            {recentProjects.length === 0 ? (
              <div className="p-8 text-center text-sm text-[color:var(--color-muted)]">No projects yet.</div>
            ) : recentProjects.map((p) => (
              <Link key={p.id} to={`/admin/projects/${p.id}/edit`} className="flex items-center justify-between px-4 py-3 hover:bg-[color:var(--color-surface-2)]">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">{p.category}</div>
                </div>
                <span className={`mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${p.published ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]' : 'bg-[color:var(--color-surface-2)] text-[color:var(--color-muted)]'}`}>
                  {p.published ? 'Live' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)]">Latest messages</h2>
            <Link to="/admin/messages" className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">Inbox →</Link>
          </div>
          <div className="divide-y divide-[color:var(--color-border)] border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)]">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-sm text-[color:var(--color-muted)]"><Mail size={16} className="inline mr-2" /> No messages.</div>
            ) : recentMessages.map((m) => (
              <Link key={m.id} to="/admin/messages" className="block px-4 py-3 hover:bg-[color:var(--color-surface-2)]">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{m.subject}</div>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />}
                </div>
                <div className="text-xs text-[color:var(--color-muted)] truncate">{m.name} · {m.email}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: any; sub?: string; accent?: boolean }) {
  return (
    <div className={`border rounded-lg p-5 bg-[color:var(--color-surface)] ${accent ? 'border-[color:var(--color-accent)]' : 'border-[color:var(--color-border)]'}`}>
      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">{label}</div>
      <div className="serif text-4xl mt-2">{value}</div>
      {sub && <div className="text-xs text-[color:var(--color-muted)] mt-1">{sub}</div>}
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] rounded-lg p-4 bg-[color:var(--color-surface)] transition-colors"
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
