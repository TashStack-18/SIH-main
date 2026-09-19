import { Request as ExpressReq, Response as ExpressRes } from 'express';
import { NextRequest } from './shims/next-server';

export function createHandler(handlerModule: any) {
  return async (req: ExpressReq, res: ExpressRes) => {
    try {
      const method = req.method.toUpperCase();
      const fn = handlerModule[method];
      if (!fn) {
        return res.status(405).json({
          success: false,
          error: { code: 'METHOD_NOT_ALLOWED', message: `Method ${method} not allowed` },
        });
      }

      // Build full URL
      const host = req.get('host') || `localhost:${process.env.PORT || 5000}`;
      const protocol = req.protocol || 'http';
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;
      const urlObj = new URL(fullUrl);

      // Copy headers
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, String(v)));
          } else {
            headers.set(key, String(value));
          }
        }
      }

      // Prepare request body
      const body = ['POST', 'PUT', 'PATCH'].includes(method)
        ? typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body ?? {})
        : undefined;

      // Instantiate standard Web Request
      const webReq = new Request(fullUrl, {
        method,
        headers,
        body,
      }) as NextRequest;

      // Attach nextUrl & query convenience
      webReq.nextUrl = urlObj;

      // Pass context params (e.g. [id], [slug], etc.)
      const context = { params: req.params };
      const response = await fn(webReq, context);

      if (response && typeof response.json === 'function') {
        const data = await response.json();
        return res.status(response.status || 200).json(data);
      } else if (response) {
        const text = await response.text();
        return res.status(response.status || 200).send(text);
      }

      return res.status(200).end();
    } catch (err: any) {
      console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: err?.message || 'Internal server error occurred',
        },
      });
    }
  };
}
