"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray"
  tags?: string[]
}

interface IOSTimelineAdvancedProps {
  items: TimelineItem[]
  animated?: boolean
  className?: string
  lineColor?: string
  dotSize?: "sm" | "md" | "lg"
  cardStyle?: "flat" | "elevated" | "bordered"
}

export function IOSTimelineAdvanced({
  items,
  animated = true,
  className = "",
  lineColor = "bg-gray-200 dark:bg-gray-700",
  dotSize = "md",
  cardStyle = "elevated",
}: IOSTimelineAdvancedProps) {
  const colorMap = {
    blue: "bg-blue-500 border-blue-100",
    green: "bg-green-500 border-green-100",
    red: "bg-red-500 border-red-100",
    yellow: "bg-yellow-500 border-yellow-100",
    purple: "bg-purple-500 border-purple-100",
    gray: "bg-gray-500 border-gray-100",
  }

  const dotSizeMap = {
    sm: {
      dot: "w-3 h-3",
      wrapper: "w-5 h-5",
      left: "left-[-10px] md:left-[-12px]",
    },
    md: {
      dot: "w-4 h-4",
      wrapper: "w-6 h-6",
      left: "left-[-13px] md:left-[-18px]",
    },
    lg: {
      dot: "w-5 h-5",
      wrapper: "w-8 h-8",
      left: "left-[-16px] md:left-[-20px]",
    },
  }

  const cardStyleMap = {
    flat: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-sm",
    bordered: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  }

  return (
    <div className={`relative ${className}`}>
      {items.length > 0 ? (
        <div className="space-y-0 relative">
          {/* Vertical timeline line */}
          <div className={`absolute left-3 md:left-4 top-2 bottom-0 w-0.5 ${lineColor} rounded-full`}></div>

          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative pb-8 last:pb-0"
              initial={animated ? { opacity: 0, x: -10 } : undefined}
              animate={animated ? { opacity: 1, x: 0 } : undefined}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              {/* Timeline dot */}
              <div
                className={`absolute ${dotSizeMap[dotSize].left} top-2 ${dotSizeMap[dotSize].wrapper} flex items-center justify-center`}
              >
                <div
                  className={`${dotSizeMap[dotSize].dot} rounded-full border-4 z-10 ${colorMap[item.color || "blue"]}`}
                ></div>
              </div>

              <div className={`ml-10 md:ml-12 rounded-2xl p-6 ${cardStyleMap[cardStyle]}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                    {item.subtitle && <p className="text-gray-600 dark:text-gray-300">{item.subtitle}</p>}
                  </div>
                  {item.date && (
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                    </div>
                  )}
                </div>

                {item.content && <div className="mt-4">{item.content}</div>}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No items to display</p>
        </div>
      )}
    </div>
  )
}
