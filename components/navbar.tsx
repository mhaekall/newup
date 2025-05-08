"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { useHaptic } from "@/hooks/use-haptic"

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isEditPage = pathname?.includes("/edit") || pathname?.includes("/dashboard")
  const haptic = useHaptic()

  const handleSignOut = async () => {
    haptic.medium()
    await signOut({ callbackUrl: "/" })
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full bg-white border-b border-gray-100"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="text-2xl font-medium text-blue-500"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            looqmy
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            isEditPage ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Back to Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </motion.button>
            )
          ) : (
            status === "unauthenticated" && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.header>
  )
}
