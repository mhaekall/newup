import { Inter, Pacifico } from "next/font/google"
import { getDictionary } from "@/lib/dictionary"
import QueryProvider from "@/components/providers/query-provider"
import { Suspense } from "react"
import { PageLoading } from "@/components/ui/page-loading"

const inter = Inter({ subsets: ["latin"] })
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
})

export async function generateMetadata({ params }) {
  const { lang } = params
  const dictionary = await getDictionary(lang)

  return {
    title: "looqmy",
    description: dictionary.home.hero.subtitle,
  }
}

export default async function RootLayout({ children, params }) {
  const { lang } = params

  return (
    <html lang={lang}>
      <body className={`${inter.className} ${pacifico.variable}`}>
        <QueryProvider>
          <Suspense fallback={<PageLoading />}>{children}</Suspense>
        </QueryProvider>
      </body>
    </html>
  )
}

import "../globals.css"
