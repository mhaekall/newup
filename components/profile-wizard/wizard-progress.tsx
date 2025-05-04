"use client"

const steps = [
  { name: "Basic Info", description: "Your personal information" },
  { name: "Links", description: "Your social media links" },
  { name: "Education", description: "Your educational background" },
  { name: "Experience", description: "Your work experience" },
  { name: "Skills", description: "Your skills and expertise" },
  { name: "Projects", description: "Your portfolio projects" },
]

interface WizardProgressProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function WizardProgress({ currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="py-4">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between w-full overflow-x-auto pb-2 px-2">
          {steps.map((step, index) => (
            <li key={step.name} className={index <= currentStep ? "text-blue-600" : "text-gray-400"}>
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className={`group flex flex-col items-center ${
                  index <= currentStep ? "hover:text-blue-800" : "hover:text-gray-500"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    index < currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : index === currentStep
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300"
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span className="hidden sm:block text-xs mt-2 font-medium">{step.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
