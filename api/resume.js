import supabase from './db-client.js';
import { setCors, serverError } from './_auth.js';

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const { data } = await supabase.from('site_settings').select('resume_url').eq('id', 1).maybeSingle();
    if (data?.resume_url && /^https?:\/\//i.test(data.resume_url)) {
      res.setHeader('Location', data.resume_url);
      return res.status(302).end();
    }
    res.setHeader('Content-Type', 'text/html');
    return res.status(404).send('<h1>No resume uploaded yet</h1>');
  } catch (err) {
    return serverError(res, err, 'resume api error');
  }
}
