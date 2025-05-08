"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContextualHelperProps {
  step: number
  isMobile?: boolean
}

export function ContextualHelper({ step, isMobile = false }: ContextualHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [helpText, setHelpText] = useState("")

  useEffect(() => {
    // Set help text based on current step
    switch (step) {
      case 0:
        setHelpText(
          "Fill in your basic information to personalize your portfolio. Your username will be used in your portfolio URL.",
        )
        break
      case 1:
        setHelpText(
          "Add links to your social media profiles, personal website, or any other online presence you want to showcase.",
        )
        break
      case 2:
        setHelpText("Share your educational background. Include institutions, degrees, and relevant achievements.")
        break
      case 3:
        setHelpText("Highlight your work experience. Include your role, company, duration, and key responsibilities.")
        break
      case 4:
        setHelpText("List your skills and rate your proficiency level. Group them by category for better organization.")
        break
      case 5:
        setHelpText(
          "Showcase your best projects. Include descriptions, technologies used, and links to live demos or repositories.",
        )
        break
      case 6:
        setHelpText(
          "Choose a template that best represents your personal brand and showcases your portfolio effectively.",
        )
        break
      default:
        setHelpText("")
    }
  }, [step])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`fixed ${isMobile ? "bottom-20 right-4" : "bottom-24 right-8"} rounded-full h-12 w-12 bg-white shadow-lg z-20`}
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-6 w-6 text-blue-500" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed ${isMobile ? "inset-2 z-50" : "bottom-24 right-8 w-80 z-30"} bg-white rounded-xl shadow-xl p-4 border border-gray-200`}
          >
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
            <h3 className="text-lg font-semibold mb-2">Help & Tips</h3>
            <p className="text-gray-600">{helpText}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
