import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTE = ["/", "/auth/sign-in", "/auth/sign-up"];

export default function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const accessToken = cookies.get(process.env.COOKIE_NAME as string)?.value;
  const isPublicRoute = PUBLIC_ROUTE.includes(nextUrl.pathname);

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
