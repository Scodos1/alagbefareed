import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
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
    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const { data, error } = await supabase.from('experience').insert(clean(req.body)).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      const { data, error } = await supabase.from('experience').update(clean(patch)).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('experience').delete().eq('id', id);
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
  if ('responsibilities' in rest) rest.responsibilities = Array.isArray(rest.responsibilities) ? rest.responsibilities : [];
  if ('technologies' in rest) rest.technologies = Array.isArray(rest.technologies) ? rest.technologies : [];
  if (rest.end_date === '') rest.end_date = null;
  return rest;
}
