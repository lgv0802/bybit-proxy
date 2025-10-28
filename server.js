import express from 'express';
import fetch from 'node-fetch';
const app = express();

app.get('/health', (req, res) => res.type('text').send('ok'));

app.get('/v5/*', async (req, res) => {
  const upstream = 'https://api.bytick.com' + req.originalUrl;
  try {
    const r = await fetch(upstream, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'BybitProxyRender/1.0' }
    });
    const txt = await r.text();
    res.status(r.status)
       .set({
         'Content-Type': 'application/json; charset=utf-8',
         'Cache-Control': 'no-store',
         'Access-Control-Allow-Origin': '*'
       })
       .send(txt);
  } catch (e) {
    res.status(502)
       .type('application/json')
       .send(JSON.stringify({ error: true, message: String(e?.message || e) }));
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('bybit proxy on', port));
