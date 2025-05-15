"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface IOSProgressProps {
  value: number
  max?: number
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  size?: "xs" | "sm" | "md" | "lg"
  showValue?: boolean
  valuePosition?: "inside" | "right"
  className?: string
  animated?: boolean
  striped?: boolean
  label?: string
}

export const IOSProgress: React.FC<IOSProgressProps> = ({
  value,
  max = 100,
  color = "primary",
  size = "md",
  showValue = false,
  valuePosition = "right",
  className = "",
  animated = true,
  striped = false,
  label,
}) => {
  const [width, setWidth] = useState(0)

  // Calculate percentage
  const percentage = (Math.min(Math.max(0, value), max) / max) * 100

  // Color mapping
  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-indigo-500",
  }

  // Size mapping
  const sizeClasses = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }

  // Striped effect
  const stripedClass = striped ? "bg-stripes" : ""

  useEffect(() => {
    if (animated) {
      setWidth(percentage)
    } else {
      setWidth(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && valuePosition === "right" && (
            <span className="text-sm font-medium text-gray-500">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full ${stripedClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={animated ? { type: "spring", stiffness: 100, damping: 20 } : { duration: 0 }}
        >
          {showValue && valuePosition === "inside" && percentage > 20 && (
            <span className="px-2 text-xs text-white">
              {value}/{max}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default IOSProgress
