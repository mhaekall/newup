"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export default function Navbar() {
  const pathname = usePathname()
  const isEditPage = pathname === "/dashboard/edit"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <motion.span
            className="text-3xl font-bold text-[#0066ff]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            looqmy
          </motion.span>
        </Link>

        {isEditPage && (
          <Link
            href="/dashboard"
            className="flex items-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Dashboard
          </Link>
        )}
      </div>
    </header>
  )
}
