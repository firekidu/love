import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = new Set([
  '/api/create-ai-sandbox',
  '/api/run-command',
  '/api/kill-sandbox',
]);

export function middleware(request: NextRequest) {
  if (!protectedPaths.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const expected = process.env.SANDBOX_SECRET;
  const token =
    request.headers.get('x-sandbox-token') ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('sandbox-session')?.value;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
