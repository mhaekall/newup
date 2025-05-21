"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Logo } from "@/components/ui/logo"
import { useState } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

// Define template previews as a regular constant instead of using useMemo
// This avoids SSR issues with React hooks
const templatePreviews = [
  {
    id: "template1",
    name: "Professional",
    image: "/placeholder.svg?height=600&width=400",
    description: "Clean and professional design for corporate portfolios",
  },
  {
    id: "template2",
    name: "Creative",
    image: "/placeholder.svg?height=600&width=400",
    description: "Bold and creative design for artists and designers",
  },
  {
    id: "template3",
    name: "Minimal",
    image: "/placeholder.svg?height=600&width=400",
    description: "Simple and elegant design for a minimalist approach",
  },
]

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState(0)
  const { t } = useLanguage()

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                {t("nav.signin")}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">{t("nav.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative py-20 md:py-32 px-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-200 opacity-20"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: Math.random() * 10 + 10,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              {t("home.hero.title")} <span className="text-blue-600">{t("home.hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                  {t("home.hero.cta")}
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="h-14 px-8 rounded-full text-lg font-medium w-full sm:w-auto">
                  {t("home.hero.secondary")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 px-4 bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-center text-gray-900 mb-4">
              {t("features.title")}
            </motion.h2>

            <motion.p variants={fadeIn} className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {t("features.subtitle")}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("features.easyToUse.title")}</h3>
                <p className="text-gray-600">{t("features.easyToUse.description")}</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("features.templates.title")}</h3>
                <p className="text-gray-600">{t("features.templates.description")}</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("features.free.title")}</h3>
                <p className="text-gray-600">{t("features.free.description")}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          id="how-it-works"
          ref={howItWorksRef}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 px-4 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-center text-gray-900 mb-4">
              {t("howItWorks.title")}
            </motion.h2>

            <motion.p variants={fadeIn} className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {t("howItWorks.subtitle")}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("howItWorks.step1.title")}</h3>
                <p className="text-gray-600">{t("howItWorks.step1.description")}</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("howItWorks.step2.title")}</h3>
                <p className="text-gray-600">{t("howItWorks.step2.description")}</p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t("howItWorks.step3.title")}</h3>
                <p className="text-gray-600">{t("howItWorks.step3.description")}</p>
              </motion.div>
            </div>

            <motion.div variants={fadeIn} className="text-center mt-12">
              <Link href="/auth/signin">
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-blue-500 hover:bg-blue-600">
                  {t("howItWorks.cta")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 px-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-6">
              {t("cta.title")}
            </motion.h2>

            <motion.p variants={fadeIn} className="text-xl mb-8 opacity-90">
              {t("cta.subtitle")}
            </motion.p>

            <motion.div variants={fadeIn}>
              <Link href="/auth/signin">
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-white text-blue-600 hover:bg-gray-100">
                  {t("cta.button")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="mt-4 text-gray-600">{t("footer.tagline")}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">{t("footer.product")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-600 hover:text-gray-900">
                    {t("footer.features")}
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                    {t("footer.howItWorks")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                    {t("footer.getStarted")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                    {t("footer.privacy")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">{t("footer.contact")}</h3>
              <p className="text-gray-600">
                <a href="mailto:looqmy@outlook.co.id" className="text-blue-600 hover:underline">
                  looqmy@outlook.co.id
                </a>
              </p>
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} looqmy. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
