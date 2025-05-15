"use client"

import type React from "react"

interface IOSDividerProps {
  orientation?: "horizontal" | "vertical"
  className?: string
  label?: string
  labelPosition?: "start" | "center" | "end"
  color?: string
}

export const IOSDivider: React.FC<IOSDividerProps> = ({
  orientation = "horizontal",
  className = "",
  label,
  labelPosition = "center",
  color = "gray-200",
}) => {
  // Label position mapping
  const labelPositionClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  }

  if (orientation === "vertical") {
    return <div className={`inline-block h-full w-px bg-${color} ${className}`} />
  }

  if (label) {
    return (
      <div className={`flex items-center ${labelPositionClasses[labelPosition]} ${className}`}>
        <div className={`flex-grow h-px bg-${color}`} />
        <span
          className={`px-3 text-sm text-gray-500 ${labelPosition === "start" ? "pl-0" : ""} ${labelPosition === "end" ? "pr-0" : ""}`}
        >
          {label}
        </span>
        <div className={`flex-grow h-px bg-${color}`} />
      </div>
    )
  }

  return <div className={`h-px w-full bg-${color} ${className}`} />
}

export default IOSDivider
