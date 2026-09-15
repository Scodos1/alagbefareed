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
    slug: 'diabetes-risk-prediction',
    name: 'Diabetes Risk Prediction',
    tagline: 'ML-powered diabetes risk assessment tool',
    description: 'Streamlit web app that predicts diabetes risk using machine learning. Users input health metrics and receive instant risk predictions with explainable results.',
    category: 'AI & Data',
    technologies: ['Python', 'Streamlit', 'scikit-learn', 'Pandas', 'Machine Learning'],
    image_url: null,
    screenshots: [],
    problem: 'Early diabetes risk detection is critical but often requires clinical visits.',
    solution: 'ML model deployed as an interactive Streamlit app for instant risk assessment from health metrics.',
    features: ['Health metric input form', 'ML risk prediction', 'Model explainability', 'Responsive UI', 'Instant results'],
    architecture: 'Streamlit frontend → scikit-learn model → Pandas data processing',
    challenges: 'Balancing model accuracy with interpretable results for non-technical users.',
    results: 'Live Streamlit app accessible for diabetes risk screening.',
    lessons_learned: 'ML apps need clear UX to make predictions trustworthy and actionable.',
    github_url: 'https://github.com/Scodos1',
    live_url: 'https://diabetes-riskpredictions.streamlit.app/',
    project_date: '2024-08-01',
    featured: true,
    published: true,
  },
  {
    slug: 'cv-builder',
    name: 'CV Builder (MONO Studio)',
    tagline: 'AI-powered professional CV builder with live preview',
    description: 'Full-stack CV builder with React frontend, Django REST backend, JWT auth, live A4 preview, AI writing coach, ATS scoring, job description matching, and one-click PDF export.',
    category: 'Full-Stack',
    technologies: ['React', 'Django', 'Django REST Framework', 'PostgreSQL', 'JWT', 'OpenAI', 'HTML5', 'CSS3'],
    image_url: null,
    screenshots: [],
    problem: 'Job seekers struggle to create ATS-friendly CVs that pass automated filters.',
    solution: 'Full-stack builder with AI-powered writing assistance, real-time ATS scoring, and print-perfect PDF export.',
    features: ['Live A4 preview', 'AI Career Assistant', 'ATS compatibility analyzer', 'Job description matching', '4 ATS-friendly templates', 'One-click PDF export', 'Dark/light themes', 'JWT authentication'],
    architecture: 'React frontend → Django REST API → PostgreSQL + OpenAI integration',
    challenges: 'Building reliable ATS scoring and AI writing that improves without fabricating experience.',
    results: 'Live app serving job seekers with multiple templates and AI-powered features.',
    lessons_learned: 'ATS scoring requires balancing structure, keywords, and formatting for different vendor systems.',
    github_url: 'https://github.com/Scodos1/CV-Builder',
    live_url: 'https://scodos1.github.io/CV-Builder/',
    project_date: '2025-01-01',
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
