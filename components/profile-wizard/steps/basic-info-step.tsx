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
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { uploadCV, deleteCV } from "@/lib/supabase-storage"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BasicInfoStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
  isMobile?: boolean
}

export function BasicInfoStep({ profile, updateProfile, isMobile = false }: BasicInfoStepProps) {
  const [usernameInput, setUsernameInput] = useState(profile.username || "")
  const [hasUsernameChanged, setHasUsernameChanged] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Extract filename from CV URL if it exists
  useEffect(() => {
    if (profile.cv_url) {
      try {
        const url = new URL(profile.cv_url)
        const pathParts = url.pathname.split("/")
        const fileName = pathParts[pathParts.length - 1]
        // Remove UUID part and restore original filename
        const nameParts = fileName.split("_")
        if (nameParts.length > 1) {
          const originalName = nameParts[0]
          const extension = fileName.split(".").pop()
          setCvFileName(`${originalName}.${extension}`)
        } else {
          setCvFileName(fileName)
        }
      } catch (error) {
        console.error("Error parsing CV URL:", error)
        setCvFileName("CV")
      }
    }
  }, [profile.cv_url])

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

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCvFile(file)

      // Clear previous errors
      setUploadError(null)

      try {
        setIsUploading(true)

        // Delete previous CV if exists
        if (profile.cv_url) {
          try {
            await deleteCV(profile.cv_url)
          } catch (deleteError) {
            console.error("Error deleting previous CV:", deleteError)
            // Continue with upload even if delete fails
          }
        }

        // Upload new CV
        const result = await uploadCV(file, profile.user_id)

        // Update profile with CV URL
        updateProfile({ cv_url: result.url })
        setCvFileName(file.name)

        toast({
          title: "CV uploaded successfully",
          description: "Your CV has been uploaded and is now available on your profile",
          variant: "default",
        })
      } catch (error) {
        console.error("Error uploading CV:", error)

        let errorMessage = "Failed to upload CV. Please try again."

        if (error instanceof Error) {
          errorMessage = error.message
        }

        setUploadError(errorMessage)

        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemoveCV = async () => {
    try {
      setUploadError(null)

      if (profile.cv_url) {
        await deleteCV(profile.cv_url)
        updateProfile({ cv_url: undefined })
        setCvFileName(null)
        setCvFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        toast({
          title: "CV removed",
          description: "Your CV has been removed from your profile",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error removing CV:", error)

      let errorMessage = "Failed to remove CV. Please try again."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setUploadError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
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
              <span className="font-medium">v0-repository-integration.vercel.app/{usernameInput || "username"}</span>
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

        <div>
          <Label htmlFor="cv" className="text-base font-medium">
            CV / Resume
          </Label>
          <div className="mt-2">
            <input
              type="file"
              id="cv"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleCvUpload}
              className="hidden"
            />

            {uploadError && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("cv")?.click()}
                  className="flex items-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isUploading ? "Uploading..." : "Upload CV"}
                </Button>
                {(cvFileName || profile.cv_url) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveCV}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {(cvFileName || profile.cv_url) && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
                  <FileText size={20} className="text-blue-500" />
                  <span className="text-sm text-blue-700 font-medium">{cvFileName || "CV uploaded"}</span>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Accepted formats: PDF, DOC, DOCX (max 5MB). Your CV will be publicly available for download on your
                portfolio.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
