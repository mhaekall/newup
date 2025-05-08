"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useHaptic } from "@/hooks/use-haptic"
import { X } from "lucide-react"

interface OnboardingStep {
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
}

const wizardSteps: OnboardingStep[] = [
  {
    title: "Welcome to Portfolio Builder",
    description: "Follow these steps to create your professional portfolio. Let's start with your basic information.",
    target: "[data-step='basic-info']",
    position: "bottom",
  },
  {
    title: "Add Your Social Links",
    description: "Connect your social media accounts and websites to help people find you online.",
    target: "[data-step='links']",
    position: "bottom",
  },
  {
    title: "Education History",
    description: "Share your academic background and achievements.",
    target: "[data-step='education']",
    position: "bottom",
  },
  {
    title: "Work Experience",
    description: "Highlight your professional experience and roles.",
    target: "[data-step='experience']",
    position: "bottom",
  },
  {
    title: "Showcase Your Skills",
    description: "List your technical and soft skills with proficiency levels.",
    target: "[data-step='skills']",
    position: "bottom",
  },
  {
    title: "Feature Your Projects",
    description: "Display your best work with descriptions and links.",
    target: "[data-step='projects']",
    position: "bottom",
  },
  {
    title: "Choose Your Template",
    description: "Select a design that best represents your personal brand.",
    target: "[data-step='template']",
    position: "bottom",
  },
]

export function WizardOnboarding({ currentStep, onClose }: { currentStep: number; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const haptic = useHaptic()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if user has already seen the onboarding
    const hasSeenWizardOnboarding = localStorage.getItem("hasSeenWizardOnboarding")
    if (hasSeenWizardOnboarding === "true") {
      setIsVisible(false)
      return
    }

    // Check if mobile
    setIsMobile(window.innerWidth < 768)

    // Find target element for current step
    const step = wizardSteps[currentStep]
    if (!step) return

    const element = document.querySelector(step.target) as HTMLElement
    setTargetElement(element)

    if (element) {
      // Calculate position for tooltip
      const rect = element.getBoundingClientRect()
      const position = calculatePosition(rect, step.position, isMobile)
      setPopupPosition(position)
    }

    // Add resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (element) {
        const rect = element.getBoundingClientRect()
        const position = calculatePosition(rect, step.position, window.innerWidth < 768)
        setPopupPosition(position)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentStep])

  const calculatePosition = (rect: DOMRect, position: "top" | "bottom" | "left" | "right", isMobile: boolean) => {
    const padding = isMobile ? 10 : 20 // Less padding on mobile
    const tooltipWidth = isMobile ? 280 : 300 // Smaller tooltip on mobile
    const tooltipHeight = 180

    // Ensure tooltip is visible on screen
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    switch (position) {
      case "bottom":
        let bottomLeft = rect.left + rect.width / 2 - tooltipWidth / 2
        // Ensure tooltip doesn't go off screen
        bottomLeft = Math.max(padding, Math.min(windowWidth - tooltipWidth - padding, bottomLeft))

        return {
          top: Math.min(rect.bottom + padding, windowHeight - tooltipHeight - padding),
          left: bottomLeft,
        }
      case "top":
        let topLeft = rect.left + rect.width / 2 - tooltipWidth / 2
        // Ensure tooltip doesn't go off screen
        topLeft = Math.max(padding, Math.min(windowWidth - tooltipWidth - padding, topLeft))

        return {
          top: Math.max(rect.top - tooltipHeight - padding, padding),
          left: topLeft,
        }
      case "left":
        return {
          top: Math.max(
            padding,
            Math.min(windowHeight - tooltipHeight - padding, rect.top + rect.height / 2 - tooltipHeight / 2),
          ),
          left: Math.max(padding, rect.left - tooltipWidth - padding),
        }
      case "right":
        return {
          top: Math.max(
            padding,
            Math.min(windowHeight - tooltipHeight - padding, rect.top + rect.height / 2 - tooltipHeight / 2),
          ),
          left: Math.min(rect.right + padding, windowWidth - tooltipWidth - padding),
        }
      default:
        return {
          top: Math.min(rect.bottom + padding, windowHeight - tooltipHeight - padding),
          left: Math.max(
            padding,
            Math.min(windowWidth - tooltipWidth - padding, rect.left + rect.width / 2 - tooltipWidth / 2),
          ),
        }
    }
  }

  const handleDismiss = () => {
    haptic.medium()
    setIsVisible(false)
    localStorage.setItem("hasSeenWizardOnboarding", "true")
    onClose()
  }

  if (!isVisible || !wizardSteps[currentStep]) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute z-50 bg-white rounded-lg shadow-xl p-4 pointer-events-auto"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            width: isMobile ? "280px" : "300px",
            maxWidth: "90vw",
          }}
        >
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleDismiss}>
            <X size={18} />
          </Button>

          <h3 className="text-lg font-semibold mb-2">{wizardSteps[currentStep].title}</h3>
          <p className="text-gray-600 mb-4">{wizardSteps[currentStep].description}</p>

          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {wizardSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep ? "w-6 bg-blue-500" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button size="sm" onClick={handleDismiss} className="bg-blue-500 hover:bg-blue-600">
              Got it
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
