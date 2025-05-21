"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("footer.terms")}</h1>

          <div className="prose max-w-none">
            <p>{t("legal.lastUpdated")} May 10, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              {language === "en"
                ? "At looqmy, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services."
                : "Di looqmy, kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami."}
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              {language === "en"
                ? "By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services."
                : "Dengan mengakses atau menggunakan Layanan kami, Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak menyetujui Ketentuan ini, Anda tidak boleh mengakses atau menggunakan Layanan kami."}
            </p>

            <h2>3. Changes to Terms</h2>
            <p>
              {language === "en"
                ? "We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on our website or through other communications. Your continued use of the Services after such changes constitutes your acceptance of the new Terms."
                : "Kami berhak untuk mengubah Ketentuan ini kapan saja. Kami akan memberikan pemberitahuan tentang perubahan material dengan memposting Ketentuan yang diperbarui di situs web kami atau melalui komunikasi lainnya. Penggunaan Layanan yang berkelanjutan setelah perubahan tersebut merupakan penerimaan Anda terhadap Ketentuan baru."}
            </p>

            <h2>4. User Accounts</h2>
            <p>
              {language === "en"
                ? "To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account."
                : "Untuk mengakses fitur tertentu dari Layanan kami, Anda mungkin diminta untuk membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda. Anda setuju untuk memberi tahu kami segera tentang penggunaan akun Anda yang tidak sah."}
            </p>

            <h2>10. Contact Information</h2>
            <p>
              {language === "en"
                ? "If you have any questions about these Terms, please contact us at "
                : "Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami di "}
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
