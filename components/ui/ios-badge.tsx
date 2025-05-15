"use client"

import type React from "react"
import { motion } from "framer-motion"

interface IOSBadgeProps {
  children: React.ReactNode
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  variant?: "filled" | "outline" | "subtle"
  size?: "sm" | "md" | "lg"
  rounded?: boolean
  className?: string
  animated?: boolean
}

export const IOSBadge: React.FC<IOSBadgeProps> = ({
  children,
  color = "primary",
  variant = "filled",
  size = "md",
  rounded = false,
  className = "",
  animated = false,
}) => {
  // Color mapping
  const colorClasses = {
    primary: {
      filled: "bg-blue-500 text-white",
      outline: "border border-blue-500 text-blue-500",
      subtle: "bg-blue-100 text-blue-800",
    },
    secondary: {
      filled: "bg-gray-500 text-white",
      outline: "border border-gray-500 text-gray-500",
      subtle: "bg-gray-100 text-gray-800",
    },
    success: {
      filled: "bg-green-500 text-white",
      outline: "border border-green-500 text-green-500",
      subtle: "bg-green-100 text-green-800",
    },
    danger: {
      filled: "bg-red-500 text-white",
      outline: "border border-red-500 text-red-500",
      subtle: "bg-red-100 text-red-800",
    },
    warning: {
      filled: "bg-yellow-500 text-white",
      outline: "border border-yellow-500 text-yellow-500",
      subtle: "bg-yellow-100 text-yellow-800",
    },
    info: {
      filled: "bg-indigo-500 text-white",
      outline: "border border-indigo-500 text-indigo-500",
      subtle: "bg-indigo-100 text-indigo-800",
    },
  }

  // Size mapping
  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2.5",
    lg: "text-base py-1 px-3",
  }

  // Rounded mapping
  const roundedClasses = rounded ? "rounded-full" : "rounded-md"

  return (
    <motion.span
      className={`
        inline-flex items-center justify-center font-medium
        ${colorClasses[color][variant]} 
        ${sizeClasses[size]} 
        ${roundedClasses} 
        ${className}
      `}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.span>
  )
}

export default IOSBadge
