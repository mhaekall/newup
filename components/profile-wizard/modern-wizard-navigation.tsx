"use client"

import { motion } from "framer-motion"

interface ModernWizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isLastStep: boolean
  isSubmitting?: boolean
}

export function ModernWizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
  isSubmitting = false,
}: ModernWizardNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
      <motion.button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 0 || isSubmitting}
        className={`rounded-full px-8 py-4 text-lg font-medium transition-all ${
          currentStep === 0 || isSubmitting
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md"
        }`}
        whileHover={currentStep !== 0 && !isSubmitting ? { scale: 1.05 } : {}}
        whileTap={currentStep !== 0 && !isSubmitting ? { scale: 0.95 } : {}}
      >
        Previous
      </motion.button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className={`rounded-full px-8 py-4 text-lg font-medium transition-all ${
          isSubmitting
            ? "bg-blue-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
        }`}
        whileHover={!isSubmitting ? { scale: 1.05 } : {}}
        whileTap={!isSubmitting ? { scale: 0.95 } : {}}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : isLastStep ? (
          "Finish"
        ) : (
          "Next"
        )}
      </motion.button>
    </div>
  )
}
