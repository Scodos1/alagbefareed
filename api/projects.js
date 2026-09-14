import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, featured, all } = req.query;

      if (slug) {
        const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(data);
      }

      let q = supabase.from('projects').select('*').order('featured', { ascending: false }).order('project_date', { ascending: false });
      if (all === 'true') {
        const user = await requireUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
      } else {
        q = q.eq('published', true);
      }
      if (featured === 'true') q = q.eq('featured', true);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const body = normalizeProject(req.body);
      const { data, error } = await supabase.from('projects').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      const { data, error } = await supabase.from('projects').update(normalizeProject(patch, true)).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('projects api error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function normalizeProject(p, isPatch = false) {
  const out = { ...p };
  // Ensure arrays
  if ('technologies' in out) out.technologies = Array.isArray(out.technologies) ? out.technologies : [];
  if ('features' in out) out.features = Array.isArray(out.features) ? out.features : [];
  if ('screenshots' in out) out.screenshots = Array.isArray(out.screenshots) ? out.screenshots : [];
  // Clean empties
  if (!isPatch) {
    out.technologies = out.technologies || [];
    out.features = out.features || [];
    out.screenshots = out.screenshots || [];
  }
  // strip id if present in patch
  delete out.id;
  delete out.created_at;
  return out;
}
