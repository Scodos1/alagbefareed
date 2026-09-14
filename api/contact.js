import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { name, email, subject, message } = req.body || {};
      if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields are required.' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email.' });
      if (message.length > 5000 || subject.length > 200 || name.length > 100) return res.status(400).json({ error: 'Fields too long.' });
      const { data, error } = await supabase.from('contact_messages').insert({
        name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), read: false,
      }).select().single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }

    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      const { data, error } = await supabase.from('contact_messages').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
