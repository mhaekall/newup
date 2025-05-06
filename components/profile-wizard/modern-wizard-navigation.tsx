"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface ModernWizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isLastStep: boolean
  isSubmitting: boolean
}

export function ModernWizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
  isSubmitting,
}: ModernWizardNavigationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3 mb-16">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`h-11 rounded-l-full rounded-r-none px-5 border-r-0 ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="h-11 rounded-l-none rounded-r-full px-5 bg-blue-500 hover:bg-blue-600"
        >
          {isSubmitting ? (
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          ) : isLastStep ? (
            <>
              <Save className="mr-1 h-4 w-4" />
              Save Profile
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
