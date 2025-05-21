"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/context/language-context"

export default function LooqmyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  )
}
