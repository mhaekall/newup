"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NavbarProps {
  showBackButton?: boolean
  backUrl?: string
}

export function Navbar({ showBackButton = false, backUrl = "/dashboard" }: NavbarProps) {
  const pathname = usePathname()
  const isEditPage = pathname.includes("/edit") || pathname.includes("/dashboard")

  return (
    <header className="w-full py-4 px-4 sm:px-6 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href={backUrl}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          )}
          <Link href="/" className="text-2xl font-pacifico text-blue-500">
            looqmy
          </Link>
        </div>
        <div>
          {isEditPage ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signout">Sign Out</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

// Add default export
export default Navbar
