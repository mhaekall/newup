"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { setLanguagePreference } from "@/lib/server-actions"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage, translations } = useLanguage()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggleLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage)
    await setLanguagePreference(newLanguage)
    router.refresh()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm" onClick={() => setIsOpen(!isOpen)}>
        <Globe className="h-4 w-4" />
        <span>{language === "id" ? "ID" : "EN"}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block px-4 py-2 text-sm w-full text-left ${language === "en" ? "bg-gray-100" : ""}`}
              onClick={() => toggleLanguage("en")}
            >
              English
            </button>
            <button
              className={`block px-4 py-2 text-sm w-full text-left ${language === "id" ? "bg-gray-100" : ""}`}
              onClick={() => toggleLanguage("id")}
            >
              Bahasa Indonesia
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
