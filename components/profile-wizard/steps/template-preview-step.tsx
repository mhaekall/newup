"use client"

import { useState } from "react"
import { templates } from "@/templates"
import type { Profile } from "@/types"
import { Button } from "@/components/ui/button"

interface TemplatePreviewStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function TemplatePreviewStep({ profile, updateProfile }: TemplatePreviewStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(profile.template_id || "template1")
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  // Get the current template component
  const TemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component || templates[0].component

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    updateProfile({ template_id: templateId })
  }

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplate(templateId)
    setShowFullPreview(true)
  }

  const handleApplyTemplate = () => {
    if (previewTemplate) {
      setSelectedTemplate(previewTemplate)
      updateProfile({ template_id: previewTemplate })
    }
    setShowFullPreview(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Choose Template</div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
              selectedTemplate === template.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            {template.thumbnail ? (
              <img
                src={template.thumbnail || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-6xl font-light">
                {template.name.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm p-3 text-center">
              <p className="font-medium">{template.name}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handlePreviewTemplate(template.id)
              }}
              className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full px-3 text-xs"
            >
              Preview
            </Button>
          </div>
        ))}
      </div>

      {/* Preview section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-medium">Preview</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreviewTemplate(selectedTemplate)}
            className="rounded-full text-sm"
          >
            Full Preview
          </Button>
        </div>
        <div className="h-[400px] overflow-auto p-4 bg-gray-50">
          <TemplateComponent profile={profile} />
        </div>
      </div>

      {/* Full screen preview modal */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold">Template Preview</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleApplyTemplate}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
              >
                Apply Template
              </Button>
              <Button variant="outline" onClick={() => setShowFullPreview(false)} className="rounded-full">
                Close
              </Button>
            </div>
          </div>
          <div className="p-4">
            {previewTemplate &&
              templates
                .find((t) => t.id === previewTemplate)
                ?.component({
                  profile,
                })}
          </div>
        </div>
      )}
    </div>
  )
}
