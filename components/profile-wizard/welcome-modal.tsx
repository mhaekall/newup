"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useHaptic } from "@/hooks/use-haptic"

interface WelcomeModalProps {
  onClose: () => void
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(true)
  const haptic = useHaptic()

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const hasSeenWelcomeModal = localStorage.getItem("hasSeenWelcomeModal")
    if (hasSeenWelcomeModal === "true") {
      setIsVisible(false)
      onClose()
    }
  }, [onClose])

  const handleStart = () => {
    haptic.medium()
    localStorage.setItem("hasSeenWelcomeModal", "true")
    setIsVisible(false)
    onClose()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white text-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold mb-2">Create Your Portfolio</h2>
              <p className="opacity-90">Let's build your professional profile step by step</p>
            </motion.div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: "👤", title: "Profile" },
                { icon: "🎓", title: "Education" },
                { icon: "💼", title: "Experience" },
                { icon: "🛠️", title: "Skills" },
                { icon: "🚀", title: "Projects" },
                { icon: "🎨", title: "Design" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm text-gray-600">{item.title}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center text-gray-600 mb-6">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                We'll guide you through creating a professional portfolio in just a few minutes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <Button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 px-8 h-12 rounded-full">
                Let's Get Started
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
