"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface IOSTabBarProps {
  tabs: TabItem[]
  activeTab?: string
  onChange?: (tabId: string) => void
  position?: "top" | "bottom"
  variant?: "filled" | "outline" | "pills"
  fullWidth?: boolean
  className?: string
}

export const IOSTabBar: React.FC<IOSTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  position = "top",
  variant = "filled",
  fullWidth = false,
  className = "",
}) => {
  const [activeTabId, setActiveTabId] = useState(activeTab || tabs[0]?.id)

  // Variant mapping
  const variantClasses = {
    filled: "bg-gray-100",
    outline: "border border-gray-200",
    pills: "space-x-2",
  }

  // Tab item variant mapping
  const tabItemVariantClasses = {
    filled: {
      active: "text-blue-600",
      inactive: "text-gray-500 hover:text-gray-700",
    },
    outline: {
      active: "text-blue-600 border-b-2 border-blue-600",
      inactive: "text-gray-500 hover:text-gray-700 border-b-2 border-transparent",
    },
    pills: {
      active: "bg-blue-100 text-blue-800",
      inactive: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    },
  }

  // Position mapping
  const positionClasses = {
    top: "border-b border-gray-200",
    bottom: "border-t border-gray-200",
  }

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
    if (onChange) {
      onChange(tabId)
    }
  }

  return (
    <div
      className={`
        ${position === "top" ? positionClasses.top : positionClasses.bottom}
        ${variant !== "pills" ? variantClasses[variant] : ""}
        ${className}
      `}
    >
      <nav
        className={`
          flex ${fullWidth ? "w-full" : ""}
          ${variant === "pills" ? variantClasses.pills : ""}
          ${position === "bottom" ? "pt-1" : ""}
        `}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              ${fullWidth ? "flex-1" : "px-4"}
              py-2.5 text-sm font-medium
              ${variant === "pills" ? "rounded-md px-3" : ""}
              ${
                activeTabId === tab.id ? tabItemVariantClasses[variant].active : tabItemVariantClasses[variant].inactive
              }
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            `}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center">
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </div>

            {variant === "filled" && activeTabId === tab.id && (
              <motion.div
                className="h-0.5 bg-blue-600 absolute bottom-0 left-0 right-0 mx-4"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    </div>
  )
}

export default IOSTabBar
