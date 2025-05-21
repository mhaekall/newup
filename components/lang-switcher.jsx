"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { locales } from "@/i18n.config"

export default function LangSwitcher({ lang }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (newLocale) => {
    // Get the current path without the locale
    const currentPathname = pathname
    const segments = currentPathname.split("/")
    segments[1] = newLocale

    // Redirect to the same page with the new locale
    router.push(segments.join("/"))
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2" onClick={() => setIsOpen(!isOpen)}>
        <Globe className="h-4 w-4" />
        <span className="uppercase">{lang}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((locale) => (
              <button
                key={locale}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  locale === lang ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleLanguageChange(locale)}
              >
                {locale === "en" ? "English" : "Indonesia"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
