import supabase from './db-client.js';
import { requireUser, setCors } from './_auth.js';

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { fileName, fileBase64, contentType } = req.body || {};
    if (!fileName || !fileBase64) return res.status(400).json({ error: 'Missing file' });
    const allowed = ['image/', 'application/pdf'];
    if (contentType && !allowed.some((a) => contentType.startsWith(a))) return res.status(400).json({ error: 'Unsupported file type' });
    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length > 10 * 1024 * 1024) return res.status(400).json({ error: 'File too large (max 10MB)' });
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const { error } = await supabase.storage.from('portfolio-media').upload(safeName, buffer, { contentType: contentType || 'application/octet-stream', upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(safeName);
    return res.status(200).json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}
