"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { uploadImage } from "@/lib/supabase-storage"
import { Button } from "@/components/ui/button"
import Image from "next/image" // Gunakan Next.js Image untuk optimasi

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
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset error when component mounts or type changes
  useEffect(() => {
    setError(null)
  }, [type])

  // Set initial image as preview
  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Simulate progress for better UX
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10
          const newProgress = Math.min(prev + increment, 95) // Cap at 95% until actual completion
          return newProgress
        })
      }, 200)

      return () => clearInterval(interval)
    } else if (uploadProgress > 0 && !isUploading) {
      // Complete the progress bar when upload is done
      setUploadProgress(100)
      const timeout = setTimeout(() => {
        setUploadProgress(0)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isUploading, uploadProgress])

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

    // Create preview immediately for better UX
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    const newPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(newPreviewUrl)

    try {
      setError(null)
      setIsUploading(true)
      setUploadProgress(0)

      // Upload the image to Supabase Storage
      const imageUrl = await uploadImage(file, type)

      // Update state and call the callback
      setImage(imageUrl)
      onImageUploaded(imageUrl)

      // Complete the upload
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setIsUploading(false)
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
        className={`relative ${dimensions.width} ${dimensions.height} ${dimensions.rounded} overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer transition-all duration-300 hover:shadow-md`}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="w-full h-full">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt={`${type} image`}
              fill
              sizes={type === "profile" ? "96px" : "100vw"}
              className="object-cover"
              onError={() => {
                setPreviewUrl("/placeholder.svg")
              }}
              priority={type === "profile"} // Load profile images immediately
            />
          </div>
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <div className="mt-3 w-3/4 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
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
          className="text-xs rounded-full"
          disabled={isUploading}
        >
          {image
            ? "Change Image"
            : `Upload ${type === "profile" ? "Profile" : type === "banner" ? "Banner" : "Project"} Image`}
        </Button>
      </div>
    </div>
  )
}
