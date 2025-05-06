"use client"

import { motion } from "framer-motion"

const steps = [
  { name: "Basic Info", description: "Profile details" },
  { name: "Links", description: "Social and contact links" },
  { name: "Education", description: "Academic background" },
  { name: "Experience", description: "Work history" },
  { name: "Skills", description: "Technical abilities" },
  { name: "Projects", description: "Portfolio projects" },
  { name: "Template", description: "Portfolio design" },
]

interface ModernWizardProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function ModernWizardProgress({ currentStep, onStepClick }: ModernWizardProgressProps) {
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`flex flex-col items-center relative ${
              index === steps.length - 1 ? "flex-grow-0" : "flex-grow"
            }`}
            onClick={() => onStepClick(index)}
          >
            <div className="flex flex-col items-center cursor-pointer group">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-blue-600 text-white"
                    : index === currentStep
                      ? "bg-white border-2 border-blue-600 text-blue-600"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  index <= currentStep ? "text-blue-600" : "text-gray-400"
                } group-hover:text-blue-800 hidden sm:block`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] absolute top-5 left-[calc(50%+20px)] right-[calc(50%-20px)] -translate-y-1/2 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
