"use client"

import React from "react"
import { motion } from "framer-motion"

interface ProgressItemProps {
  title: string
  description?: string
  isActive?: boolean
  isCompleted?: boolean
  index: number
  variant?: "vertical" | "horizontal" | "circular"
  color?: string
}

const ProgressItem: React.FC<ProgressItemProps> = ({
  title,
  description,
  isActive = false,
  isCompleted = false,
  index,
  variant = "vertical",
  color = "bg-blue-500",
}) => {
  const getStatusColor = () => {
    if (isActive) return color
    if (isCompleted) return color
    return "bg-gray-200"
  }

  const getTextColor = () => {
    if (isActive) return "text-gray-900"
    if (isCompleted) return "text-gray-700"
    return "text-gray-400"
  }

  if (variant === "vertical") {
    return (
      <div className="flex items-start">
        <div className="relative flex flex-col items-center mr-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isActive ? 1.1 : 1 }}
            className={`${getStatusColor()} rounded-full h-6 w-6 flex items-center justify-center z-10`}
          >
            {isCompleted ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-xs text-white font-medium">{index + 1}</span>
            )}
          </motion.div>
          {index < 4 && <div className={`${isCompleted ? color : "bg-gray-200"} h-14 w-0.5 absolute top-6`}></div>}
        </div>
        <div className={`pt-0.5 ${isActive ? "opacity-100" : "opacity-80"}`}>
          <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>
          {description && <p className={`text-xs ${getTextColor()} mt-1`}>{description}</p>}
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: isActive ? 1.1 : 1 }}
          className={`${getStatusColor()} rounded-full h-8 w-8 flex items-center justify-center z-10`}
        >
          {isCompleted ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span className="text-xs text-white font-medium">{index + 1}</span>
          )}
        </motion.div>
        <div className="text-center mt-2">
          <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>
          {description && <p className={`text-xs ${getTextColor()} mt-1`}>{description}</p>}
        </div>
      </div>
    )
  }

  // Circular variant
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: isActive ? 1.1 : 1 }}
          className={`rounded-full h-16 w-16 flex items-center justify-center border-4 ${isActive || isCompleted ? `border-${color.replace("bg-", "")}` : "border-gray-200"}`}
        >
          <span
            className={`text-sm font-medium ${isActive || isCompleted ? `text-${color.replace("bg-", "")}` : "text-gray-400"}`}
          >
            {index + 1}
          </span>
        </motion.div>
      </div>
      <div className="text-center mt-2">
        <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>
        {description && <p className={`text-xs ${getTextColor()} mt-1`}>{description}</p>}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  items: { title: string; description?: string }[]
  currentStep: number
  variant?: "vertical" | "horizontal" | "circular"
  color?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  items,
  currentStep,
  variant = "vertical",
  color = "bg-blue-500",
}) => {
  if (variant === "vertical") {
    return (
      <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-sm">
        {items.map((item, index) => (
          <ProgressItem
            key={index}
            title={item.title}
            description={item.description}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
            index={index}
            variant={variant}
            color={color}
          />
        ))}
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className="flex justify-between w-full p-4 bg-white rounded-lg shadow-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ProgressItem
              title={item.title}
              description={item.description}
              isActive={index === currentStep}
              isCompleted={index < currentStep}
              index={index}
              variant={variant}
              color={color}
            />
            {index < items.length - 1 && (
              <div className="flex-1 flex items-center">
                <div className={`h-0.5 w-full ${index < currentStep ? color : "bg-gray-200"}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // Circular variant
  return (
    <div className="flex justify-between w-full p-4 bg-white rounded-lg shadow-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ProgressItem
            title={item.title}
            description={item.description}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
            index={index}
            variant={variant}
            color={color}
          />
          {index < items.length - 1 && (
            <div className="flex-1 flex items-center">
              <div className={`h-0.5 w-full ${index < currentStep ? color : "bg-gray-200"}`}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default ProgressBar
