"use client"

import type React from "react"
import "./globals.css"
import NextAuthProvider from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"
import { initializeStorage } from "@/lib/init-storage"
import { useEffect } from "react"

export default function LooqmyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize storage
    initializeStorage()
  }, [])
  return (
    <NextAuthProvider>
      {children}
      <Toaster />
    </NextAuthProvider>
  )
}
