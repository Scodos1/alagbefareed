import supabase from './db-client.js';
import { requireAdmin, setCors, checkRateLimit, rateLimited, serverError } from './_auth.js';

export const config = { api: { bodyParser: { sizeLimit: '12mb' } } };

const MAX_BYTES = 10 * 1024 * 1024;

// Extension allowlist (checked AND magic-byte verified below — the
// client-supplied contentType alone is NOT trusted).
const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf'];

function detectKind(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return { ext: '.png', mime: 'image/png' };
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: '.jpg', mime: 'image/jpeg' };
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return { ext: '.gif', mime: 'image/gif' };
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return { ext: '.webp', mime: 'image/webp' };
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return { ext: '.pdf', mime: 'application/pdf' };
  return null;
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = await requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  // 20 uploads per 10 minutes per IP.
  if (!checkRateLimit(req, 'upload', 20, 10 * 60 * 1000)) {
    return rateLimited(res, 10 * 60 * 1000);
  }

  try {
    const { fileName, fileBase64 } = req.body || {};
    if (!fileName || !fileBase64) return res.status(400).json({ error: 'Missing file' });
    if (typeof fileName !== 'string' || typeof fileBase64 !== 'string') return res.status(400).json({ error: 'Invalid input.' });

    const lower = fileName.toLowerCase();
    const extOk = ALLOWED_EXT.some((e) => lower.endsWith(e));
    if (!extOk) return res.status(400).json({ error: 'Only PNG, JPG, GIF, WebP images and PDFs are allowed.' });

    let buffer;
    try {
      buffer = Buffer.from(fileBase64, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid file data.' });
    }
    if (buffer.length === 0 || buffer.length > MAX_BYTES) return res.status(400).json({ error: 'File too large (max 10MB).' });

    // Magic-byte verification — rejects renamed executables/scripts.
    const kind = detectKind(buffer);
    if (!kind) return res.status(400).json({ error: 'File content does not match its type.' });

    // Random server-side name — prevents overwrites and path games.
    // upsert:false so an existing object can never be silently replaced.
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${kind.ext}`;
    const { error } = await supabase.storage.from('portfolio-media').upload(safeName, buffer, { contentType: kind.mime, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(safeName);
    return res.status(200).json({ url: urlData.publicUrl });
  } catch (err) {
    return serverError(res, err, 'upload error');
  }
}
