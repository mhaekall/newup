import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"
import Footer from "@/components/footer"

export default async function TermsPage({ params }) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{dict.footer.terms}</h1>

          <div className="prose max-w-none">
            <p>{dict.legal.lastUpdated} May 10, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              {lang === "en"
                ? "At looqmy, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services."
                : "Di looqmy, kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami."}
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              {lang === "en"
                ? "By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services."
                : "Dengan mengakses atau menggunakan Layanan kami, Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak menyetujui Ketentuan ini, Anda tidak boleh mengakses atau menggunakan Layanan kami."}
            </p>

            <h2>3. Changes to Terms</h2>
            <p>
              {lang === "en"
                ? "We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on our website or through other communications. Your continued use of the Services after such changes constitutes your acceptance of the new Terms."
                : "Kami berhak untuk mengubah Ketentuan ini kapan saja. Kami akan memberikan pemberitahuan tentang perubahan material dengan memposting Ketentuan yang diperbarui di situs web kami atau melalui komunikasi lainnya. Penggunaan Layanan yang berkelanjutan setelah perubahan tersebut merupakan penerimaan Anda terhadap Ketentuan baru."}
            </p>

            <h2>10. Contact Information</h2>
            <p>
              {lang === "en"
                ? "If you have any questions about these Terms, please contact us at "
                : "Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami di "}
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
