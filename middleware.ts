import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  // List of paths that don't require authentication
  const publicPaths = ['/', '/about', '/faq', '/login', '/register'];
  
  if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
    // Redirect to login page if there's no token and the path is not public
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|about|faq).*)'
  ],
};