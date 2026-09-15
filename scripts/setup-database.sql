-- Portfolio database schema

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  title TEXT,
  email TEXT,
  location TEXT,
  bio TEXT,
  philosophy TEXT,
  current_focus TEXT,
  currently_building TEXT,
  availability TEXT,
  available_for_work BOOLEAN DEFAULT true,
  social_links JSONB DEFAULT '{}',
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS technologies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  skill_level INTEGER DEFAULT 3,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT,
  technologies JSONB DEFAULT '[]',
  image_url TEXT,
  screenshots JSONB DEFAULT '[]',
  problem TEXT,
  solution TEXT,
  features JSONB DEFAULT '[]',
  architecture TEXT,
  challenges TEXT,
  results TEXT,
  lessons_learned TEXT,
  github_url TEXT,
  live_url TEXT,
  project_date DATE,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  tags JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
