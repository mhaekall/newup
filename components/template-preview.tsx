"use client"

import { useState } from "react"
import { templates } from "@/templates"
import type { Profile } from "@/types"
import { Button } from "@/components/ui/button"

interface TemplatePreviewProps {
  profile: Profile
  onSelect: (templateId: string) => void
  currentTemplateId: string
}

export default function TemplatePreview({ profile, onSelect, currentTemplateId }: TemplatePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState(currentTemplateId)

  const handlePreview = () => {
    setPreviewTemplateId(currentTemplateId)
    setIsOpen(true)
  }

  const handleSelect = (templateId: string) => {
    setPreviewTemplateId(templateId)
  }

  const handleApply = () => {
    onSelect(previewTemplateId)
    setIsOpen(false)
  }

  const TemplateComponent = templates.find((t) => t.id === previewTemplateId)?.component || templates[0].component

  return (
    <>
      <Button type="button" onClick={handlePreview} variant="outline">
        Preview Template
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Template Preview</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={handleApply} size="sm">
                Apply Template
              </Button>
              <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>

          {/* Template selector */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelect(template.id)}
                  className={`cursor-pointer p-3 rounded-lg ${
                    previewTemplateId === template.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-32 h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">
                    {template.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-center">{template.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto">
            <div className="h-full">
              <TemplateComponent profile={profile} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
