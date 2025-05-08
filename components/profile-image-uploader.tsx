"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProfileImageUploaderProps {
  userId: string
  currentImageUrl?: string
  username: string
}

export default function ProfileImageUploader({ userId, currentImageUrl, username }: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const { toast } = useToast()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("userId", userId)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      if (data.success) {
        setImageUrl(data.imageUrl)
        toast({
          title: "Image uploaded",
          description: "Your profile image has been updated",
        })
      } else {
        throw new Error(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${username}'s profile`}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      <label
        htmlFor="profile-image"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {isUploading ? "Uploading..." : "Change"}
      </label>
      <input
        type="file"
        id="profile-image"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        disabled={isUploading}
      />
    </div>
  )
}
