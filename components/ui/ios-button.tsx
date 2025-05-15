"use client"

import type React from "react"
import { motion } from "framer-motion"

interface IOSButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "filled" | "outline" | "text"
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  className?: string
  rounded?: boolean
  type?: "button" | "submit" | "reset"
}

export const IOSButton: React.FC<IOSButtonProps> = ({
  children,
  onClick,
  variant = "filled",
  color = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
  rounded = false,
  type = "button",
}) => {
  // Color mapping
  const colorClasses = {
    primary: {
      filled: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
      text: "text-blue-500 hover:bg-blue-50",
    },
    secondary: {
      filled: "bg-gray-500 text-white hover:bg-gray-600",
      outline: "border border-gray-500 text-gray-500 hover:bg-gray-50",
      text: "text-gray-500 hover:bg-gray-50",
    },
    success: {
      filled: "bg-green-500 text-white hover:bg-green-600",
      outline: "border border-green-500 text-green-500 hover:bg-green-50",
      text: "text-green-500 hover:bg-green-50",
    },
    danger: {
      filled: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-red-500 text-red-500 hover:bg-red-50",
      text: "text-red-500 hover:bg-red-50",
    },
    warning: {
      filled: "bg-yellow-500 text-white hover:bg-yellow-600",
      outline: "border border-yellow-500 text-yellow-500 hover:bg-yellow-50",
      text: "text-yellow-500 hover:bg-yellow-50",
    },
    info: {
      filled: "bg-indigo-500 text-white hover:bg-indigo-600",
      outline: "border border-indigo-500 text-indigo-500 hover:bg-indigo-50",
      text: "text-indigo-500 hover:bg-indigo-50",
    },
  }

  // Size mapping
  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
  }

  // Rounded mapping
  const roundedClasses = rounded ? "rounded-full" : "rounded-lg"

  // Disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colorClasses[color][variant]} 
        ${sizeClasses[size]} 
        ${roundedClasses} 
        ${disabledClasses}
        ${fullWidth ? "w-full" : ""}
        font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
        ${className}
      `}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <span className="flex items-center justify-center">
        {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </span>
    </motion.button>
  )
}

export default IOSButton
