"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getLanguagePreference } from "@/lib/server-actions"
import { en } from "@/translations/en"
import { id } from "@/translations/id"

// Create translations object
const translations = {
  en,
  id,
}

type LanguageContextType = {
  language: string
  setLanguage: (language: string) => void
  translations: Record<string, string>
  t: (key: string) => string
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translations: translations.en,
  t: (key: string) => key,
})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Function to translate text
  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.en
    return currentTranslations[key] || key
  }

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Try to get language from cookie first
        const cookieLanguage = await getLanguagePreference()

        if (cookieLanguage) {
          setLanguage(cookieLanguage)
        } else {
          // Fallback to browser language
          const browserLanguage = navigator.language.split("-")[0]
          setLanguage(browserLanguage === "id" ? "id" : "en")
        }
      } catch (error) {
        console.error("Error detecting language:", error)
        // Default to English if there's an error
        setLanguage("en")
      } finally {
        setIsLoading(false)
      }
    }

    detectLanguage()
  }, [])

  const contextValue = {
    language,
    setLanguage,
    translations: translations[language as keyof typeof translations] || translations.en,
    t,
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}
