import supabase from './db-client.js';
import { requireAdmin, setCors, serverError, validId } from './_auth.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, featured, all } = req.query;

      if (slug) {
        if (typeof slug !== 'string' || slug.length > 120) return res.status(400).json({ error: 'Invalid input.' });
        const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(data);
      }

      let q = supabase.from('projects').select('*').order('featured', { ascending: false }).order('project_date', { ascending: false });
      if (all === 'true') {
        const admin = await requireAdmin(req);
        if (!admin) return res.status(401).json({ error: 'Unauthorized' });
      } else {
        q = q.eq('published', true);
      }
      if (featured === 'true') q = q.eq('featured', true);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const body = normalizeProject(req.body);
      if (!body.name || !body.slug) return res.status(400).json({ error: 'Name and slug are required.' });
      const { data, error } = await supabase.from('projects').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { data, error } = await supabase.from('projects').update(normalizeProject(patch, true)).eq('id', rowId).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { error } = await supabase.from('projects').delete().eq('id', rowId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'projects api error');
  }
}

const URL_FIELDS = ['image_url', 'github_url', 'live_url'];

function sanitizeUrl(v) {
  if (v == null || v === '') return null;
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, 2000);
  // Only http(s) or site-relative paths — blocks javascript:/data: XSS vectors.
  if (/^(https?:\/\/|\/)/i.test(s)) return s;
  return null;
}

function normalizeProject(p, isPatch = false) {
  const out = { ...(p || {}) };
  // Ensure arrays
  if ('technologies' in out) out.technologies = Array.isArray(out.technologies) ? out.technologies.map(String).slice(0, 30) : [];
  if ('features' in out) out.features = Array.isArray(out.features) ? out.features.map(String).slice(0, 50) : [];
  if ('screenshots' in out) out.screenshots = Array.isArray(out.screenshots) ? out.screenshots.filter((s) => typeof s === 'string' && /^https?:\/\//i.test(s)).slice(0, 20) : [];
  // Clean empties
  if (!isPatch) {
    out.technologies = out.technologies || [];
    out.features = out.features || [];
    out.screenshots = out.screenshots || [];
  }
  for (const f of URL_FIELDS) {
    if (f in out) out[f] = sanitizeUrl(out[f]);
  }
  // Clamp long text fields
  for (const f of ['name', 'slug', 'tagline', 'category']) {
    if (typeof out[f] === 'string') out[f] = out[f].slice(0, 200);
  }
  for (const f of ['description', 'problem', 'solution', 'architecture', 'challenges', 'results', 'lessons_learned']) {
    if (typeof out[f] === 'string') out[f] = out[f].slice(0, 20000);
  }
  // strip id if present in patch
  delete out.id;
  delete out.created_at;
  return out;
}
