import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminEmails } from '../lib/admin';

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
