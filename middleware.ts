// File: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // List of paths that don't require authentication
  const publicPaths = ['/', '/about', '/faq', '/login', '/register'];
  
  // Check if the current path starts with /admin
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
    // Redirect to login page if there's no token and the path is not public
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAdminPath && userRole !== 'ADMIN') {
    // Redirect to user dashboard if trying to access admin paths without admin role
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|public|favicon.ico|about|faq).*)'
  ],
};