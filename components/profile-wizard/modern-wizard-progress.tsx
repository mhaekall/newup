"use client"

import { motion } from "framer-motion"
import { User, Link, School, Briefcase, Star, Code, Layout } from "lucide-react"

interface ModernWizardProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function ModernWizardProgress({ currentStep, onStepClick }: ModernWizardProgressProps) {
  const steps = [
    { name: "Basic Info", icon: User },
    { name: "Links", icon: Link },
    { name: "Education", icon: School },
    { name: "Experience", icon: Briefcase },
    { name: "Skills", icon: Star },
    { name: "Projects", icon: Code },
    { name: "Template", icon: Layout },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 z-10">
      <div className="flex justify-center">
        <div className="flex items-center justify-between w-full max-w-md">
          {steps.map((step, index) => {
            const isActive = currentStep === index
            const isPast = currentStep > index
            const StepIcon = step.icon

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => onStepClick(index)}
                className={`relative flex flex-col items-center justify-center ${
                  isActive || isPast ? "text-blue-500" : "text-gray-400"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500"
                      : isPast
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className="sr-only">{step.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
