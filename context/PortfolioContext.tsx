"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Portfolio } from "@/types/portfolio"
import { useAutoSave } from "@/utils/auto-save"

interface PortfolioContextType {
  portfolio: Portfolio
  updatePortfolio: (data: Partial<Portfolio>) => void
  updateSection: <K extends keyof Portfolio>(section: K, data: Portfolio[K]) => void
  isSaving: boolean
  lastSaved: Date | null
  saveNow: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

// Mock save function - replace with actual API call
const savePortfolio = async (portfolio: Portfolio): Promise<void> => {
  console.log("Saving portfolio:", portfolio)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const PortfolioProvider: React.FC<{
  initialData: Portfolio
  children: React.ReactNode
}> = ({ initialData, children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialData)

  const updatePortfolio = useCallback((data: Partial<Portfolio>) => {
    setPortfolio((prev) => ({ ...prev, ...data }))
  }, [])

  const updateSection = useCallback(<K extends keyof Portfolio>(section: K, data: Portfolio[K]) => {
    setPortfolio((prev) => ({ ...prev, [section]: data }))
  }, [])

  const { isSaving, lastSaved, saveNow } = useAutoSave(portfolio, savePortfolio)

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        updatePortfolio,
        updateSection,
        isSaving,
        lastSaved,
        saveNow,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
