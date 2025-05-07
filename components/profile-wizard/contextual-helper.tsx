"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Info } from "lucide-react"
import { useState } from "react"

interface ContextualHelperProps {
  step: number
}

const helperMessages = [
  {
    title: "Profile Basics",
    message: "Start with your name, photo, and a brief bio. A friendly profile photo makes a great first impression!",
  },
  {
    title: "Connect Your Socials",
    message: "Add your social media links so visitors can follow your work and connect with you directly.",
  },
  {
    title: "Education Matters",
    message: "List your degrees, certifications, and relevant courses. Include completion dates and achievements.",
  },
  {
    title: "Work History",
    message: "Showcase your professional experience. Focus on achievements rather than just responsibilities.",
  },
  {
    title: "Skills Showcase",
    message: "Rate your technical and soft skills honestly. Include skills relevant to your career goals.",
  },
  {
    title: "Project Gallery",
    message: "Include 3-5 of your best projects with clear descriptions and technologies used.",
  },
  {
    title: "Your Portfolio Look",
    message: "Choose a template that represents your personal brand. Click on thumbnails to preview each design.",
  },
]

export function ContextualHelper({ step }: ContextualHelperProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const message = helperMessages[step] || helperMessages[0]

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isExpanded ? "w-72" : "w-12"
        }`}
      >
        <div className="flex items-center cursor-pointer p-3" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex-shrink-0">
            {isExpanded ? <Info className="h-6 w-6 text-blue-500" /> : <HelpCircle className="h-6 w-6 text-blue-500" />}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 overflow-hidden"
              >
                <h4 className="font-semibold text-sm">{message.title}</h4>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3"
            >
              <p className="text-sm text-gray-600">{message.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
