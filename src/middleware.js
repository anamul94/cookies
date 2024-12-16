import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/products/create',
    '/packages',
    '/orders',
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Get the token from the request headers
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Add the token to the request headers if it exists
  if (token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/products/:path*',
    '/packages/:path*',
    '/orders/:path*',
  ],
}; 