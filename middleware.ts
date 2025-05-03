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
  }

  return NextResponse.next()
}

// Specify the paths that should be checked
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
