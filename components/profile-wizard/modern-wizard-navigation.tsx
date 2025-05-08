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
  isMobile?: boolean
}

export function ModernWizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
  isSubmitting,
  isMobile = false,
}: ModernWizardNavigationProps) {
  return (
    <div className={`mt-8 flex items-center justify-between gap-3 ${isMobile ? "mb-24" : "mb-16"}`}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className={`h-11 rounded-l-full rounded-r-none px-5 border-r-0 ${
            currentStep === 0 ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {!isMobile && "Back"}
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
                {!isMobile ? "Save Profile" : "Save"}
              </>
            ) : (
              <>
                {!isMobile && "Next"}
                <ChevronRight className={`${isMobile ? "" : "ml-1"} h-4 w-4`} />
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Looqmy logo at right */}
      <span className="text-xl font-medium text-blue-500 hidden md:block" style={{ fontFamily: "'Pacifico', cursive" }}>
        looqmy
      </span>
    </div>
  )
}
