import supabase from './db-client.js';
import { requireAdmin, setCors, serverError } from './_auth.js';

const ALLOWED_SETTINGS_FIELDS = [
  'name', 'title', 'email', 'location', 'bio', 'philosophy',
  'current_focus', 'currently_building', 'availability',
  'available_for_work', 'social_links', 'resume_url',
];

function sanitizeUrl(v) {
  if (v == null || v === '') return null;
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, 2000);
  if (/^(https?:\/\/|\/)/i.test(s)) return s;
  return null;
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return res.status(200).json(data || {});
    }

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'PUT') {
      const patch = {};
      for (const f of ALLOWED_SETTINGS_FIELDS) {
        if (!(f in (req.body || {}))) continue;
        let v = req.body[f];
        if (typeof v === 'string') v = v.slice(0, f === 'bio' || f === 'philosophy' ? 10000 : 2000);
        patch[f] = v;
      }
      if ('resume_url' in patch) patch.resume_url = sanitizeUrl(patch.resume_url);
      if ('social_links' in patch) {
        const links = {};
        if (patch.social_links && typeof patch.social_links === 'object') {
          for (const [k, v] of Object.entries(patch.social_links).slice(0, 20)) {
            if (typeof v === 'string' && v.trim()) {
              // Allow mailto: for email plus http(s) links.
              const s = v.trim().slice(0, 500);
              if (/^(https?:\/\/|mailto:)/i.test(s)) links[String(k).slice(0, 40)] = s;
            }
          }
        }
        patch.social_links = links;
      }
      // upsert row with id=1
      const { data, error } = await supabase.from('site_settings').upsert({ id: 1, ...patch }).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, err, 'settings api error');
  }
}
