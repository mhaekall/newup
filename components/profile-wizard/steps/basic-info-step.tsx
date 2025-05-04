"use client"

import type React from "react"
import type { Profile } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import TemplatePreview from "@/components/template-preview"
import { templates } from "@/templates"
import { useUsernameValidation } from "@/hooks/use-username-validation"
import { useState } from "react"

interface BasicInfoStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function BasicInfoStep({ profile, updateProfile }: BasicInfoStepProps) {
  const [usernameInput, setUsernameInput] = useState(profile.username || "")

  // Validasi username secara lokal terlebih dahulu
  const isValidUsername = (username: string) => {
    // Hanya huruf, angka, underscore, dan dash
    return /^[a-z0-9_-]+$/i.test(username)
  }

  const {
    isAvailable,
    isChecking,
    error: usernameError,
  } = useUsernameValidation({
    username: usernameInput,
    currentUserId: profile.user_id,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Khusus untuk username, lakukan validasi lokal terlebih dahulu
    if (name === "username") {
      setUsernameInput(value)

      // Hanya update profile jika username valid
      if (isValidUsername(value) || value === "") {
        updateProfile({ [name]: value })
      }
    } else {
      updateProfile({ [name]: value })
    }
  }

  const handleTemplateChange = (templateId: string) => {
    updateProfile({ template_id: templateId })
  }

  const handleImageChange = (field: "profile_image" | "banner_image", value: string) => {
    updateProfile({ [field]: value })
  }

  // Pesan error lokal untuk username
  const getLocalUsernameError = () => {
    if (!usernameInput) return null
    if (!isValidUsername(usernameInput)) {
      return "Username hanya boleh berisi huruf, angka, underscore, dan dash"
    }
    return null
  }

  const localUsernameError = getLocalUsernameError()

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
            value={usernameInput}
            onChange={handleChange}
            placeholder="username"
            required
            className={localUsernameError || usernameError ? "border-red-500" : ""}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              This will be your profile URL: https://v0-next-js-full-stack-seven.vercel.app/
              {profile.username || "username"}
            </p>
            {isChecking && <span className="text-sm text-gray-500">Checking...</span>}
            {!isChecking && isAvailable === true && profile.username && !localUsernameError && (
              <span className="text-sm text-green-500">Username available</span>
            )}
            {!isChecking && (localUsernameError || usernameError) && (
              <span className="text-sm text-red-500">{localUsernameError || usernameError}</span>
            )}
          </div>
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
