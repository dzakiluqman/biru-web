import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase session refresh
  const supabaseResponse = await updateSession(request);

  // Handle /admin route protection
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/dashboard')) {
      const adminCookie = request.cookies.get('biru_admin_session');
      const supabaseAuthToken =
        request.cookies.get('sb-access-token') ||
        request.cookies
          .getAll()
          .find((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

      if (!adminCookie?.value && !supabaseAuthToken?.value) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname === '/admin/login' || pathname === '/admin') {
      const adminCookie = request.cookies.get('biru_admin_session');
      if (adminCookie?.value === 'authenticated_admin') {
        const dashboardUrl = new URL('/admin/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    return supabaseResponse;
  }

  // Handle localized routes via next-intl
  return intlMiddleware(request);
}

export default proxy;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
