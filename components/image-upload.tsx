"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { uploadImage } from "@/lib/supabase-storage"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  initialImage?: string
  onImageUploaded: (url: string) => void
  type: "profile" | "banner" | "project"
  className?: string
}

export default function ImageUpload({ initialImage, onImageUploaded, type, className }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset error when component mounts or type changes
  useEffect(() => {
    setError(null)
  }, [type])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    try {
      setError(null)
      setIsUploading(true)
      setIsLoading(true)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(interval)
            return 90
          }
          return newProgress
        })
      }, 200)

      console.log(`Uploading ${type} image:`, file.name)

      // Upload the image to Supabase Storage
      const imageUrl = await uploadImage(file, type)

      // Clear the interval and set progress to 100%
      clearInterval(interval)
      setUploadProgress(100)

      console.log(`Upload successful, URL:`, imageUrl)

      // Update state and call the callback
      setImage(imageUrl)
      onImageUploaded(imageUrl)

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
        setIsLoading(false)
      }, 500)
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setIsUploading(false)
      setIsLoading(false)
      setUploadProgress(0)
      setError(error.message || "Failed to upload image. Please try again.")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Determine dimensions based on type
  const dimensions =
    type === "profile"
      ? { width: "w-24", height: "h-24", rounded: "rounded-full" }
      : type === "banner"
        ? { width: "w-full", height: "h-32", rounded: "rounded-xl" }
        : { width: "w-full", height: "h-40", rounded: "rounded-xl" }

  return (
    <div className={`${className || ""}`}>
      <div
        className={`relative ${dimensions.width} ${dimensions.height} ${dimensions.rounded} overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer`}
        onClick={triggerFileInput}
      >
        {image ? (
          <img
            src={image || "/placeholder.svg"}
            alt={`${type} image`}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Error"
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="text-white text-sm mb-2">{uploadProgress}%</div>
            <div className="w-3/4 h-1.5 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <div className="mt-2 flex justify-center">
        <Button
          type="button"
          onClick={triggerFileInput}
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={isLoading}
        >
          {image
            ? "Change Image"
            : `Upload ${type === "profile" ? "Profile" : type === "banner" ? "Banner" : "Project"} Image`}
        </Button>
      </div>
    </div>
  )
}
