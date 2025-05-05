"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { usePortfolio } from "@/context/PortfolioContext"

interface SectionContainerProps {
  id: string
  title: string
  children: React.ReactNode
  isActive: boolean
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ id, title, children, isActive }) => {
  const [isExpanded, setIsExpanded] = useState(isActive)
  const { isSaving, lastSaved } = usePortfolio()
  const sectionRef = useRef<HTMLDivElement>(null)

  // Expand section when it becomes active
  useEffect(() => {
    if (isActive && !isExpanded) {
      setIsExpanded(true)
    }
  }, [isActive, isExpanded])

  // Scroll into view when active
  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [isActive])

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 ${
        isActive ? "ring-2 ring-blue-100" : ""
      }`}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          {lastSaved && <span className="text-xs text-gray-500">Saved at {formatLastSaved(lastSaved)}</span>}
          {isSaving && (
            <span className="flex items-center text-xs text-blue-500">
              <svg
                className="animate-spin -ml-1 mr-2 h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 border-t border-gray-100">{children}</div>
      </div>
    </section>
  )
}
