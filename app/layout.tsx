import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Pacifico } from "next/font/google"
import NextAuthProvider from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"

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
        <NextAuthProvider>
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}
