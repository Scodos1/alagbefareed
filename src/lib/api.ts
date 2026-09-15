import supabase from './supabase';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
  return headers;
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(path, { headers: await authHeaders() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(path, { method: 'POST', headers: await authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `POST ${path} failed`);
  }
  return res.json();
}

export async function apiPut<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(path, { method: 'PUT', headers: await authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `PUT ${path} failed`);
  }
  return res.json();
}

export async function apiDelete<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(path, { method: 'DELETE', headers: await authHeaders(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

export type Project = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  image_url: string | null;
  screenshots: string[];
  problem: string;
  solution: string;
  features: string[];
  architecture: string;
  challenges: string;
  results: string;
  lessons_learned: string;
  github_url: string | null;
  live_url: string | null;
  project_date: string;
  featured: boolean;
  published: boolean;
  status: 'completed' | 'in_progress' | 'archived';
  created_at: string;
};

export type Technology = { id: number; name: string; category: string; icon: string | null; skill_level: number; display_order: number };
export type Skill = { id: number; name: string; category: string; display_order: number };
export type Experience = { id: number; company: string; role: string; location: string | null; start_date: string; end_date: string | null; current: boolean; description: string; responsibilities: string[]; technologies: string[]; display_order: number };
export type Article = { id: number; title: string; slug: string; excerpt: string; cover_image: string | null; content: string; tags: string[]; published: boolean; published_at: string | null; created_at: string };
export type ContactMessage = { id: number; name: string; email: string; subject: string; message: string; read: boolean; created_at: string };
export type SiteSettings = { id: number; name: string; title: string; email: string; location: string; bio: string; philosophy: string; current_focus: string; currently_building: string; availability: string; available_for_work: boolean; social_links: Record<string, string>; resume_url: string | null };
