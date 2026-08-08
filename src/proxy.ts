import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that do NOT require authentication
const publicPaths = ['/login', '/signup', '/'];

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('Authentication');
    const { pathname } = request.nextUrl;

    const isPublicPath = publicPaths.includes(pathname);

    // If the user is NOT authenticated and trying to access a protected route
    if (!authCookie && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user IS authenticated and tries to visit login/signup, redirect them to dashboard
    if (authCookie && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// The matcher defines which routes the middleware runs on.
// We run it on ALL routes, EXCEPT static files, images, and next internal files.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
