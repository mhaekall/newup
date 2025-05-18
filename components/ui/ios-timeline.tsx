"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  content?: React.ReactNode
  date?: string
  icon?: React.ReactNode
  color?: string
}

interface IOSTimelineProps {
  items: TimelineItem[]
  className?: string
  animated?: boolean
}

export const IOSTimeline: React.FC<IOSTimelineProps> = ({ items, className = "", animated = true }) => {
  // Default color
  const defaultColor = "blue"

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      variants={containerVariants}
    >
      {items.map((item, index) => {
        const color = item.color || defaultColor
        const isLast = index === items.length - 1

        return (
          <motion.div key={item.id} className="relative pl-10 pb-8" variants={itemVariants}>
            {/* Timeline line */}
            {!isLast && (
              <div
                className={`absolute left-4 top-5 bottom-0 w-0.5 bg-${color}-200`}
                style={{ backgroundColor: `var(--${color}-200, #BFDBFE)` }}
              />
            )}

            {/* Timeline dot */}
            <div className="absolute left-0 top-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-${color}-100 ring-4 ring-white`}
                style={{
                  backgroundColor: `var(--${color}-100, #DBEAFE)`,
                  color: `var(--${color}-600, #2563EB)`,
                }}
              >
                {item.icon || (
                  <div
                    className={`w-3 h-3 rounded-full bg-${color}-600`}
                    style={{ backgroundColor: `var(--${color}-600, #2563EB)` }}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="pt-1">
              <div className="flex flex-wrap items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                {item.date && <time className="text-sm text-gray-500">{item.date}</time>}
              </div>

              {item.subtitle && <p className="text-base text-gray-600 mb-2">{item.subtitle}</p>}

              {item.content && <div className="text-gray-700">{item.content}</div>}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default IOSTimeline
