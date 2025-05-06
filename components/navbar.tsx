"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isEditPage = pathname === "/dashboard/edit"
  const isDashboard = pathname === "/dashboard"
  const isSignInPage = pathname.includes("/auth/signin")

  // Don't show navbar on sign in page
  if (isSignInPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {isEditPage && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-full text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          )}

          {!isEditPage && (
            <Link href="/" className="flex items-center">
              <motion.span
                className="text-2xl font-medium text-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                looqmy
              </motion.span>
            </Link>
          )}

          {isDashboard && session?.user && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="ml-2 flex items-center"
            >
              <span className="text-lg font-normal text-gray-900">@{session.user.username || "user"}</span>
            </motion.div>
          )}
        </div>

        {session?.user && !isEditPage && (
          <Link
            href="/auth/signout"
            className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Sign Out
          </Link>
        )}
      </div>
    </header>
  )
}
