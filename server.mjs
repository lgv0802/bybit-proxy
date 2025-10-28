// Minimal Bybit proxy without dependencies (Node 18+)
import http from 'http';
import { URL } from 'url';

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://local');

    // Health check
    if (u.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ok');
      return;
    }

    // Only /v5/* is allowed
    if (!u.pathname.startsWith('/v5/')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: true, message: 'Path must start with /v5/' }));
      return;
    }

    // Upstream target (use api.bytick.com to reduce geo-403)
    const target = new URL('https://api.bytick.com' + u.pathname + u.search);

    // Proxy GET only
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: true, message: 'Only GET supported' }));
      return;
    }

    const upstream = await fetch(target, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BybitProxyNode/1.0'
      }
    });

    const body = await upstream.text();

    res.writeHead(upstream.status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: true, message: String(e?.message || e) }));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('bybit proxy running on', port);
});
