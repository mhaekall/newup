"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface Step {
  id: string
  label: string
}

interface ProgressBarProps {
  steps: Step[]
  currentStep: string
  onStepClick: (stepId: string) => void
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep, onStepClick }) => {
  const progressRef = useRef<HTMLDivElement>(null)

  // Calculate progress percentage
  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  const progressPercentage = ((currentIndex + 1) / steps.length) * 100

  // Scroll to active step
  useEffect(() => {
    if (progressRef.current) {
      const activeStep = progressRef.current.querySelector(`[data-step="${currentStep}"]`)
      if (activeStep) {
        const container = progressRef.current
        const scrollLeft =
          (activeStep as HTMLElement).offsetLeft -
          container.offsetWidth / 2 +
          (activeStep as HTMLElement).offsetWidth / 2
        container.scrollTo({ left: scrollLeft, behavior: "smooth" })
      }
    }
  }, [currentStep])

  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div ref={progressRef} className="overflow-x-auto flex items-center gap-1 pb-2 hide-scrollbar">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = index < currentIndex

            return (
              <button
                key={step.id}
                data-step={step.id}
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : isCompleted
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="font-medium">{step.label}</span>
              </button>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
