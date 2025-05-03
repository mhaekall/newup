"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Profile } from "@/types"

interface WizardContextType {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
  currentStep: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  totalSteps: number
  isLastStep: boolean
  isFirstStep: boolean
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
  children: ReactNode
  initialData: Profile
  totalSteps: number
}

export function WizardProvider({ children, initialData, totalSteps }: WizardProviderProps) {
  const [profile, setProfile] = useState<Profile>(initialData)
  const [currentStep, setCurrentStep] = useState(0)

  const updateProfile = (data: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isLastStep = currentStep === totalSteps - 1
  const isFirstStep = currentStep === 0

  const value = {
    profile,
    updateProfile,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    totalSteps,
    isLastStep,
    isFirstStep,
  }

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}
