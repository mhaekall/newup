import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import LangSwitcher from "@/components/lang-switcher"
import Footer from "@/components/footer"

export default async function Home({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
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

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              {dict.home.hero.title} <span className="text-blue-600">{dict.home.hero.titleHighlight}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{dict.home.hero.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${lang}/auth/signin`}>
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                  {dict.home.hero.cta}
                </Button>
              </Link>
              <Link href={`#how-it-works`}>
                <Button variant="outline" className="h-14 px-8 rounded-full text-lg font-medium w-full sm:w-auto">
                  {dict.home.hero.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{dict.features.title}</h2>

            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">{dict.features.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.features.easyToUse.title}</h3>
                <p className="text-gray-600">{dict.features.easyToUse.description}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.features.templates.title}</h3>
                <p className="text-gray-600">{dict.features.templates.description}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.features.free.title}</h3>
                <p className="text-gray-600">{dict.features.free.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{dict.howItWorks.title}</h2>

            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">{dict.howItWorks.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.howItWorks.step1.title}</h3>
                <p className="text-gray-600">{dict.howItWorks.step1.description}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.howItWorks.step2.title}</h3>
                <p className="text-gray-600">{dict.howItWorks.step2.description}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{dict.howItWorks.step3.title}</h3>
                <p className="text-gray-600">{dict.howItWorks.step3.description}</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href={`/${lang}/auth/signin`}>
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-blue-500 hover:bg-blue-600">
                  {dict.howItWorks.cta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{dict.cta.title}</h2>

            <p className="text-xl mb-8 opacity-90">{dict.cta.subtitle}</p>

            <div>
              <Link href={`/${lang}/auth/signin`}>
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-white text-blue-600 hover:bg-gray-100">
                  {dict.cta.button}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
