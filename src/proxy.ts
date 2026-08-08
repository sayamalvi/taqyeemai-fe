import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that do NOT require authentication
const publicPaths = ['/login', '/register', '/'];

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('Authentication');
    const refreshCookie = request.cookies.get('Refresh');
    const { pathname } = request.nextUrl;

    const isPublicPath = publicPaths.includes(pathname);

    // If the user has NEITHER an access token nor a refresh token, redirect to login
    if (!authCookie && !refreshCookie && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user is authenticated (or can be refreshed) and visits login/register, redirect to dashboard
    if ((authCookie || refreshCookie) && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// The matcher defines which routes the middleware runs on.
// We run it on ALL routes, EXCEPT static files, images, and next internal files.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
