"use client"

import type React from "react"
import { motion } from "framer-motion"

interface IOSCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  pressEffect?: boolean
  onClick?: () => void
}

export const IOSCard: React.FC<IOSCardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  pressEffect = true,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}
      whileHover={hoverEffect ? { y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : undefined}
      whileTap={pressEffect ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export default IOSCard
