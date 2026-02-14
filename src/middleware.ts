/* src/middleware.ts */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const { pathname } = request.nextUrl;
  
  if (isMaintenanceMode) {
    if (pathname === '/maintenance' || pathname.startsWith('/_next') || pathname.includes('.')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Added sw.js and manifest to the exclusion list
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest).*)',
}