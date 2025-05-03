"use client"

import type React from "react"
import { useWizard } from "../wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import TemplatePreview from "@/components/template-preview"
import { templates } from "@/templates"

export function BasicInfoStep() {
  const { profile, updateProfile } = useWizard()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateProfile({ [name]: value })
  }

  const handleTemplateChange = (templateId: string) => {
    updateProfile({ template_id: templateId })
  }

  const handleImageChange = (field: "profile_image" | "banner_image", value: string) => {
    updateProfile({ [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            placeholder="username"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be your profile URL: https://v0-next-js-full-stack-seven.vercel.app/
            {profile.username || "username"}
          </p>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={profile.name} onChange={handleChange} placeholder="Your Name" required />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div>
          <Label>Profile Image</Label>
          <ImageUpload
            initialImage={profile.profile_image}
            onImageUploaded={(url) => handleImageChange("profile_image", url)}
            type="profile"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Banner Image</Label>
          <ImageUpload
            initialImage={profile.banner_image}
            onImageUploaded={(url) => handleImageChange("banner_image", url)}
            type="banner"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="template_id">Template</Label>
          <div className="flex items-center gap-4 mt-2">
            <Select id="template_id" name="template_id" value={profile.template_id} onChange={handleChange}>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>

            <TemplatePreview
              profile={profile}
              onSelect={handleTemplateChange}
              currentTemplateId={profile.template_id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
