"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface SegmentedControlProps {
  options: string[]
  defaultIndex?: number
  onChange?: (selectedIndex: number) => void
  className?: string
}

export const IOSSegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  defaultIndex = 0,
  onChange,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const [segmentWidth, setSegmentWidth] = useState(0)
  const [segmentOffsets, setSegmentOffsets] = useState<number[]>([])

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const newSegmentWidth = containerWidth / options.length
      setSegmentWidth(newSegmentWidth)

      // Calculate offsets for each segment
      const offsets = options.map((_, index) => index * newSegmentWidth)
      setSegmentOffsets(offsets)
    }
  }, [options.length])

  const handleSegmentClick = (index: number) => {
    setSelectedIndex(index)
    if (onChange) {
      onChange(index)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-200 rounded-lg p-1 ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      }}
    >
      {/* Background selector */}
      {segmentWidth > 0 && (
        <motion.div
          className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm z-0"
          initial={false}
          animate={{
            x: segmentOffsets[selectedIndex],
            width: segmentWidth - 8,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}

      {/* Segments */}
      {options.map((option, index) => (
        <button
          key={index}
          className={`relative z-10 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selectedIndex === index ? "text-gray-900" : "text-gray-500"
          }`}
          onClick={() => handleSegmentClick(index)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default IOSSegmentedControl
