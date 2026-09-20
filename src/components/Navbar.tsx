import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AfLogo from './AfLogo';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur transition-colors ${scrolled ? 'border-b border-[color:var(--color-border)]' : 'border-b border-transparent'}`}
      style={{ background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <AfLogo className="w-8 h-8 rounded-md" />
          <span className="font-medium tracking-tight hidden sm:inline">Alagbe Fareed Adebayo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'text-[color:var(--color-fg)]'
                    : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/resume"
            className="hidden sm:inline-block text-sm px-3 py-1.5 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] transition-colors"
          >
            Résumé
          </Link>
          <ThemeToggle />
          {user && (
            <Link
              to="/admin"
              className="hidden sm:inline-block text-sm px-3 py-1.5 rounded-md bg-[color:var(--color-fg)] text-[color:var(--color-bg)]"
            >
              Admin
            </Link>
          )}
          <button
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)]"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)]">
          <div className="px-5 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `py-2 text-base ${isActive ? 'text-[color:var(--color-fg)]' : 'text-[color:var(--color-muted)]'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/resume" className="py-2 text-base text-[color:var(--color-muted)]">Résumé</Link>
            {user && <Link to="/admin" className="py-2 text-base text-[color:var(--color-accent)]">Admin</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
