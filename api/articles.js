import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, all, limit } = req.query;
      if (slug) {
        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).eq('published', true).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(data);
      }
      let q = supabase.from('articles').select('*').order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      if (all === 'true') {
        const user = await requireUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
      } else {
        q = q.eq('published', true);
      }
      if (limit) q = q.limit(Number(limit));
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const body = clean(req.body);
      if (body.published && !body.published_at) body.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('articles').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      const clean_ = clean(patch);
      if (clean_.published && !clean_.published_at) clean_.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('articles').update(clean_).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function clean(o) {
  const { id, created_at, ...rest } = o;
  if ('tags' in rest) rest.tags = Array.isArray(rest.tags) ? rest.tags : [];
  if (rest.cover_image === '') rest.cover_image = null;
  return rest;
}
