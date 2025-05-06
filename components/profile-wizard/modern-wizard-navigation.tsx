"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isNextDisabled?: boolean
  isPreviousDisabled?: boolean
  isSubmitting?: boolean
}

export function ModernWizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isPreviousDisabled = false,
  isSubmitting = false,
}: WizardNavigationProps) {
  const getStepLabel = useCallback((step: number) => {
    switch (step) {
      case 0:
        return "Basic Info"
      case 1:
        return "Links"
      case 2:
        return "Skills"
      case 3:
        return "Education"
      case 4:
        return "Experience"
      case 5:
        return "Projects"
      case 6:
        return "Template"
      default:
        return `Step ${step + 1}`
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col">
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1 rounded-full mb-6 mt-2">
          <motion.div
            className="bg-blue-500 h-1 rounded-full"
            initial={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isPreviousDisabled || currentStep === 0}
              className="rounded-l-full rounded-r-none border-r-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={isNextDisabled || isSubmitting || currentStep === totalSteps - 1}
              className="rounded-r-full rounded-l-none"
            >
              {isSubmitting ? "Saving..." : "Next"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps}: <span className="font-medium">{getStepLabel(currentStep)}</span>
            </span>

            {/* Looqmy logo */}
            <span
              className="text-xl font-medium text-blue-500 hidden md:block"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              looqmy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
