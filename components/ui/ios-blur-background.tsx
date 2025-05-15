"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface IOSBlurBackgroundProps {
  children: React.ReactNode
  intensity?: number
  className?: string
  color?: string
}

export const IOSBlurBackground: React.FC<IOSBlurBackgroundProps> = ({
  children,
  intensity = 10,
  className = "",
  color = "rgba(255, 255, 255, 0.8)",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add iOS-like blur effect
    container.style.backdropFilter = `blur(${intensity}px)`
    container.style.WebkitBackdropFilter = `blur(${intensity}px)`

    // Add subtle animation on mount
    container.animate(
      [
        { opacity: 0, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      },
    )
  }, [intensity])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  )
}

export default IOSBlurBackground
