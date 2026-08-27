/* eslint-disable @typescript-eslint/no-explicit-any */
// Vercel catch-all proxy for Tenrai API
// Handles /api/proxy/* -> https://api.tenrai.org/v1/*

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept-Language');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vercel provides [...path] as req.query.path (string | string[])
  const { path: rawPath, ...queryWithoutPath } = req.query || {};
  let apiPath = '';

  if (Array.isArray(rawPath)) {
    apiPath = rawPath.join('/');
  } else if (typeof rawPath === 'string') {
    apiPath = rawPath;
  }

  // Fallback: try to parse from URL if path is empty (e.g., rewrite without query param)
  if (!apiPath && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname || '';
      // pathname is /api/proxy/seasons/now -> extract after /api/proxy/
      const match = pathname.match(/^\/api\/proxy\/(.+)$/);
      if (match && match[1]) {
        apiPath = match[1];
      }
    } catch {
      // ignore
    }
  }

  if (!apiPath) {
    return res.status(400).json({ error: 'Missing path parameter', path: req.url, query: req.query });
  }

  const targetUrl = new URL(`https://api.tenrai.org/v1/${apiPath}`);

  // Forward all query params except 'path'
  // queryWithoutPath already excludes path, but handle array values (Vercel may give string | string[])
  for (const [key, value] of Object.entries(queryWithoutPath as Record<string, unknown>)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) targetUrl.searchParams.append(key, String(v));
    } else {
      targetUrl.searchParams.set(key, String(value));
    }
  }

  // Also handle case where query params were not parsed into req.query due to rewrite
  // (parse from original url search)
  if (req.url && req.url.includes('?')) {
    try {
      const originalUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      for (const [k, v] of originalUrl.searchParams.entries()) {
        if (k === 'path') continue;
        if (!targetUrl.searchParams.has(k)) {
          targetUrl.searchParams.set(k, v);
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Accept-Language': (req.headers['accept-language'] as string) || 'en-US',
      'User-Agent': (req.headers['user-agent'] as string) || 'bobanimelist-vercel-proxy',
    };

    const response = await fetch(targetUrl.toString(), {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers,
      // @ts-expect-error - Node 22 has timeout signal
      signal: AbortSignal.timeout(15000),
      ...(req.method === 'POST' && req.body ? { body: JSON.stringify(req.body) } : {}),
    });

    const contentType = response.headers.get('content-type') || 'application/json';
    const data = await response.text();

    res.setHeader('Content-Type', contentType);
    // Cache control: don't cache proxy errors long
    if (!response.ok) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    }

    return res.status(response.status).send(data);
  } catch (error) {
    console.error('[Proxy] Error fetching Tenrai:', targetUrl.toString(), error);
    return res.status(502).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
      path: apiPath,
      target: targetUrl.toString(),
    });
  }
}
