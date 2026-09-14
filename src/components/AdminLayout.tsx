import { NavLink, Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Cpu, Sparkles, Briefcase, Mail, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import AfLogo from './AfLogo';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/technologies', label: 'Technologies', icon: Cpu },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Site settings', icon: Settings },
];

export default function AdminLayout({ children, title, action }: { children: ReactNode; title?: string; action?: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--color-bg)]">
      <aside className="w-64 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-[color:var(--color-border)]">
          <Link to="/admin" className="flex items-center gap-2">
            <AfLogo className="w-7 h-7 rounded-md" />
            <div>
              <div className="text-sm font-medium">CMS</div>
              <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">Portfolio admin</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[color:var(--color-surface-2)] text-[color:var(--color-fg)]'
                    : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-2)]'
                }`
              }
            >
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-[color:var(--color-border)] space-y-2">
          <Link to="/" className="flex items-center gap-2 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] px-3 py-2">
            <ExternalLink size={14} /> View site
          </Link>
          <div className="flex items-center justify-between px-3">
            <div className="text-xs text-[color:var(--color-muted)] truncate">{user?.email}</div>
            <ThemeToggle compact />
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-md text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-2)]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden border-b border-[color:var(--color-border)] p-4 flex items-center justify-between bg-[color:var(--color-surface)]">
          <Link to="/admin" className="font-medium">CMS</Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button onClick={handleSignOut} className="text-sm px-3 py-1.5 border border-[color:var(--color-border)] rounded-md">Sign out</button>
          </div>
        </div>
        <div className="lg:hidden border-b border-[color:var(--color-border)] px-4 py-2 overflow-x-auto flex gap-2 bg-[color:var(--color-surface)]">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-md text-xs ${isActive ? 'bg-[color:var(--color-fg)] text-[color:var(--color-bg)]' : 'text-[color:var(--color-muted)] border border-[color:var(--color-border)]'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="max-w-5xl mx-auto p-5 sm:p-8">
          {(title || action) && (
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              {title && <h1 className="serif text-4xl tracking-tight">{title}</h1>}
              {action}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
