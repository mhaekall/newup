import type React from "react"
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
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Logo />
          </div>

          <div className="text-center mt-4">
            <h3 className={`text-lg font-medium ${variant === "light" ? "text-gray-800" : "text-white"}`}>Contact</h3>
            <p className={`mt-2 ${variant === "light" ? "text-gray-600" : "text-gray-300"}`}>
              Have questions or feedback?
            </p>
            <a
              href="mailto:looqmy@outlook.co.id"
              className={`text-lg font-medium ${variant === "light" ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"} transition-colors`}
            >
              looqmy@outlook.co.id
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className={`text-sm ${variant === "light" ? "text-gray-500" : "text-gray-400"} font-inter`}>
              © {new Date().getFullYear()} looqmy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
