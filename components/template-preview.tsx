"use client"

import { useState, useEffect } from "react"
import { templates } from "@/templates"
import type { Profile } from "@/types"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useHaptic } from "@/hooks/use-haptic"
import { X, Maximize2, Eye } from "lucide-react"
import { toast } from "sonner"

interface TemplatePreviewProps {
  profile: Profile
  onSelect: (templateId: string) => void
  currentTemplateId: string
}

export default function TemplatePreview({ profile, onSelect, currentTemplateId }: TemplatePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState(currentTemplateId)
  const [fullPreview, setFullPreview] = useState(false)
  const haptic = useHaptic()

  // Close preview when screen size is too small
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && isOpen && fullPreview) {
        setFullPreview(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, fullPreview])

  const handlePreview = (templateId: string) => {
    haptic.light()
    setPreviewTemplateId(templateId)
    setIsOpen(true)
    setFullPreview(false) // Start with normal preview
  }

  const handleApply = () => {
    haptic.success()
    onSelect(previewTemplateId)
    setIsOpen(false)
    toast.success("Template applied successfully!")
  }

  const handleClose = () => {
    haptic.light()
    setIsOpen(false)
    setFullPreview(false)
  }

  const toggleFullPreview = () => {
    haptic.light()
    setFullPreview(!fullPreview)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePreview(template.id)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              template.id === currentTemplateId
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl text-gray-400">{template.name.charAt(0)}</span>
              </div>
              <div className="absolute bottom-0 right-0 p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePreview(template.id)
                  }}
                >
                  <Eye size={16} />
                </Button>
              </div>
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm font-medium text-center">{template.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className={`bg-white rounded-2xl overflow-hidden shadow-xl ${
                fullPreview ? "w-full h-full max-w-none max-h-none" : "w-full max-w-4xl max-h-[90vh]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Template Preview</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={toggleFullPreview} size="sm" variant="outline" className="rounded-full px-3">
                    <Maximize2 size={16} className="mr-1" />
                    {fullPreview ? "Exit Full Preview" : "Full Preview"}
                  </Button>
                  <Button onClick={handleApply} size="sm" className="rounded-full px-4">
                    Apply Template
                  </Button>
                  <Button onClick={handleClose} variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`overflow-auto ${fullPreview ? "h-[calc(100vh-64px)]" : "h-[calc(90vh-64px)]"}`}>
                {(() => {
                  const TemplateComponent =
                    templates.find((t) => t.id === previewTemplateId)?.component || templates[0].component
                  return <TemplateComponent profile={profile} />
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
