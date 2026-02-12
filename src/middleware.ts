import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Check if maintenance mode is enabled via environment variable
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // 2. Define the path we want to allow (the maintenance page itself)
  // and any static assets like images/fonts
  const { pathname } = request.nextUrl;
  
  if (isMaintenanceMode) {
    // Allow the maintenance page and static files to load
    if (pathname === '/maintenance' || pathname.startsWith('/_next') || pathname.includes('.')) {
      return NextResponse.next();
    }
    
    // Redirect everyone else to /maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

// Ensure this runs on all routes
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}