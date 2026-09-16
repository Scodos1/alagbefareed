import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';
import AfLogo from '../components/AfLogo';
import { renderGoogleButton } from '../lib/googleAuth';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Only allow internal redirect targets — never an external URL.
  const rawFrom = (location.state as any)?.from;
  const from = typeof rawFrom === 'string' && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/admin';
  const { user } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  useEffect(() => {
    if (googleBtnRef.current) {
      renderGoogleButton(googleBtnRef.current);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return;
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

          <div ref={googleBtnRef} className="w-full flex justify-center mb-4" />

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[color:var(--color-border)]" />
            <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">or</span>
            <div className="flex-1 h-px bg-[color:var(--color-border)]" />
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
        </div>
      </div>
    </div>
  );
}
