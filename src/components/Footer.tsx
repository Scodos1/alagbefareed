import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import type { SiteSettings } from '../lib/api';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    apiGet<SiteSettings>('/api/settings').then(setSettings).catch(() => {});
  }, []);

  const social = settings?.social_links || {};

  return (
    <footer className="border-t border-[color:var(--color-border)] mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <p className="serif text-2xl leading-tight max-w-sm">
              {settings?.bio?.split('.')[0] || 'Full-Stack Developer building modern, scalable web applications.'}
            </p>
            <p className="mono text-xs uppercase tracking-widest text-[color:var(--color-muted)] mt-4">
              {settings?.location || 'Ikorodu, Lagos, Nigeria'} — {settings?.available_for_work ? 'Open to work' : 'Currently engaged'}
            </p>
          </div>
          <div>
            <h4 className="mono text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-[color:var(--color-accent)]">Projects</Link></li>
              <li><Link to="/experience" className="hover:text-[color:var(--color-accent)]">Experience</Link></li>
              <li><Link to="/contact" className="hover:text-[color:var(--color-accent)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-3">Elsewhere</h4>
            <ul className="space-y-2 text-sm">
              {social.github && <li><a href={social.github} target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-accent)]">GitHub</a></li>}
              {social.linkedin && <li><a href={social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-accent)]">LinkedIn</a></li>}
              {social.twitter && <li><a href={social.twitter} target="_blank" rel="noreferrer" className="hover:text-[color:var(--color-accent)]">Twitter / X</a></li>}
              {settings?.email && <li><a href={`mailto:${settings.email}`} className="hover:text-[color:var(--color-accent)]">Email</a></li>}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[color:var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="mono text-xs text-[color:var(--color-subtle)]">
            © {year} — Built with React, TypeScript, Postgres. Content served over REST from a live database.
          </p>
        </div>
      </div>
    </footer>
  );
}
