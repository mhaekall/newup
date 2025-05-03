"use client"
import { Button } from "@/components/ui/button"

interface WizardNavigationProps {
  onSave: () => void
  isSaving: boolean
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardNavigation({
  onSave,
  isSaving,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
}: WizardNavigationProps) {
  const prevStep = () => {
    if (currentStep > 0) {
      window.history.pushState({}, "", `?step=${currentStep - 1}`)
      window.dispatchEvent(new Event("popstate"))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      window.history.pushState({}, "", `?step=${currentStep + 1}`)
      window.dispatchEvent(new Event("popstate"))
    }
  }

  return (
    <div className="flex justify-between mt-8">
      <Button type="button" onClick={prevStep} variant="outline" disabled={isFirstStep}>
        Previous
      </Button>

      {isLastStep ? (
        <Button type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      ) : (
        <Button type="button" onClick={nextStep}>
          Next
        </Button>
      )}
    </div>
  )
}
