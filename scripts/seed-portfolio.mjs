import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local manually (no dotenv dep needed)
function loadEnvFile(file) {
  try {
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

loadEnvFile(path.join(process.cwd(), '.env.local'));

const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const siteSettings = {
  id: 1,
  name: 'Alagbe Fareed Adebayo',
  title: 'Full-Stack Developer',
  email: 'alagbefareed@gmail.com',
  location: 'Ikorodu, Lagos, Nigeria',
  bio: 'I’m a Full-Stack Developer who builds modern, scalable web applications that turn real-world problems into practical digital solutions. I combine thoughtful frontend experiences with robust backend systems, APIs, databases, and AI-powered functionality to create products that are functional, reliable, and built with purpose.',
  philosophy: 'Functional, reliable, built with purpose. I care about clean code, practical architecture, and shipping products people can actually use.',
  current_focus: 'Open to freelance, contract, and full-time roles. Currently focused on full-stack web apps with Python/Django, REST APIs, Postgres/Supabase, and AI integration.',
  currently_building: 'A Telegram Signal Copier, SME Business Intelligence and customer acquisition',
  availability: 'Available for new opportunities — freelance, contract, and full-time roles.',
  available_for_work: true,
  social_links: {},
  resume_url: null,
};

const technologies = [
  { name: 'HTML5', category: 'Frontend', skill_level: 5, display_order: 1 },
  { name: 'CSS3', category: 'Frontend', skill_level: 5, display_order: 2 },
  { name: 'JavaScript', category: 'Frontend', skill_level: 4, display_order: 3 },
  { name: 'React', category: 'Frontend', skill_level: 4, display_order: 4 },
  { name: 'Responsive Web Design', category: 'Frontend', skill_level: 5, display_order: 5 },
  { name: 'Python', category: 'Backend', skill_level: 4, display_order: 10 },
  { name: 'Django', category: 'Backend', skill_level: 4, display_order: 11 },
  { name: 'Django REST Framework', category: 'Backend', skill_level: 4, display_order: 12 },
  { name: 'REST API Development', category: 'Backend', skill_level: 4, display_order: 13 },
  { name: 'PostgreSQL', category: 'Databases', skill_level: 4, display_order: 20 },
  { name: 'Supabase', category: 'Databases', skill_level: 4, display_order: 21 },
  { name: 'SQL', category: 'Databases', skill_level: 4, display_order: 22 },
  { name: 'AI Integration', category: 'AI & Data', skill_level: 4, display_order: 30 },
  { name: 'Machine Learning', category: 'AI & Data', skill_level: 3, display_order: 31 },
  { name: 'NLP', category: 'AI & Data', skill_level: 3, display_order: 32 },
  { name: 'Streamlit', category: 'AI & Data', skill_level: 4, display_order: 33 },
  { name: 'Data Analysis', category: 'AI & Data', skill_level: 4, display_order: 34 },
  { name: 'Git', category: 'Tools', skill_level: 4, display_order: 40 },
  { name: 'GitHub', category: 'Tools', skill_level: 4, display_order: 41 },
  { name: 'VS Code', category: 'Tools', skill_level: 5, display_order: 42 },
  { name: 'Render', category: 'Deployment', skill_level: 4, display_order: 50 },
  { name: 'Netlify', category: 'Deployment', skill_level: 4, display_order: 51 },
  { name: 'GitHub Pages', category: 'Deployment', skill_level: 5, display_order: 52 },
];

const skills = [
  { name: 'HTML5', category: 'Frontend Development', display_order: 1 },
  { name: 'CSS3', category: 'Frontend Development', display_order: 2 },
  { name: 'JavaScript', category: 'Frontend Development', display_order: 3 },
  { name: 'Responsive Web Design', category: 'Frontend Development', display_order: 4 },
  { name: 'Accessible UI Development', category: 'Frontend Development', display_order: 5 },
  { name: 'React', category: 'Frontend Development', display_order: 6 },
  { name: 'Python', category: 'Backend Development', display_order: 10 },
  { name: 'Django', category: 'Backend Development', display_order: 11 },
  { name: 'Django REST Framework', category: 'Backend Development', display_order: 12 },
  { name: 'REST API Development', category: 'Backend Development', display_order: 13 },
  { name: 'Authentication & Authorization', category: 'Backend Development', display_order: 14 },
  { name: 'PostgreSQL', category: 'Databases', display_order: 20 },
  { name: 'Supabase', category: 'Databases', display_order: 21 },
  { name: 'Database Design', category: 'Databases', display_order: 22 },
  { name: 'AI Integration', category: 'AI & Data', display_order: 30 },
  { name: 'Machine Learning', category: 'AI & Data', display_order: 31 },
  { name: 'NLP', category: 'AI & Data', display_order: 32 },
  { name: 'Streamlit', category: 'AI & Data', display_order: 33 },
  { name: 'Git & GitHub', category: 'Development Tools', display_order: 40 },
  { name: 'Debugging & Troubleshooting', category: 'Software Engineering', display_order: 50 },
  { name: 'Software Testing', category: 'Software Engineering', display_order: 51 },
  { name: 'Deployment (Render, Netlify, GitHub Pages)', category: 'Deployment', display_order: 60 },
];

const projects = [
  {
    slug: 'telegram-signal-copier',
    name: 'Telegram Signal Copier',
    tagline: 'Automated MT5 trade copying from Telegram signals',
    description: 'Python system that listens to Telegram channels via Telethon, parses trading signals, and copies them to MetaTrader 5 with multi-account support, risk controls, and a FastAPI control layer.',
    category: 'Backend / Automation',
    technologies: ['Python', 'FastAPI', 'Telethon', 'python-telegram-bot', 'pandas', 'scikit-learn', 'SQL'],
    image_url: null,
    screenshots: [],
    problem: 'Manual copying of Telegram trading signals is slow and error-prone.',
    solution: 'MTProto listener + parser + MT5 executor with journaling and optional ML meta-labeling.',
    features: ['Telegram channel listener', 'Signal parsing', 'Multi-account copying', 'Risk / drawdown guards', 'Trade journal CSV export', 'FastAPI control server'],
    architecture: 'Telethon listener → parser → executor → SQLite journal → FastAPI API',
    challenges: 'Parsing free-form signal text reliably across channels.',
    results: 'Working local automation with journaling and backtest hooks.',
    lessons_learned: 'Robust parsing and risk limits matter more than entry logic.',
    github_url: null,
    live_url: null,
    project_date: '2025-11-01',
    featured: true,
    published: true,
  },
  {
    slug: 'sme-business-intelligence',
    name: 'SME Business Intelligence & Customer Acquisition',
    tagline: 'Django + React analytics platform for small businesses',
    description: 'Full-stack platform with Django REST backend (JWT, Postgres), analytics, expenses, sales, customers, marketing, and an AI advisor powered by OpenAI, plus a Vite React frontend.',
    category: 'Full-Stack',
    technologies: ['Django', 'Django REST Framework', 'PostgreSQL', 'React', 'Vite', 'OpenAI', 'JWT'],
    image_url: null,
    screenshots: [],
    problem: 'SMEs lack affordable, unified sales/expense/customer analytics.',
    solution: 'Modular Django apps + REST API + React dashboard with AI advisor for decisions.',
    features: ['Sales & expense tracking', 'Customer management', 'Analytics dashboards', 'AI business advisor', 'JWT auth', 'Postgres deployment'],
    architecture: 'Django apps (sales, expenses, customers, analytics, ai_advisor) → DRF → React frontend',
    challenges: 'Modeling multi-tenant SME data cleanly.',
    results: 'Working backend + frontend monorepo ready for Render deployment.',
    lessons_learned: 'Modular Django apps scale well for business domains.',
    github_url: null,
    live_url: null,
    project_date: '2025-09-01',
    featured: true,
    published: true,
  },
  {
    slug: 'stylesbytiwa',
    name: 'StylesByTiwa',
    tagline: 'Fashion e-commerce storefront',
    description: 'Modern fashion website showcasing clothing collections with clean UI, shop pages, cart flow, and admin dashboard.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image_url: null,
    screenshots: [],
    problem: 'Boutique needed an online catalogue that feels premium on mobile.',
    solution: 'Static storefront with collection filtering, product pages, and admin view.',
    features: ['Collection grid', 'Product detail', 'Cart flow', 'Admin dashboard'],
    architecture: 'Static HTML/CSS/JS multi-page site',
    challenges: 'Keeping it fast without a framework.',
    results: 'Live GitHub Pages storefront.',
    lessons_learned: 'Strong CSS fundamentals carry a storefront a long way.',
    github_url: 'https://github.com/Scodos1',
    live_url: 'https://scodos1.github.io/stylesbytiwa/',
    project_date: '2024-06-01',
    featured: true,
    published: true,
  },
  {
    slug: 'cgpa-calculator',
    name: 'CGPA Calculator',
    tagline: 'Student GPA tracking web app',
    description: 'Web app that calculates CGPA from user input with a simple interactive interface for tracking academic performance.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image_url: null,
    screenshots: [],
    problem: 'Students need a quick way to compute and project CGPA.',
    solution: 'Client-side calculator with semester and course inputs.',
    features: ['Semester input', 'Grade mapping', 'CGPA projection', 'Responsive UI'],
    architecture: 'Single-page static app',
    challenges: 'Handling varied grading scales.',
    results: 'Live tool used by students.',
    lessons_learned: 'Small utilities win when UX is frictionless.',
    github_url: 'https://github.com/Scodos1',
    live_url: 'https://scodos1.github.io/CGPA.calculator/',
    project_date: '2024-03-01',
    featured: false,
    published: true,
  },
];

async function upsert(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}: ${rows.length} rows upserted`);
}

const run = async () => {
  await upsert('site_settings', [siteSettings], 'id');

  // Insert technologies/skills/projects only if empty (avoid duplicates on re-run)
  const { count: techCount } = await supabase.from('technologies').select('id', { count: 'exact', head: true });
  if (!techCount) await upsert('technologies', technologies, 'id');
  else console.log(`• technologies: already has ${techCount} rows, skipping`);

  const { count: skillCount } = await supabase.from('skills').select('id', { count: 'exact', head: true });
  if (!skillCount) await upsert('skills', skills, 'id');
  else console.log(`• skills: already has ${skillCount} rows, skipping`);

  const { count: projCount } = await supabase.from('projects').select('id', { count: 'exact', head: true });
  if (!projCount) await upsert('projects', projects, 'slug');
  else console.log(`• projects: already has ${projCount} rows, skipping`);

  console.log('Done.');
};

run().catch((e) => { console.error(e.message); process.exit(1); });
