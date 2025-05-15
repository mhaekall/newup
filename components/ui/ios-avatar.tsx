"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface IOSAvatarProps {
  src?: string
  alt?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  border?: boolean
  borderColor?: string
  className?: string
  fallback?: string
  onClick?: () => void
}

export const IOSAvatar: React.FC<IOSAvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  border = false,
  borderColor = "white",
  className = "",
  fallback,
  onClick,
}) => {
  // Size mapping
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-2xl",
  }

  // Border classes
  const borderClasses = border ? `border-2 border-${borderColor}` : ""

  // Get initials from alt text
  const getInitials = () => {
    if (fallback) return fallback
    if (!alt) return "U"

    return alt
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <motion.div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 ${sizeClasses[size]} ${borderClasses} ${className}`}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      {src ? (
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      ) : (
        <span className="font-medium text-white">{getInitials()}</span>
      )}
    </motion.div>
  )
}

export default IOSAvatar
