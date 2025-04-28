import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace("Bearer ", "");

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/') || 
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/organizations') ||
        request.nextUrl.pathname.startsWith('/products') ||
        request.nextUrl.pathname.startsWith('/settings') ||
        request.nextUrl.pathname.startsWith('/transactions');

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

// defines which routes should trigger the middleware
export const config = {
  matcher: [
    '/', 
    '/orders/:path*',
    '/organizations/:path*',
    '/products/:path*',
    '/settings/:path*',
    '/transactions/:path*',
    ],
};
