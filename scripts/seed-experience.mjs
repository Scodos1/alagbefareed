import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
    .split('\n').filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { error: delErr } = await supabase.from('experience').delete().neq('id', 0);
  if (delErr) { console.error('Delete error:', delErr); process.exit(1); }
  console.log('Cleared experience');

  const { data, error } = await supabase.from('experience').insert({
    company: 'LASUSTECH',
    role: 'IT Support Intern',
    location: 'Lagos, Nigeria',
    description: 'Provided technical support and collaborated with a team to build an intern database management system.',
    responsibilities: [
      'Provided first-line technical support for hardware, software, and network issues across campus',
      'Collaborated with a team to design and develop an intern database management system, streamlining intern onboarding and record tracking',
      'Assisted in system maintenance, user account setup, and routine troubleshooting to ensure operational continuity',
      'Documented technical procedures and contributed to internal knowledge base resources'
    ],
    technologies: ['Database Design', 'Technical Support', 'System Maintenance'],
    start_date: '2025-04-01',
    end_date: '2025-10-31',
    current: false,
    display_order: 0,
  }).select().single();

  if (error) { console.error('Insert error:', error); process.exit(1); }
  console.log('✅ Experience seeded:', data.role, 'at', data.company, '(id:', data.id, ')');
}

main();
