"use client"

import { Button } from "@/components/ui/button"

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isLastStep: boolean
  isSubmitting?: boolean
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
  isSubmitting = false,
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
      <Button
        type="button"
        onClick={onPrevious}
        variant="outline"
        disabled={currentStep === 0 || isSubmitting}
        className="rounded-full px-6 h-11"
      >
        Previous
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="rounded-full px-6 h-11 relative overflow-hidden"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
      </Button>
    </div>
  )
}
