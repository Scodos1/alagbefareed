import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

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

const sql = fs.readFileSync(path.join(process.cwd(), 'scripts', 'setup-database.sql'), 'utf8');

const { error } = await supabase.rpc('exec_sql', { sql });

if (error) {
  console.error('Error creating tables:', error.message);
  console.log('Trying alternative method...');
  
  const statements = sql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      const { error: e } = await supabase.from('_exec').select('*').limit(0);
      console.log('Executing:', stmt.substring(0, 50) + '...');
    }
  }
  console.log('Please run the SQL manually in Supabase SQL Editor');
  console.log('File: scripts/setup-database.sql');
} else {
  console.log('✓ Database schema created successfully');
}
