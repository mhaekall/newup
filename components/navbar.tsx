"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-medium text-blue-500"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              looqmy
            </motion.span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          {user ? (
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
