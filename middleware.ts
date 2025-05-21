import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // If it's the root path - skip
  if (path === "/") {
    return NextResponse.next()
  }

  // If it's an auth path - skip
  if (path.includes("/auth/") || path.includes("/api/auth")) {
    return NextResponse.next()
  }

  // If it's a public profile path (username) - skip
  if (path.match(/^\/[^/]+$/) && !path.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  // For dashboard routes, check authentication
  if (path.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If not authenticated, redirect to sign-in
    if (!token) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(url)
    }

    // Anti-spoofing: Check if the token is valid and has required fields
    if (!token.sub || !token.email) {
      const url = new URL("/auth/error", request.url)
      url.searchParams.set("error", "Invalid token")
      return NextResponse.redirect(url)
    }

    // Add security headers
    const response = NextResponse.next()

    // Content Security Policy
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://*.supabase.co",
    )

    // Other security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    return response
  }

  return NextResponse.next()
}

// Specify the paths that should be checked
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
