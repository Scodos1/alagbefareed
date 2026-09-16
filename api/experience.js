import supabase from './db-client.js';
import { requireAdmin, setCors, serverError, validId } from './_auth.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('current', { ascending: false })
        .order('start_date', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { data, error } = await supabase.from('experience').insert(clean(req.body)).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { data, error } = await supabase.from('experience').update(clean(patch)).eq('id', rowId).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { error } = await supabase.from('experience').delete().eq('id', rowId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'experience api error');
  }
}

function clean(o) {
  const { id, created_at, ...rest } = o || {};
  if ('responsibilities' in rest) rest.responsibilities = Array.isArray(rest.responsibilities) ? rest.responsibilities.map(String).slice(0, 50) : [];
  if ('technologies' in rest) rest.technologies = Array.isArray(rest.technologies) ? rest.technologies.map(String).slice(0, 30) : [];
  if (rest.end_date === '') rest.end_date = null;
  if (typeof rest.company === 'string') rest.company = rest.company.slice(0, 200);
  if (typeof rest.role === 'string') rest.role = rest.role.slice(0, 200);
  if (typeof rest.description === 'string') rest.description = rest.description.slice(0, 20000);
  return rest;
}
