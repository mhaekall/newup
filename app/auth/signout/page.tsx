"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ redirect: false })
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-3">Sign Out</h1>
          <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>

            <button
              onClick={handleCancel}
              className="w-full h-12 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
