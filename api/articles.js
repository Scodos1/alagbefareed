import supabase from './db-client.js';
import { requireAdmin, setCors, serverError, validId } from './_auth.js';

const MAX_LIMIT = 50;

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, all, limit } = req.query;
      if (slug) {
        if (typeof slug !== 'string' || slug.length > 120) return res.status(400).json({ error: 'Invalid input.' });
        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).eq('published', true).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(data);
      }
      let q = supabase.from('articles').select('*').order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      if (all === 'true') {
        const admin = await requireAdmin(req);
        if (!admin) return res.status(401).json({ error: 'Unauthorized' });
      } else {
        q = q.eq('published', true);
      }
      if (limit) {
        const n = Math.min(Math.max(Number(limit) || 10, 1), MAX_LIMIT);
        q = q.limit(n);
      }
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const body = clean(req.body);
      if (body.published && !body.published_at) body.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('articles').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const clean_ = clean(patch);
      if (clean_.published && !clean_.published_at) clean_.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('articles').update(clean_).eq('id', rowId).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { error } = await supabase.from('articles').delete().eq('id', rowId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'articles api error');
  }
}

function clean(o) {
  const { id, created_at, ...rest } = o || {};
  if ('tags' in rest) rest.tags = Array.isArray(rest.tags) ? rest.tags.map(String).slice(0, 20) : [];
  if (rest.cover_image === '') rest.cover_image = null;
  if (typeof rest.cover_image === 'string' && rest.cover_image && !/^https?:\/\//i.test(rest.cover_image)) rest.cover_image = null;
  return rest;
}
