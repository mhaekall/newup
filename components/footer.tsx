import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="w-full py-8 border-t mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Logo animate={false} className="text-4xl" />

          <div className="flex space-x-8 text-gray-600">
            <Link href="/terms" className="hover:text-blue-500 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-blue-500 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-blue-500 transition-colors">
              Contact
            </Link>
          </div>

          <div className="text-sm text-gray-500">© {new Date().getFullYear()} looqmy. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
