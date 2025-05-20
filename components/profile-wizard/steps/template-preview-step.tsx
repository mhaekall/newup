"use client"

import { useState } from "react"
import { templates } from "@/templates"
import type { Profile } from "@/types"

interface TemplatePreviewStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function TemplatePreviewStep({ profile, updateProfile }: TemplatePreviewStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(profile.template_id || "template1")

  // Get the current template component
  const TemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component || templates[0].component

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    updateProfile({ template_id: templateId })
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Choose Template</div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        ))}
      </div>

      {/* Preview section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium">Preview</h3>
        </div>
        <div className="h-[400px] overflow-auto p-4 bg-gray-50">
          <TemplateComponent profile={profile} />
        </div>
      </div>
    </div>
  )
}
