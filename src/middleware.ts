import { type NextRequest, NextResponse } from 'next/server';

import { authClient } from './lib/auth/client';

export default async function middleware(req: NextRequest) {
  // TODO: Add your own logic here to validate the session after UI finished
  // const { data: session } = await authClient.getSession({
  //   fetchOptions: {
  //     headers: req.headers,
  //   },
  // });

  // const {
  //   url,
  //   nextUrl: { pathname },
  // } = req;

  // if (!session) {
  //   return NextResponse.redirect(new URL('/auth/login', url));
  // }

  // if (session && pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/', url));
  // }

  // if (session?.user && session.user.role !== 'admin' && pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/', url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|public).*)',
  ],
};
