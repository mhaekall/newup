"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: "top" | "right" | "bottom" | "left"
  trigger?: "hover" | "click"
  delay?: number
  className?: string
  contentClassName?: string
  arrow?: boolean
}

export const IOSTooltip: React.FC<IOSTooltipProps> = ({
  children,
  content,
  position = "top",
  trigger = "hover",
  delay = 300,
  className = "",
  contentClassName = "",
  arrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Position mapping for animations
  const positionVariants = {
    top: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
    },
    bottom: {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: 10 },
      visible: { opacity: 1, x: 0 },
    },
  }

  // Position mapping for tooltip placement
  const getTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return { top: 0, left: 0 }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    const positions = {
      top: {
        top: triggerRect.top - tooltipRect.height - 8,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      },
      right: {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + 8,
      },
      bottom: {
        top: triggerRect.bottom + 8,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      },
      left: {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - 8,
      },
    }

    return positions[position]
  }

  // Arrow position mapping
  const getArrowPosition = () => {
    switch (position) {
      case "top":
        return "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"
      case "right":
        return "left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rotate-45"
      case "bottom":
        return "top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
      case "left":
        return "right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 rotate-45"
      default:
        return "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"
    }
  }

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsVisible(false)
  }

  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip()
    } else {
      showTooltip()
    }
  }

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const position = getTooltipPosition()
      setCoords(position)
    }
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener("scroll", updatePosition)
      window.addEventListener("resize", updatePosition)
    }

    return () => {
      window.removeEventListener("scroll", updatePosition)
      window.removeEventListener("resize", updatePosition)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isVisible])

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${className}`}
      onMouseEnter={trigger === "hover" ? showTooltip : undefined}
      onMouseLeave={trigger === "hover" ? hideTooltip : undefined}
      onClick={trigger === "click" ? toggleTooltip : undefined}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className="fixed z-50"
            style={{ top: coords.y, left: coords.x }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={positionVariants[position]}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`
                bg-gray-900 text-white text-sm rounded-lg py-1.5 px-3 shadow-lg
                ${contentClassName}
              `}
            >
              {content}
              {arrow && <div className={`absolute w-2 h-2 bg-gray-900 ${getArrowPosition()}`} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default IOSTooltip
