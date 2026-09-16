import supabase from './db-client.js';
import { requireAdmin, setCors, checkRateLimit, rateLimited, serverError, validId } from './_auth.js';

// Public contact form: strict validation + rate limiting. Reads and message
// state changes are admin-only. Field updates are whitelisted to { read } so
// a compromised token can't rewrite message content.
export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      // 5 messages per 10 minutes per IP — stops spam floods.
      if (!checkRateLimit(req, 'contact-post', 5, 10 * 60 * 1000)) {
        return rateLimited(res, 10 * 60 * 1000);
      }
      const { name, email, subject, message } = req.body || {};
      if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields are required.' });
      if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid input.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ error: 'Invalid email.' });
      if (message.length > 5000 || subject.length > 200 || name.length > 100) return res.status(400).json({ error: 'Fields too long.' });
      // Reject URLs in the message body — classic spam signal.
      if (/https?:\/\//i.test(message) && message.length < 30) return res.status(400).json({ error: 'Links are not allowed in short messages.' });
      const { data, error } = await supabase.from('contact_messages').insert({
        name: name.trim().slice(0, 100),
        email: email.trim().slice(0, 254),
        subject: subject.trim().slice(0, 200),
        message: message.trim().slice(0, 5000),
        read: false,
      }).select('id').single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { id, read } = req.body || {};
      const rowId = validId(id);
      if (!rowId || typeof read !== 'boolean') return res.status(400).json({ error: 'Invalid input.' });
      const { data, error } = await supabase.from('contact_messages').update({ read }).eq('id', rowId).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const rowId = validId(id);
      if (!rowId) return res.status(400).json({ error: 'Invalid input.' });
      const { error } = await supabase.from('contact_messages').delete().eq('id', rowId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'contact api error');
  }
}
