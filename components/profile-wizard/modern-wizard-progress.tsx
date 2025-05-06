"use client"

import { motion } from "framer-motion"

interface ModernWizardProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function ModernWizardProgress({ currentStep, onStepClick }: ModernWizardProgressProps) {
  const steps = [
    { id: 0, label: "Basic" },
    { id: 1, label: "Links" },
    { id: 2, label: "Education" },
    { id: 3, label: "Experience" },
    { id: 4, label: "Skills" },
    { id: 5, label: "Projects" },
    { id: 6, label: "Preview" },
  ]

  // Calculate progress percentage
  const progressPercentage = (currentStep / (steps.length - 1)) * 100

  return (
    <div className="px-4 pt-4 sm:px-6 sm:pt-6">
      {/* Progress bar */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="mt-4 flex justify-between">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className="group flex flex-col items-center"
            aria-current={currentStep === step.id ? "step" : undefined}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 ${
                step.id < currentStep
                  ? "border-blue-500 bg-blue-500 text-white"
                  : step.id === currentStep
                    ? "border-blue-500 bg-white text-blue-500"
                    : "border-gray-300 bg-white text-gray-400"
              } ${step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              {step.id < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{step.id + 1}</span>
              )}
            </div>
            <span
              className={`mt-1 hidden text-xs font-medium transition-colors duration-200 sm:block ${
                step.id === currentStep ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
