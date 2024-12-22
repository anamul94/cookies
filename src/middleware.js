import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path
  const path = request.nextUrl.pathname;

  // Define protected routes - include all variations
  const protectedRoutes = [
    '/products',
    '/packages',
    '/orders',
  ];

  // Check if the current path is a protected route or its sub-route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );

  // Get token from cookies first, then from localStorage
  const token = request.cookies.get('token')?.value;

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', path); // Store the original path
    return NextResponse.redirect(loginUrl);
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
    /*
     * Match all routes starting with:
     * - /products
     * - /packages
     * - /orders
     * This includes all sub-routes
     */
    '/products/:path*',
    '/packages/:path*',
    '/orders/:path*',
  ],
};