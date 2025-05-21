"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                {t("nav.signin")}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">{t("nav.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("footer.privacy")}</h1>

          <div className="prose max-w-none">
            <p>{t("legal.lastUpdated")} May 10, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              {language === "en"
                ? "At looqmy, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services."
                : "Di looqmy, kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami."}
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              {language === "en"
                ? "We may collect the following types of information:"
                : "Kami dapat mengumpulkan jenis informasi berikut:"}
            </p>
            <ul>
              <li>
                <strong>{language === "en" ? "Personal Information:" : "Informasi Pribadi:"}</strong>
                {language === "en"
                  ? " Name, email address, profile picture, and other information you provide when creating an account or profile."
                  : " Nama, alamat email, foto profil, dan informasi lain yang Anda berikan saat membuat akun atau profil."}
              </li>
              <li>
                <strong>{language === "en" ? "Usage Data:" : "Data Penggunaan:"}</strong>
                {language === "en"
                  ? " Information about how you use our website and services, including your browsing history, search queries, and interactions with our features."
                  : " Informasi tentang bagaimana Anda menggunakan situs web dan layanan kami, termasuk riwayat penjelajahan, kueri pencarian, dan interaksi dengan fitur kami."}
              </li>
            </ul>

            <h2>8. Contact Us</h2>
            <p>
              {language === "en"
                ? "If you have any questions about this Privacy Policy, please contact us at "
                : "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di "}
              <a href="mailto:looqmy@outlook.co.id">looqmy@outlook.co.id</a>.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/">
              <Button variant="outline">{t("legal.backToHome")}</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>

          <div className="flex gap-6 items-center">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              {t("footer.privacy")}
            </Link>
            <a href="mailto:looqmy@outlook.co.id" className="text-gray-600 hover:text-gray-900">
              {t("footer.contact")}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  )
}
