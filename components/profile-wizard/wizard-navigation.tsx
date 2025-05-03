"use client"
import { useWizard } from "./wizard-context"
import { Button } from "@/components/ui/button"

interface WizardNavigationProps {
  onSave: () => void
  isSaving: boolean
}

export function WizardNavigation({ onSave, isSaving }: WizardNavigationProps) {
  const { prevStep, nextStep, isFirstStep, isLastStep } = useWizard()

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
