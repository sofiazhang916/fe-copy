import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/signup" || path === "/verify" || path === "/forgot-password"

  // Get authentication status from cookies
  const token = request.cookies.get("accessToken")?.value || ""
  const userRole = request.cookies.get("userRole")?.value || "provider"

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is authenticated and trying to access a public route
  if (token && isPublicPath) {
    // Redirect to appropriate dashboard based on user role
    if (userRole === "patient") {
      return NextResponse.redirect(new URL("/patient-dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // If patient tries to access provider routes
  if (
    token &&
    userRole === "patient" &&
    (path.startsWith("/dashboard") ||
      path.startsWith("/patients") ||
      path.startsWith("/scheduling") ||
      path.startsWith("/messages"))
  ) {
    return NextResponse.redirect(new URL("/patient-dashboard", request.url))
  }

  // If provider tries to access patient routes
  if (token && userRole === "provider" && path.startsWith("/patient-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/patient-dashboard/:path*",
    "/patients/:path*",
    "/scheduling/:path*",
    "/messages/:path*",
    "/signup",
    "/verify",
    "/forgot-password",
  ],
}
