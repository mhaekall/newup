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

  useEffect(() => {
    // Check if user has already seen the onboarding
    const hasSeenWizardOnboarding = localStorage.getItem("hasSeenWizardOnboarding")
    if (hasSeenWizardOnboarding === "true") {
      setIsVisible(false)
      return
    }

    // Find target element for current step
    const step = wizardSteps[currentStep]
    if (!step) return

    const element = document.querySelector(step.target) as HTMLElement
    setTargetElement(element)

    if (element) {
      // Calculate position for tooltip
      const rect = element.getBoundingClientRect()
      const position = calculatePosition(rect, step.position)
      setPopupPosition(position)
    }
  }, [currentStep])

  const calculatePosition = (rect: DOMRect, position: "top" | "bottom" | "left" | "right") => {
    const padding = 20 // Distance from the element

    switch (position) {
      case "bottom":
        return {
          top: rect.bottom + padding,
          left: rect.left + rect.width / 2 - 150, // Center tooltip
        }
      case "top":
        return {
          top: rect.top - 180 - padding, // Tooltip height + padding
          left: rect.left + rect.width / 2 - 150,
        }
      case "left":
        return {
          top: rect.top + rect.height / 2 - 90,
          left: rect.left - 300 - padding,
        }
      case "right":
        return {
          top: rect.top + rect.height / 2 - 90,
          left: rect.right + padding,
        }
      default:
        return {
          top: rect.bottom + padding,
          left: rect.left + rect.width / 2 - 150,
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
        <div className="absolute inset-0 bg-black/30" />

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute z-50 bg-white rounded-lg shadow-xl p-4 w-[300px] pointer-events-auto"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
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
