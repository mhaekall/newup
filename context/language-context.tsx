"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

type Language = "en" | "id"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.signin": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.back": "Back",
    "nav.signout": "Sign Out",
    "nav.backToDashboard": "Back to Dashboard",

    // Home page
    "home.hero.title": "Create Your Professional Portfolio",
    "home.hero.titleHighlight": "in Minutes",
    "home.hero.subtitle":
      "No coding required. Just fill out a form and get a beautiful portfolio page that showcases your skills and projects.",
    "home.hero.cta": "Get Started",
    "home.hero.secondary": "How It Works",

    // Features section
    "features.title": "Features",
    "features.subtitle": "Everything you need to create a professional online presence",
    "features.easyToUse.title": "Easy to Use",
    "features.easyToUse.description":
      "Fill out a simple form with your information and get a professional portfolio in minutes.",
    "features.templates.title": "Beautiful Templates",
    "features.templates.description": "Choose from multiple professionally designed templates for your portfolio.",
    "features.free.title": "Free to Use",
    "features.free.description": "Create and share your professional portfolio completely free of charge.",

    // How it works section
    "howItWorks.title": "How It Works",
    "howItWorks.subtitle": "Create your professional portfolio in three simple steps",
    "howItWorks.step1.title": "Sign Up",
    "howItWorks.step1.description": "Create an account with your Google account in seconds.",
    "howItWorks.step2.title": "Fill Your Profile",
    "howItWorks.step2.description": "Add your information, skills, projects, and experience.",
    "howItWorks.step3.title": "Share Your Portfolio",
    "howItWorks.step3.description": "Get a personalized link to share with potential employers or clients.",
    "howItWorks.cta": "Get Started Now",

    // CTA section
    "cta.title": "Ready to showcase your work?",
    "cta.subtitle": "Create your professional portfolio today and share it with the world.",
    "cta.button": "Create Your Portfolio",

    // Footer
    "footer.product": "Product",
    "footer.features": "Features",
    "footer.howItWorks": "How It Works",
    "footer.getStarted": "Get Started",
    "footer.legal": "Legal",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.contact": "Contact",
    "footer.copyright": "All rights reserved.",
    "footer.tagline": "Create beautiful portfolios in minutes without coding.",

    // Dashboard
    "dashboard.editPortfolio": "Edit Portfolio",
    "dashboard.viewPortfolio": "View Portfolio",
    "dashboard.noPortfolio.title": "You don't have a portfolio yet",
    "dashboard.noPortfolio.description": "Create your portfolio to showcase your skills and projects",
    "dashboard.noPortfolio.cta": "Create Portfolio",
    "dashboard.quickTips": "Quick Tips",
    "dashboard.tip1": "Add your skills and projects to showcase your expertise",
    "dashboard.tip2": "Include your social media links to help people connect with you",
    "dashboard.tip3": "Upload a professional profile photo to make a good impression",
    "dashboard.totalViews": "Total Views",
    "dashboard.active": "Active",

    // Auth
    "auth.signin.title": "Sign in to your account",
    "auth.signin.google": "Sign in with Google",
    "auth.signin.agreement": "By signing in, you agree to our",
    "auth.signout": "Sign Out",

    // Terms & Privacy
    "legal.lastUpdated": "Last updated:",
    "legal.backToHome": "Back to Home",

    // Language
    language: "Language",
    "language.en": "English",
    "language.id": "Indonesian",
  },
  id: {
    // Navigation
    "nav.signin": "Masuk",
    "nav.getStarted": "Mulai",
    "nav.back": "Kembali",
    "nav.signout": "Keluar",
    "nav.backToDashboard": "Kembali ke Dasbor",

    // Home page
    "home.hero.title": "Buat Portofolio Profesional Anda",
    "home.hero.titleHighlight": "dalam Hitungan Menit",
    "home.hero.subtitle":
      "Tanpa perlu coding. Cukup isi formulir dan dapatkan halaman portofolio yang menampilkan keahlian dan proyek Anda.",
    "home.hero.cta": "Mulai Sekarang",
    "home.hero.secondary": "Cara Kerja",

    // Features section
    "features.title": "Fitur",
    "features.subtitle": "Semua yang Anda butuhkan untuk membuat kehadiran online profesional",
    "features.easyToUse.title": "Mudah Digunakan",
    "features.easyToUse.description":
      "Isi formulir sederhana dengan informasi Anda dan dapatkan portofolio profesional dalam hitungan menit.",
    "features.templates.title": "Template Menarik",
    "features.templates.description":
      "Pilih dari berbagai template yang dirancang secara profesional untuk portofolio Anda.",
    "features.free.title": "Gratis Digunakan",
    "features.free.description": "Buat dan bagikan portofolio profesional Anda secara gratis.",

    // How it works section
    "howItWorks.title": "Cara Kerja",
    "howItWorks.subtitle": "Buat portofolio profesional Anda dalam tiga langkah sederhana",
    "howItWorks.step1.title": "Daftar",
    "howItWorks.step1.description": "Buat akun dengan akun Google Anda dalam hitungan detik.",
    "howItWorks.step2.title": "Isi Profil Anda",
    "howItWorks.step2.description": "Tambahkan informasi, keahlian, proyek, dan pengalaman Anda.",
    "howItWorks.step3.title": "Bagikan Portofolio Anda",
    "howItWorks.step3.description": "Dapatkan tautan personal untuk dibagikan kepada calon pemberi kerja atau klien.",
    "howItWorks.cta": "Mulai Sekarang",

    // CTA section
    "cta.title": "Siap menampilkan karya Anda?",
    "cta.subtitle": "Buat portofolio profesional Anda hari ini dan bagikan dengan dunia.",
    "cta.button": "Buat Portofolio Anda",

    // Footer
    "footer.product": "Produk",
    "footer.features": "Fitur",
    "footer.howItWorks": "Cara Kerja",
    "footer.getStarted": "Mulai",
    "footer.legal": "Legal",
    "footer.terms": "Ketentuan Layanan",
    "footer.privacy": "Kebijakan Privasi",
    "footer.contact": "Kontak",
    "footer.copyright": "Hak cipta dilindungi.",
    "footer.tagline": "Buat portofolio indah dalam hitungan menit tanpa coding.",

    // Dashboard
    "dashboard.editPortfolio": "Edit Portofolio",
    "dashboard.viewPortfolio": "Lihat Portofolio",
    "dashboard.noPortfolio.title": "Anda belum memiliki portofolio",
    "dashboard.noPortfolio.description": "Buat portofolio Anda untuk menampilkan keahlian dan proyek Anda",
    "dashboard.noPortfolio.cta": "Buat Portofolio",
    "dashboard.quickTips": "Tips Cepat",
    "dashboard.tip1": "Tambahkan keahlian dan proyek Anda untuk menunjukkan keahlian Anda",
    "dashboard.tip2": "Sertakan tautan media sosial Anda untuk membantu orang terhubung dengan Anda",
    "dashboard.tip3": "Unggah foto profil profesional untuk memberikan kesan yang baik",
    "dashboard.totalViews": "Total Kunjungan",
    "dashboard.active": "Aktif",

    // Auth
    "auth.signin.title": "Masuk ke akun Anda",
    "auth.signin.google": "Masuk dengan Google",
    "auth.signin.agreement": "Dengan masuk, Anda menyetujui",
    "auth.signout": "Keluar",

    // Terms & Privacy
    "legal.lastUpdated": "Terakhir diperbarui:",
    "legal.backToHome": "Kembali ke Beranda",

    // Language
    language: "Bahasa",
    "language.en": "Inggris",
    "language.id": "Indonesia",
  },
}

// Create a default context value for server-side rendering
const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => {
    return translations.en[key as keyof typeof translations.en] || key
  },
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for language cookie first
    const savedLanguage = Cookies.get("language") as Language | undefined

    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "id")) {
      setLanguageState(savedLanguage)
      return
    }

    // If no cookie, try to detect browser language
    const browserLanguage = navigator.language.split("-")[0]
    if (browserLanguage === "id") {
      setLanguageState("id")
      Cookies.set("language", "id", { expires: 365 })
    } else {
      setLanguageState("en")
      Cookies.set("language", "en", { expires: 365 })
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    Cookies.set("language", lang, { expires: 365 })

    // Refresh the current page to apply translations
    router.refresh()
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
