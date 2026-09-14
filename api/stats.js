import supabase from './db-client.js';
import { setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [projectsAll, projectsPub, articlesAll, articlesPub, exp, skills, techs, msgs, unread] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('articles').select('id', { count: 'exact', head: true }),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('experience').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('technologies').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
    ]);
    return res.status(200).json({
      projects: projectsPub.count || 0,
      published_projects: projectsPub.count || 0,
      draft_projects: (projectsAll.count || 0) - (projectsPub.count || 0),
      articles: articlesAll.count || 0,
      published_articles: articlesPub.count || 0,
      experience: exp.count || 0,
      skills: skills.count || 0,
      technologies: techs.count || 0,
      messages: msgs.count || 0,
      unread_messages: unread.count || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
