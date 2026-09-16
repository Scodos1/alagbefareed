import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Admin allowlist. ONLY these emails can mutate content or read private data.
// Set ADMIN_EMAILS in Vercel env (comma-separated). Falls back to the site
// owner so a missing env var can never lock you out — but anyone ELSE is
// denied, unlike the old behaviour which accepted ANY logged-in user.
// ---------------------------------------------------------------------------
const FALLBACK_OWNER_EMAIL = 'alagbefareed@gmail.com';

function adminEmails() {
  const raw = process.env.ADMIN_EMAILS || FALLBACK_OWNER_EMAIL;
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return adminEmails().includes(String(email).toLowerCase());
}

export async function requireUser(req) {
  try {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    if (!token) return null;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return null;
    const client = createClient(url, anon);
    const { data: { user } } = await client.auth.getUser(token);
    return user || null;
  } catch {
    return null;
  }
}

// Use this for every write endpoint and every private read endpoint.
export async function requireAdmin(req) {
  const user = await requireUser(req);
  if (!user) return null;
  if (!isAdminEmail(user.email)) return null;
  return user;
}

// ---------------------------------------------------------------------------
// CORS: same-origin by default. Only echoes back Origin when it is on the
// allowlist. The old code sent `Access-Control-Allow-Origin: *` on every
// response, including authed admin endpoints.
// Call as setCors(req, res). Old single-arg setCors(res) still works but
// sends no ACAO header (safest default).
// ---------------------------------------------------------------------------
function allowedOrigins() {
  const list = [];
  if (process.env.VERCEL_URL) list.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.PRODUCTION_URL) list.push(process.env.PRODUCTION_URL);
  // Local dev (Vite + local-api shim)
  list.push('http://localhost:5173', 'http://localhost:5198', 'http://127.0.0.1:5173');
  return list;
}

export function setCors(reqOrRes, maybeRes) {
  let req = null;
  let res = maybeRes || null;
  if (!res) {
    // Legacy single-arg call: setCors(res)
    res = reqOrRes;
  } else {
    req = reqOrRes;
  }
  const origin = req?.headers?.origin || req?.headers?.Origin || '';
  if (origin && allowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// ---------------------------------------------------------------------------
// Tiny in-memory rate limiter (per serverless instance — best effort, but it
// stops casual spam/abuse: contact form, uploads, login-adjacent calls).
// Returns true when the request is allowed, false when rate-limited.
// ---------------------------------------------------------------------------
const _hits = new Map(); // key -> { count, resetAt }

export function checkRateLimit(req, route, limit, windowMs) {
  const ip =
    req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers?.['x-real-ip'] ||
    'unknown';
  const key = `${route}:${ip}`;
  const now = Date.now();
  const entry = _hits.get(key);
  if (!entry || now > entry.resetAt) {
    _hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  if (entry.count > limit) return false;
  return true;
}

export function rateLimited(res, windowMs) {
  res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)));
  return res.status(429).json({ error: 'Too many requests. Please slow down.' });
}

// ---------------------------------------------------------------------------
// Never leak DB internals to clients. Log server-side, return generic text.
// ---------------------------------------------------------------------------
export function serverError(res, err, prefix = 'api error') {
  console.error(`${prefix}:`, err?.message || err);
  return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
}

export function validId(id) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}
