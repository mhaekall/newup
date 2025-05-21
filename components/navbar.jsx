import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"

export default async function Navbar({ lang, dict }) {
  const session = await getServerSession(authOptions)

  return (
    <header className="w-full py-4 px-4 sm:px-6 border-b bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={`/${lang}`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <LangSwitcher lang={lang} />
          {session ? (
            <Link href={`/${lang}/auth/signout`}>
              <Button variant="ghost" size="sm">
                {dict.auth.signout}
              </Button>
            </Link>
          ) : (
            <Link href={`/${lang}/auth/signin`}>
              <Button variant="ghost" size="sm">
                {dict.nav.signin}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
