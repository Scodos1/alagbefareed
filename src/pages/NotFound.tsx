import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-32 text-center">
      <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-4">404</div>
      <h1 className="serif text-6xl italic">Not here.</h1>
      <p className="mt-6 text-[color:var(--color-muted)]">The page you were looking for either moved or never existed.</p>
      <Link to="/" className="inline-block mt-8 link-underline">Take me home</Link>
    </div>
  );
}
