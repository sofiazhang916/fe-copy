import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log(`[Middleware] Processing path: ${path}`);

  // Public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/signup" || path === "/verify" || path === "/forgot-password"
  
  // API routes should pass through
  if (path.startsWith('/api/')) {
    console.log('[Middleware] API route, skipping auth check');
    return NextResponse.next();
  }

  // Static files and resources should pass through
  if (path.match(/\.(css|js|jpg|png|svg|ico|woff|woff2|ttf|otf)$/)) {
    console.log('[Middleware] Static resource, skipping auth check');
    return NextResponse.next();
  }

  // Client-side links should pass through when already in protected area
  // This prevents logout when navigating within the dashboard
  if (path.startsWith('/dashboard/') || 
      path.startsWith('/patients/') || 
      path.startsWith('/scheduling/') || 
      path.startsWith('/messages/')) {
    console.log('[Middleware] Sub-navigation in protected area, skipping strict check');
    return NextResponse.next();
  }

  // Get authentication status from cookies
  const token = request.cookies.get("accessToken")?.value || ""
  console.log(`[Middleware] Token exists: ${!!token}`);
  console.log(`[Middleware] Token value (first 10 chars): ${token ? token.substring(0, 10) + '...' : 'none'}`);
  
  // Additional protection against false positives - ensure token is not "undefined" or "null" string
  const isValidToken = !!token && token !== 'undefined' && token !== 'null';
  console.log(`[Middleware] Token is valid: ${isValidToken}`);

  const userRole = request.cookies.get("userRole")?.value || "provider"

  // Only check for main protected routes at top level, not sub-navigation
  const isProtectedMainRoute = 
    path === "/dashboard" || 
    path === "/patients" || 
    path === "/scheduling" || 
    path === "/messages";

  // If user is not authenticated and trying to access a protected route
  if (!isValidToken && !isPublicPath && isProtectedMainRoute) {
    console.log('[Middleware] Not authenticated, redirecting to login');
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If patient tries to access provider routes
  if (
    isValidToken &&
    userRole === "patient" &&
    isProtectedMainRoute &&
    (path.startsWith("/dashboard") ||
      path.startsWith("/patients") ||
      path.startsWith("/scheduling") ||
      path.startsWith("/messages"))
  ) {
    console.log('[Middleware] Patient accessing provider route, redirecting');
    return NextResponse.redirect(new URL("/patient-dashboard", request.url))
  }

  console.log('[Middleware] Proceeding normally');
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
