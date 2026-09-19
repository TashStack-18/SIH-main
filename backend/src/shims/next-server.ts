/**
 * Lightweight Next.js Server Shim for Standalone Express Backend
 * Allows NextRequest / NextResponse route handlers to execute in Node/Express without Next.js runtime.
 */

export class NextResponse<Body = any> extends Response {
  static json<T = any>(data: T, init?: ResponseInit): NextResponse<T> {
    const headers = new Headers(init?.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return new Response(JSON.stringify(data), {
      ...init,
      headers,
    }) as NextResponse<T>;
  }
}

export interface NextRequest extends Request {
  nextUrl: URL;
}
