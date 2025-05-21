"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-6">
          <Logo />
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <Link href="/terms" className="text-gray-600 hover:text-gray-900">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
            {t("footer.privacy")}
          </Link>
          <a href="mailto:looqmy@outlook.co.id" className="text-gray-600 hover:text-gray-900">
            {t("footer.contact")}
          </a>
        </div>

        <div className="flex items-center justify-center mb-4">
          <LanguageSwitcher />
        </div>

        <p className="text-gray-500 text-center">
          © {new Date().getFullYear()} looqmy. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  )
}
