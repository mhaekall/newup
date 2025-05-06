"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateUserImage } from "@/lib/services/profile-service"
import { useToast } from "@/hooks/use-toast"

interface ProfileImageUploaderProps {
  userId: string
  currentImageUrl?: string
  username: string
}

export default function ProfileImageUploader({ userId, currentImageUrl, username }: ProfileImageUploaderProps) {
  const [image, setImage] = useState<string | null>(currentImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Generate avatar from username if no image
  const generateInitialAvatar = () => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-green-500"]
    const colorIndex = username.charCodeAt(0) % colors.length
    const bgColor = colors[colorIndex]

    return (
      <div
        className={`w-24 h-24 rounded-full ${bgColor} flex items-center justify-center text-white text-3xl font-medium`}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    )
  }

  const handleImageClick = () => {
    setShowOptions(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append("image", file)

      const result = await updateUserImage(userId, formData)

      if (result.success) {
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to update profile picture")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setShowOptions(false)
    }
  }

  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setImage(null)
    setShowOptions(false)
    // TODO: Implement API call to remove profile image
  }

  return (
    <div className="relative">
      {/* Profile Image */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer"
        onClick={handleImageClick}
      >
        {image ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-100">
            <img src={image || "/placeholder.svg"} alt={username} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          generateInitialAvatar()
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* Image options popup */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg p-2 z-10 w-48 border border-gray-100"
          >
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start gap-2 py-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={handleSelectImage}
              >
                <Upload className="w-4 h-4" />
                <span>Upload photo</span>
              </Button>

              {image && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-start gap-2 py-2 hover:bg-red-50 hover:text-red-600"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4" />
                  <span>Remove photo</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start gap-2 py-2 hover:bg-gray-50"
                onClick={() => setShowOptions(false)}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
