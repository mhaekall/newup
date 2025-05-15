"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface BannerProps {
  imageUrl?: string
  color?: string
  pattern?: "waves" | "geometric" | "gradient" | "none"
  height?: number
  className?: string
}

const Banner: React.FC<BannerProps> = ({
  imageUrl,
  color = "bg-gradient-to-r from-blue-500 to-purple-600",
  pattern = "waves",
  height = 150,
  className = "",
}) => {
  const getPatternStyle = () => {
    switch (pattern) {
      case "waves":
        return {
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='waves' patternUnits='userSpaceOnUse' width='100' height='20' patternTransform='rotate(0)'%3E%3Cpath d='M0 10 C 30 15, 70 5, 100 10 L 100 0 L 0 0' fill='%23ffffff10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23waves)'/%3E%3C/svg%3E\")",
          backgroundSize: "100px 20px",
        }
      case "geometric":
        return {
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }
      case "gradient":
        return {}
      default:
        return {}
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      {imageUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Profile banner"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      ) : (
        <div className={`w-full h-full ${color}`} style={getPatternStyle()}></div>
      )}
    </motion.div>
  )
}

export default Banner
