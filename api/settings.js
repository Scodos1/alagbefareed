import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return res.status(200).json(data || {});
    }

    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'PUT') {
      const { id, created_at, ...patch } = req.body;
      // upsert row with id=1
      const { data, error } = await supabase.from('site_settings').upsert({ id: 1, ...patch }).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
