import { useEffect, useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';
import type { SiteSettings } from '../lib/api';
import { useToast } from '../components/Toast';
import TypeReveal from '../components/motion/TypeReveal';

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    document.title = 'Contact — Alagbe Fareed Adebayo';
    apiGet<SiteSettings>('/api/settings').then(setSettings);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please share your name.';
    if (!form.email.trim()) e.email = 'Your email is needed to reply.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That doesn’t look like a valid email.';
    if (!form.subject.trim()) e.subject = 'What is this about?';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'A little more detail helps.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (form.website) return; // honeypot
    setSubmitting(true);
    try {
      await apiPost('/api/contact', {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setSubmitted(true);
      toast.push('Message sent — thank you.', 'success');
    } catch (err: any) {
      toast.push(err.message || 'Something went wrong.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const social = settings?.social_links || {};

  return (
    <div>
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 fade-in">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-6">Contact</div>
        <h1 className="serif text-5xl sm:text-6xl leading-[1.02] tracking-tight">
          <TypeReveal text="Let's talk about" as="span" /><br />the <TypeReveal text="thing you're building." as="span" className="italic" />
        </h1>
        <p className="mt-6 text-[color:var(--color-muted)] max-w-xl">
          I read every message. Usually reply within a business day. Prefer email? {settings?.email && (<a className="link-underline" href={`mailto:${settings.email}`}>{settings.email}</a>)}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <div className="grid md:grid-cols-[1fr_240px] gap-10">
          {submitted ? (
            <div className="border border-[color:var(--color-border)] rounded-lg p-8 bg-[color:var(--color-surface)]">
              <div className="serif text-3xl leading-tight">Thanks, <span className="italic">{form.name || 'friend'}</span>.</div>
              <p className="mt-3 text-[color:var(--color-muted)]">Your note landed in my inbox. I'll get back to you at <span className="mono text-sm">{form.email}</span>.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '', website: '' }); }}
                className="mt-6 text-sm link-underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="hidden" aria-hidden />

              <Field label="Your name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-[color:var(--color-border-strong)] py-2 focus:outline-none focus:border-[color:var(--color-accent)]"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-transparent border-b border-[color:var(--color-border-strong)] py-2 focus:outline-none focus:border-[color:var(--color-accent)]"
                  autoComplete="email"
                />
              </Field>
              <Field label="Subject" error={errors.subject}>
                <input
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full bg-transparent border-b border-[color:var(--color-border-strong)] py-2 focus:outline-none focus:border-[color:var(--color-accent)]"
                />
              </Field>
              <Field label="Message" error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={6}
                  className="w-full bg-transparent border-b border-[color:var(--color-border-strong)] py-2 focus:outline-none focus:border-[color:var(--color-accent)] resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] text-sm disabled:opacity-60"
              >
                <Send size={14} /> {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}

          <aside className="space-y-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-2">Direct</div>
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 link-underline text-sm">
                  <Mail size={14} /> {settings.email}
                </a>
              )}
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-2">Elsewhere</div>
              <ul className="space-y-1.5 text-sm">
                {social.github && <li><a href={social.github} target="_blank" rel="noreferrer" className="link-underline">GitHub</a></li>}
                {social.linkedin && <li><a href={social.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a></li>}
                {social.twitter && <li><a href={social.twitter} target="_blank" rel="noreferrer" className="link-underline">Twitter / X</a></li>}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)] mb-1">{label}</div>
      {children}
      {error && <div className="text-xs text-[color:var(--color-accent)] mt-1">{error}</div>}
    </label>
  );
}
