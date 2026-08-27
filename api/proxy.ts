import type { VercelRequest, VercelResponse } from '@vercel/node';

const TENRAI_API_BASE = 'https://api.tenrai.org/v1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept-Language');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;

    if (!apiPath) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const url = new URL(`${TENRAI_API_BASE}/${apiPath}`);
    if (req.query && req.query.path !== undefined) {
        const params = { ...req.query };
        delete params.path;
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        }
    }

    try {
        const headers: Record<string, string> = {
            'Accept-Language': (req.headers['accept-language'] as string) || 'en-US',
        };

        const response = await fetch(url.toString(), {
            method: req.method === 'POST' ? 'POST' : 'GET',
            headers,
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
            signal: AbortSignal.timeout(15000),
        });

        const data = await response.text();

        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
        return res.status(response.status).send(data);
    } catch (error) {
        console.error('[Proxy] Error:', error);
        return res.status(502).json({
            error: 'Proxy error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
