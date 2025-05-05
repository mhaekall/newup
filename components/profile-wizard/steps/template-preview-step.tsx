"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { templates } from "@/templates"
import type { Profile } from "@/types"

interface TemplatePreviewStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function TemplatePreviewStep({ profile, updateProfile }: TemplatePreviewStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(profile.template_id || "template1")

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    updateProfile({ template_id: templateId })
  }

  // Get the current template component
  const TemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component || templates[0].component

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium">Choose Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template selector */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={`flex-shrink-0 w-40 p-3 rounded-xl snap-start cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? "bg-blue-50 ring-2 ring-blue-500"
                    : "ring-1 ring-gray-200 bg-white hover:ring-blue-200"
                }`}
              >
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    template.name.charAt(0)
                  )}
                </div>
                <p className="text-sm font-medium text-center truncate">{template.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview area */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">Preview</div>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="h-[60vh] overflow-auto bg-gray-50 p-4">
              <TemplateComponent profile={profile} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
