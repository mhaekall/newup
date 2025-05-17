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
}

interface IOSTimelineProps {
  items: TimelineItem[]
  animated?: boolean
  className?: string
}

export function IOSTimeline({ items, animated = true, className = "" }: IOSTimelineProps) {
  const colorMap = {
    blue: "bg-blue-500 border-blue-100",
    green: "bg-green-500 border-green-100",
    red: "bg-red-500 border-red-100",
    yellow: "bg-yellow-500 border-yellow-100",
    purple: "bg-purple-500 border-purple-100",
    gray: "bg-gray-500 border-gray-100",
  }

  return (
    <div className={`relative ${className}`}>
      {items.length > 0 ? (
        <div className="space-y-0 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-3 md:left-4 top-2 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative pb-8 last:pb-0"
              initial={animated ? { opacity: 0, x: -10 } : undefined}
              animate={animated ? { opacity: 1, x: 0 } : undefined}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              {/* Timeline dot - positioned on the line */}
              <div className="absolute left-3 md:left-4 top-2 w-6 h-6 flex items-center justify-center transform -translate-x-1/2">
                <div className={`w-4 h-4 rounded-full border-4 z-10 ${colorMap[item.color || "blue"]}`}></div>
              </div>

              <div className="ml-10 md:ml-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
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
