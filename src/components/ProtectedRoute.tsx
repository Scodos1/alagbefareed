import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Only the site owner's email(s) may enter /admin — matching the backend
// ADMIN_EMAILS allowlist. Set VITE_ADMIN_EMAILS in Vercel (comma-separated).
// Falls back to the owner address so a missing env var can't lock you out.
const FALLBACK_OWNER_EMAIL = 'alagbefareed@gmail.com';

function adminEmails(): string[] {
  const raw = (import.meta as any).env?.VITE_ADMIN_EMAILS || FALLBACK_OWNER_EMAIL;
  return String(raw)
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--color-muted)] mono text-sm">authenticating…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!adminEmails().includes((user.email || '').toLowerCase())) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <h1 className="serif text-3xl">Access denied</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-3">
            {user.email} is signed in, but it is not an admin account for this site.
          </p>
          <button
            onClick={() => signOut()}
            className="mt-6 px-4 py-2 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
