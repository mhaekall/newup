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
import { useState, useEffect } from "react"

interface BasicInfoStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function BasicInfoStep({ profile, updateProfile }: BasicInfoStepProps) {
  const [usernameInput, setUsernameInput] = useState(profile.username || "")
  const [hasUsernameChanged, setHasUsernameChanged] = useState(false)

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
    skipValidation: !hasUsernameChanged,
  })

  useEffect(() => {
    // Reset the hasUsernameChanged flag when the component mounts
    setHasUsernameChanged(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Khusus untuk username, lakukan validasi lokal terlebih dahulu
    if (name === "username") {
      setUsernameInput(value)

      // Mark that username has been changed by the user
      if (value !== profile.username) {
        setHasUsernameChanged(true)
      }

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
  const showUsernameError = hasUsernameChanged && (localUsernameError || usernameError)

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            name="username"
            value={usernameInput}
            onChange={handleChange}
            placeholder="username"
            required
            className={cn(
              "mt-1 rounded-xl h-12 transition-all",
              showUsernameError
                ? "border-red-500"
                : hasUsernameChanged && isAvailable && !isChecking
                  ? "border-green-500"
                  : "",
            )}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              This will be your profile URL: https://v0-next-js-full-stack-seven.vercel.app/
              {profile.username || "username"}
            </p>
            {isChecking && <span className="text-xs text-gray-500">Checking...</span>}
            {!isChecking && isAvailable === true && profile.username && hasUsernameChanged && !localUsernameError && (
              <span className="text-xs text-green-500">Username available</span>
            )}
            {!isChecking && showUsernameError && (
              <span className="text-xs text-red-500">{localUsernameError || usernameError}</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="mt-1 rounded-xl h-12"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-sm font-medium">
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
            className="mt-1 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Profile Image</Label>
          <ImageUpload
            initialImage={profile.profile_image}
            onImageUploaded={(url) => handleImageChange("profile_image", url)}
            type="profile"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Banner Image</Label>
          <ImageUpload
            initialImage={profile.banner_image}
            onImageUploaded={(url) => handleImageChange("banner_image", url)}
            type="banner"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="template_id" className="text-sm font-medium">
            Template
          </Label>
          <div className="flex items-center gap-4 mt-2">
            <Select
              id="template_id"
              name="template_id"
              value={profile.template_id}
              onChange={handleChange}
              className="rounded-xl h-12"
            >
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
