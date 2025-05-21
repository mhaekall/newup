import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"
import Footer from "@/components/footer"

export default async function PrivacyPage({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={`/${lang}`}>
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <LangSwitcher lang={lang} />
            <Link href={`/${lang}/auth/signin`}>
              <Button variant="ghost" size="sm">
                {dict.nav.signin}
              </Button>
            </Link>
            <Link href={`/${lang}/auth/signin`}>
              <Button size="sm">{dict.nav.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{dict.footer.privacy}</h1>

          <div className="prose max-w-none">
            <p>{dict.legal.lastUpdated} May 10, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              {lang === "en"
                ? "At looqmy, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services."
                : "Di looqmy, kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami."}
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              {lang === "en"
                ? "We may collect the following types of information:"
                : "Kami dapat mengumpulkan jenis informasi berikut:"}
            </p>
            <ul>
              <li>
                <strong>{lang === "en" ? "Personal Information:" : "Informasi Pribadi:"}</strong>
                {lang === "en"
                  ? " Name, email address, profile picture, and other information you provide when creating an account or profile."
                  : " Nama, alamat email, foto profil, dan informasi lain yang Anda berikan saat membuat akun atau profil."}
              </li>
              <li>
                <strong>{lang === "en" ? "Usage Data:" : "Data Penggunaan:"}</strong>
                {lang === "en"
                  ? " Information about how you use our website and services, including your browsing history, search queries, and interactions with our features."
                  : " Informasi tentang bagaimana Anda menggunakan situs web dan layanan kami, termasuk riwayat penjelajahan, kueri pencarian, dan interaksi dengan fitur kami."}
              </li>
            </ul>

            <h2>8. Contact Us</h2>
            <p>
              {lang === "en"
                ? "If you have any questions about this Privacy Policy, please contact us at "
                : "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di "}
              <a href="mailto:looqmy@outlook.co.id">looqmy@outlook.co.id</a>.
            </p>
          </div>

          <div className="mt-8">
            <Link href={`/${lang}`}>
              <Button variant="outline">{dict.legal.backToHome}</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
