import { type NextRequest, NextResponse } from 'next/server';

import { authClient } from './lib/auth/client';

export default async function middleware(req: NextRequest) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: req.headers,
    },
  });

  const {
    url,
    nextUrl: { pathname },
  } = req;

  if (!session) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', url));
  }

  const { user } = session;

  if (pathname !== '/profile') {
    if (user.role === 'chef' && !pathname.startsWith('/chef')) {
      return NextResponse.redirect(new URL('/chef', url));
    }

    if (user.role === 'admin' && !pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|public).*)',
  ],
};
