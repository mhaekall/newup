import type React from "react"
import type { Metadata } from "next"
import { Inter, Pacifico } from "next/font/google"
import LooqmyLayout from "./looqmy-layout"
import QueryProvider from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
})

export const metadata: Metadata = {
  title: "looqmy",
  description: "Build your portfolio with looqmy",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${pacifico.variable}`}>
        <QueryProvider>
          <LooqmyLayout>{children}</LooqmyLayout>
        </QueryProvider>
      </body>
    </html>
  )
}

import "./globals.css"
