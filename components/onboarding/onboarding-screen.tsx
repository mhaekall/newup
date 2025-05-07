"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useHaptic } from "@/hooks/use-haptic"
import { useSession } from "next-auth/react"

interface OnboardingStep {
  title: string
  description: string
  image: string
  color: string
}

const steps: OnboardingStep[] = [
  {
    title: "Create Your Portfolio",
    description: "Build a professional portfolio in minutes without coding",
    image: "/onboarding/create.svg",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Showcase Your Skills",
    description: "Highlight your expertise and projects in a beautiful layout",
    image: "/onboarding/skills.svg",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Share With The World",
    description: "Get a personalized URL to share with employers and clients",
    image: "/onboarding/share.svg",
    color: "from-green-500 to-teal-600",
  },
]

export function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const router = useRouter()
  const haptic = useHaptic()
  const { data: session } = useSession()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (hasSeenOnboarding === "true") {
      setShowOnboarding(false)
    }
  }, [])

  const handleNext = () => {
    haptic.light()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    haptic.success()
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }

  const skipOnboarding = () => {
    haptic.medium()
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }

  if (!showOnboarding) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex flex-col h-full"
        >
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-full max-w-xs mb-8 relative`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className={`bg-gradient-to-br ${steps[currentStep].color} rounded-full p-6 aspect-square flex items-center justify-center mx-auto`}
              >
                <img
                  src={steps[currentStep].image || "/placeholder.svg"}
                  alt={steps[currentStep].title}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold mb-3"
            >
              {steps[currentStep].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 mb-8"
            >
              {steps[currentStep].description}
            </motion.p>

            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "w-8 bg-blue-500" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <Button
              onClick={handleNext}
              className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={skipOnboarding}
                className="w-full h-12 rounded-full text-gray-500 hover:text-gray-700"
              >
                Skip
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
