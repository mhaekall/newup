import type React from "react"

interface Step {
  title: string
  description: string
  completed: boolean
  active: boolean
}

interface ProgressTimelineProps {
  steps: Step[]
  variant?: "primary" | "secondary" | "success" | "info"
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ steps, variant = "primary" }) => {
  // Menentukan warna berdasarkan variant
  const getColorClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-purple-500"
      case "success":
        return "bg-green-500"
      case "info":
        return "bg-cyan-500"
      case "primary":
      default:
        return "bg-blue-500"
    }
  }

  const getTextColorClass = () => {
    switch (variant) {
      case "secondary":
        return "text-purple-500"
      case "success":
        return "text-green-500"
      case "info":
        return "text-cyan-500"
      case "primary":
      default:
        return "text-blue-500"
    }
  }

  const getBorderColorClass = () => {
    switch (variant) {
      case "secondary":
        return "border-purple-500"
      case "success":
        return "border-green-500"
      case "info":
        return "border-cyan-500"
      case "primary":
      default:
        return "border-blue-500"
    }
  }

  return (
    <div className="relative flex flex-col space-y-2 py-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start">
          {/* Circle indicator */}
          <div className="relative flex items-center justify-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center z-10
                ${step.completed || step.active ? getColorClass() : "bg-gray-200"}
              `}
            >
              {step.completed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-white font-medium">{index + 1}</span>
              )}
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  absolute top-8 left-4 w-0.5 h-full -ml-px
                  ${steps[index + 1].completed || steps[index + 1].active ? getColorClass() : "bg-gray-200"}
                `}
              />
            )}
          </div>

          {/* Content */}
          <div className={`ml-4 pb-8 ${index === steps.length - 1 ? "pb-0" : ""}`}>
            <h3 className={`font-semibold ${step.completed || step.active ? getTextColorClass() : "text-gray-500"}`}>
              {step.title}
            </h3>
            <p className={`text-sm ${step.completed || step.active ? "text-gray-700" : "text-gray-400"}`}>
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Komponen alternatif dengan gaya berbeda untuk template lain
export const CircleProgressBar: React.FC<{
  percentage: number
  size?: number
  strokeWidth?: number
  variant?: "primary" | "secondary" | "success" | "info"
  showPercentage?: boolean
  label?: string
}> = ({ percentage, size = 120, strokeWidth = 10, variant = "primary", showPercentage = true, label }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const dash = (percentage * circumference) / 100

  // Menentukan warna berdasarkan variant
  const getColor = () => {
    switch (variant) {
      case "secondary":
        return "#9333ea" // purple-600
      case "success":
        return "#10b981" // green-500
      case "info":
        return "#06b6d4" // cyan-500
      case "primary":
      default:
        return "#3b82f6" // blue-500
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb" // gray-200
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - dash}
            strokeLinecap="round"
          />
        </svg>

        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>

      {label && <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>}
    </div>
  )
}

// Komponen progress bar horizontal untuk template lain
export const HorizontalProgressBar: React.FC<{
  percentage: number
  label?: string
  variant?: "primary" | "secondary" | "success" | "info"
  height?: number
  showPercentage?: boolean
}> = ({ percentage, label, variant = "primary", height = 8, showPercentage = true }) => {
  // Menentukan warna berdasarkan variant
  const getColorClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-purple-500"
      case "success":
        return "bg-green-500"
      case "info":
        return "bg-cyan-500"
      case "primary":
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && <span className="text-sm font-medium text-gray-500">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full`} style={{ height }}>
        <div
          className={`${getColorClass()} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%`, height }}
        />
      </div>
    </div>
  )
}
