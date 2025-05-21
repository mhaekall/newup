import type React from "react"
import { Logo } from "./ui/logo"

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Logo />
          </div>

          <div className="text-center mt-4">
            <h3 className="text-lg font-medium text-gray-800">Contact</h3>
            <p className="mt-2 text-gray-600">Have questions or feedback?</p>
            <a
              href="mailto:looqmy@outlook.co.id"
              className="text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              looqmy@outlook.co.id
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 font-inter">
              © {new Date().getFullYear()} looqmy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
