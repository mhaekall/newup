import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"

export default function Footer({ lang, dict }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-6">
          <Logo />
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <Link href={`/${lang}/terms`} className="text-gray-600 hover:text-gray-900">
            {dict.footer.terms}
          </Link>
          <Link href={`/${lang}/privacy`} className="text-gray-600 hover:text-gray-900">
            {dict.footer.privacy}
          </Link>
          <a href="mailto:looqmy@outlook.co.id" className="text-gray-600 hover:text-gray-900">
            {dict.footer.contact}
          </a>
        </div>

        <div className="flex items-center justify-center mb-4">
          <LangSwitcher lang={lang} />
        </div>

        <p className="text-gray-500 text-center">
          © {new Date().getFullYear()} looqmy. {dict.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
