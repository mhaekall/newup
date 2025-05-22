"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Profile } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import { useUsernameValidation } from "@/hooks/use-username-validation"
import { useToast } from "@/hooks/use-toast"

interface BasicInfoStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
  isMobile?: boolean
}

export function BasicInfoStep({ profile, updateProfile, isMobile = false }: BasicInfoStepProps) {
  const [usernameInput, setUsernameInput] = useState(profile.username || "")
  const [hasUsernameChanged, setHasUsernameChanged] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [cvFileName, setCvFileName] = useState<string | null>(null)

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
    currentUsername: profile.username, // Pass the current username
    skipValidation: !hasUsernameChanged,
  })

  useEffect(() => {
    // Reset the hasUsernameChanged flag when the component mounts
    setHasUsernameChanged(false)

    // Ensure username is set from profile if available
    if (profile.username && !usernameInput) {
      setUsernameInput(profile.username)
    }
  }, [profile.username, usernameInput])

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
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div>
          <Label htmlFor="username" className="text-base font-medium">
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
              "mt-2 rounded-xl h-14 text-lg transition-all",
              showUsernameError
                ? "border-red-500"
                : hasUsernameChanged && isAvailable && !isChecking
                  ? "border-green-500"
                  : "",
            )}
          />
          <div className={`flex ${isMobile ? "flex-col" : "justify-between items-center"} mt-2`}>
            <p className="text-sm text-gray-500">
              This will be your profile URL: {isMobile && <br />}
              <span className="font-medium">looqmy.vercel.app/{usernameInput || "username"}</span>
            </p>
            {isChecking && <span className="text-sm text-gray-500 mt-1">Checking...</span>}
            {!isChecking && isAvailable === true && usernameInput && hasUsernameChanged && !localUsernameError && (
              <span className="text-sm text-green-500 mt-1">Username available</span>
            )}
            {!isChecking && showUsernameError && (
              <span className="text-sm text-red-500 mt-1">{localUsernameError || usernameError}</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="name" className="text-base font-medium">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="mt-2 rounded-xl h-14 text-lg"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-base font-medium">
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
            className="mt-2 rounded-xl resize-none text-lg"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Profile Image</Label>
          <ImageUpload
            initialImage={profile.profile_image}
            onImageUploaded={(url) => handleImageChange("profile_image", url)}
            type="profile"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Banner Image</Label>
          <ImageUpload
            initialImage={profile.banner_image}
            onImageUploaded={(url) => handleImageChange("banner_image", url)}
            type="banner"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
