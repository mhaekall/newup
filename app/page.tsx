"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Logo } from "@/components/ui/logo"
import { useState } from "react"

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

const templateVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

// Template preview data
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

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [templatesRef, templatesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Get Started</Button>
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
              Create Your Professional Portfolio <span className="text-blue-600">in Minutes</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              No coding required. Just fill out a form and get a beautiful portfolio page that showcases your skills and
              projects.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="#templates">
                <Button variant="outline" className="h-14 px-8 rounded-full text-lg font-medium w-full sm:w-auto">
                  View Templates
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
              Features
            </motion.h2>

            <motion.p variants={fadeIn} className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Everything you need to create a professional online presence
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Fill out a simple form with your information and get a professional portfolio in minutes.
                </p>
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">Beautiful Templates</h3>
                <p className="text-gray-600">
                  Choose from multiple professionally designed templates for your portfolio.
                </p>
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
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Customizable</h3>
                <p className="text-gray-600">
                  Customize your portfolio with your own colors, fonts, and layout options.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Templates Preview Section */}
        <motion.section
          id="templates"
          ref={templatesRef}
          initial="hidden"
          animate={templatesInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 px-4 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-center text-gray-900 mb-4">
              Beautiful Templates
            </motion.h2>

            <motion.p variants={fadeIn} className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Choose from our professionally designed templates to showcase your work
            </motion.p>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <motion.div
                  className="relative rounded-lg overflow-hidden shadow-xl border border-gray-200"
                  variants={templateVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Image
                    src={templatePreviews[activeTemplate].image || "/placeholder.svg"}
                    alt={templatePreviews[activeTemplate].name}
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">{templatePreviews[activeTemplate].name}</h3>
                    <p className="text-white/80">{templatePreviews[activeTemplate].description}</p>
                  </div>
                </motion.div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <motion.h3 variants={fadeIn} className="text-2xl font-bold text-gray-900">
                  Choose Your Style
                </motion.h3>

                <motion.p variants={fadeIn} className="text-gray-600">
                  Our templates are designed to showcase your work in the best possible way. Each template is fully
                  customizable to match your personal brand.
                </motion.p>

                <div className="space-y-4">
                  {templatePreviews.map((template, index) => (
                    <motion.div
                      key={template.id}
                      variants={fadeIn}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        activeTemplate === index
                          ? "bg-blue-50 border-blue-200 border"
                          : "bg-white border border-gray-200 hover:border-blue-200"
                      }`}
                      onClick={() => setActiveTemplate(index)}
                    >
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={fadeIn}>
                  <Link href="/auth/signin">
                    <Button className="w-full sm:w-auto">Try This Template</Button>
                  </Link>
                </motion.div>
              </div>
            </div>
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
              Ready to showcase your work?
            </motion.h2>

            <motion.p variants={fadeIn} className="text-xl mb-8 opacity-90">
              Create your professional portfolio today and share it with the world.
            </motion.p>

            <motion.div variants={fadeIn}>
              <Link href="/auth/signin">
                <Button className="h-14 px-8 rounded-full text-lg font-medium bg-white text-blue-600 hover:bg-gray-100">
                  Create Your Portfolio
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
              <p className="mt-4 text-gray-600">Create beautiful portfolios in minutes without coding.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="text-gray-600 hover:text-gray-900">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600">
                Have questions or feedback?
                <br />
                <a href="mailto:moehamadhkl@gmail.com" className="text-blue-600 hover:underline">
                  moehamadhkl@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2025 looqmy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
