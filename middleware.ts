import { NextResponse } from "next/server"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { locales, defaultLocale } from "./i18n.config"

function getLocale(request) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = matchLocale(languages, locales, defaultLocale)

  return locale
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Check if this is a profile page (starts with a username)
  const isProfilePage =
    /^\/[^/]+\/?$/.test(pathname) &&
    !locales.some((locale) => pathname === `/${locale}` || pathname === `/${locale}/`) &&
    !["_next", "api", "favicon.ico", "auth", "dashboard", "terms", "privacy", "contact"].some((reserved) =>
      pathname.startsWith(`/${reserved}`),
    )

  // If it's a profile page, redirect to /[locale]/[username]
  if (isProfilePage) {
    const username = pathname.split("/")[1]
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}/${username}`, request.url))
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url))
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
