import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"

export default function DashboardFooter({ lang, dict }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-4">
          <Logo />
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <a href="mailto:looqmy@outlook.co.id" className="text-gray-600 hover:text-gray-900">
            {dict.footer.contact}
          </a>
          <LangSwitcher lang={lang} />
        </div>

        <p className="text-gray-500 text-center text-sm">
          © {new Date().getFullYear()} looqmy. {dict.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
