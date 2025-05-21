"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

interface NavbarProps {
  showBackButton?: boolean
  backUrl?: string
}

export function Navbar({ showBackButton = false, backUrl = "/dashboard" }: NavbarProps) {
  const pathname = usePathname()
  const isEditPage = pathname?.includes("/edit")
  const isDashboardPage = pathname === "/dashboard"
  const { t } = useLanguage()

  return (
    <header className="w-full py-4 px-4 sm:px-6 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href={backUrl}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("nav.back")}
              </Link>
            </Button>
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isEditPage ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">{t("nav.backToDashboard")}</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signout">{t("nav.signout")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

// Add default export
export default Navbar
