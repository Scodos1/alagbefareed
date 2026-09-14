// Local dev shim for Vercel /api/* functions.
// Usage (two terminals):
//   npm run dev:api   # serves /api on http://localhost:5198
//   npm run dev       # Vite on http://localhost:5173 proxies /api → 5198
// On Vercel production this file is NOT used — Vercel serves api/*.js natively.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();

// Load .env.local (no extra deps)
try {
  const text = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch {}

const PORT = Number(process.env.LOCAL_API_PORT || 5198);
const handlers = new Map();

async function getHandler(name) {
  if (handlers.has(name)) return handlers.get(name);
  const file = path.join(ROOT, 'api', `${name}.js`);
  if (!fs.existsSync(file)) return null;
  const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
  handlers.set(name, mod.default);
  return mod.default;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 2_000_000) req.destroy(); });
    req.on('end', () => {
      if (!data) return resolve(undefined);
      try { resolve(JSON.parse(data)); } catch { resolve(undefined); }
    });
  });
}

const server = http.createServer(async (nodeReq, nodeRes) => {
  try {
    const url = new URL(nodeReq.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) {
      nodeRes.writeHead(404, { 'Content-Type': 'application/json' });
      return nodeRes.end(JSON.stringify({ error: 'Not found' }));
    }
    const name = url.pathname.replace('/api/', '').split('/')[0] || 'settings';
    const handler = await getHandler(name);
    if (!handler) {
      nodeRes.writeHead(404, { 'Content-Type': 'application/json' });
      return nodeRes.end(JSON.stringify({ error: `No such API: ${name}` }));
    }

    const query = Object.fromEntries(url.searchParams.entries());
    const body = await readBody(nodeReq);

    const req = {
      method: nodeReq.method,
      query,
      body,
      headers: {
        'content-type': nodeReq.headers['content-type'],
        authorization: nodeReq.headers['authorization'],
      },
    };

    const res = {
      _status: 200,
      setHeader(k, v) { nodeRes.setHeader(k, v); },
      status(c) { this._status = c; return this; },
      json(o) {
        nodeRes.writeHead(this._status, { 'Content-Type': 'application/json' });
        nodeRes.end(JSON.stringify(o));
      },
      send(x) {
        if (!nodeRes.headersSent) nodeRes.writeHead(this._status);
        nodeRes.end(typeof x === 'string' ? x : String(x ?? ''));
      },
      end(d) {
        if (!nodeRes.headersSent) nodeRes.writeHead(this._status);
        nodeRes.end(d);
      },
    };

    await handler(req, res);
  } catch (err) {
    console.error('local-api error:', err.message);
    if (!nodeRes.headersSent) nodeRes.writeHead(500, { 'Content-Type': 'application/json' });
    nodeRes.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => console.log(`local-api listening on http://localhost:${PORT}`));
