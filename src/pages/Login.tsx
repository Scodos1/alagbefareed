import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';
import AfLogo from '../components/AfLogo';
import { signInWithGoogle } from '../lib/googleAuth';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/admin';
  const toast = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.push(error.message, 'error'); return; }
    navigate(from);
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] flex flex-col">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
          <ArrowLeft size={14} /> Back to site
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <AfLogo className="w-10 h-10 rounded-lg" />
            <h1 className="serif text-4xl mt-4">Sign in</h1>
            <p className="text-sm text-[color:var(--color-muted)] mt-2">Access the portfolio CMS.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-accent)]"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-accent)]"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm font-medium disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[color:var(--color-border)]" />
            <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">or</span>
            <div className="flex-1 h-px bg-[color:var(--color-border)]" />
          </div>

          <button
            onClick={() => signInWithGoogle('Alagbe Fareed Adebayo Portfolio CMS')}
            className="w-full py-2.5 rounded-md border border-[color:var(--color-border-strong)] text-sm inline-flex items-center justify-center gap-2 hover:bg-[color:var(--color-surface-2)]"
          >
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <p className="mt-8 text-xs text-center text-[color:var(--color-subtle)]">
            Demo: <span className="mono">demo@alexrivera.dev</span> / <span className="mono">portfolio2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
