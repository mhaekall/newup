import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"

export default async function SignIn({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-4 left-4">
        <Link href={`/${lang}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {dict.nav.back}
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <LangSwitcher lang={lang} />
      </div>

      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Logo className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{dict.auth.signin.title}</h2>
        </div>

        <div className="mt-8 space-y-4">
          <Button className="w-full h-12 rounded-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            {dict.auth.signin.google}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {dict.auth.signin.agreement}{" "}
            <Link href={`/${lang}/terms`} className="text-blue-600 hover:underline">
              {dict.footer.terms}
            </Link>{" "}
            {lang === "en" ? "and" : "dan"}{" "}
            <Link href={`/${lang}/privacy`} className="text-blue-600 hover:underline">
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
