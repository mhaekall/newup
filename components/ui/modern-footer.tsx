import type React from "react"
import Link from "next/link"
import { Logo } from "./logo"

interface ModernFooterProps {
  variant?: "light" | "dark" | "colored"
  color?: string
  className?: string
}

export const ModernFooter: React.FC<ModernFooterProps> = ({
  variant = "light",
  color = "#f43f5e", // rose-500 default
  className = "",
}) => {
  // Menentukan kelas warna berdasarkan variant
  const getBackgroundClass = () => {
    switch (variant) {
      case "dark":
        return "bg-gray-900 text-white"
      case "colored":
        return "text-white"
      case "light":
      default:
        return "bg-gray-50 text-gray-800"
    }
  }

  const backgroundStyle = variant === "colored" ? { backgroundColor: color } : {}

  return (
    <footer className={`w-full py-6 ${getBackgroundClass()} ${className}`} style={backgroundStyle}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link
              href="/terms"
              className={`text-sm font-medium ${variant === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors`}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className={`text-sm font-medium ${variant === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium ${variant === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors`}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-sm ${variant === "light" ? "text-gray-500" : "text-gray-400"} font-inter`}>
            © {new Date().getFullYear()} Looqmy. All rights reserved.
          </p>
          <a
            href="mailto:looqmy@outlook.co.id"
            className={`text-sm ${variant === "light" ? "text-gray-600 hover:text-blue-500" : "text-gray-300 hover:text-white"} transition-colors mt-1 inline-block`}
          >
            looqmy@outlook.co.id
          </a>
        </div>
      </div>
    </footer>
  )
}
