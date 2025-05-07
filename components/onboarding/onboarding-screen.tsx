"use client"

import type { ReactNode } from "react"

interface OnboardingScreenProps {
  children?: ReactNode
}

// This is a placeholder component that doesn't display anything
// It's kept to maintain compatibility with existing imports
export function OnboardingScreen({ children }: OnboardingScreenProps) {
  // Return children or null to avoid breaking any existing usage
  return children ? <>{children}</> : null
}

// For backward compatibility
export default OnboardingScreen
