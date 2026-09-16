import supabase from './db-client.js';
import { requireAdmin, setCors, serverError, validId } from './_auth.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('technologies').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { data, error } = await supabase.from('technologies').insert(clean(req.body)).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { data, error } = await supabase.from('technologies').update(clean(patch)).eq('id', rowId).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { error } = await supabase.from('technologies').delete().eq('id', rowId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'technologies api error');
  }
}

function clean(o) {
  const { id, created_at, ...rest } = o || {};
  if (typeof rest.name === 'string') rest.name = rest.name.slice(0, 120);
  if (typeof rest.category === 'string') rest.category = rest.category.slice(0, 120);
  if (rest.skill_level != null) rest.skill_level = Math.min(Math.max(Number(rest.skill_level) || 0, 0), 5);
  if (rest.display_order != null) rest.display_order = Number(rest.display_order) || 0;
  return rest;
}
