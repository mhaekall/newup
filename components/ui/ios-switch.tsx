"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

interface IOSSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  className?: string
  label?: string
  labelPosition?: "left" | "right"
}

export const IOSSwitch: React.FC<IOSSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  color = "primary",
  className = "",
  label,
  labelPosition = "right",
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  // Size mapping
  const sizeClasses = {
    sm: {
      container: "w-8 h-4",
      circle: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      container: "w-11 h-6",
      circle: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      container: "w-14 h-7",
      circle: "w-6 h-6",
      translate: "translate-x-7",
    },
  }

  // Color mapping
  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-indigo-500",
  }

  // Disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  const handleChange = () => {
    if (disabled) return

    const newChecked = !isChecked
    setIsChecked(newChecked)

    if (onChange) {
      onChange(newChecked)
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      {label && labelPosition === "left" && <span className="mr-2 text-sm font-medium text-gray-700">{label}</span>}

      <motion.button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleChange}
        className={`
          relative inline-flex flex-shrink-0 rounded-full transition-colors ease-in-out duration-200
          ${isChecked ? colorClasses[color] : "bg-gray-200"}
          ${sizeClasses[size].container}
          ${disabledClasses}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
        `}
      >
        <span className="sr-only">Toggle</span>
        <motion.span
          className={`
            ${sizeClasses[size].circle}
            bg-white rounded-full shadow transform ring-0 transition ease-in-out duration-200
          `}
          initial={false}
          animate={{
            x: isChecked ? Number.parseInt(sizeClasses[size].translate.split("-x-")[1]) : 0.5,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>

      {label && labelPosition === "right" && <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>}
    </div>
  )
}

export default IOSSwitch
