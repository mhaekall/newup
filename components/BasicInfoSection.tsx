"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { usePortfolio } from "@/context/PortfolioContext"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const BasicInfoSection: React.FC = () => {
  const { portfolio, updatePortfolio } = usePortfolio()
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updatePortfolio({ [name]: value })

    // Check username availability
    if (name === "username") {
      checkUsernameAvailability(value)
    }
  }

  // Simulate username availability check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For demo purposes, usernames containing "taken" are unavailable
    const isAvailable = !username.toLowerCase().includes("taken")
    setUsernameAvailable(isAvailable)
    setIsCheckingUsername(false)
  }, [])

  // Handle image upload
  const handleImageUpload = (type: "profileImage" | "bannerImage", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload to a server and get a URL back
    // For demo purposes, we'll use a local URL
    const imageUrl = URL.createObjectURL(file)
    updatePortfolio({ [type]: imageUrl })
  }

  // Handle image deletion
  const handleDeleteImage = (type: "profileImage" | "bannerImage") => {
    updatePortfolio({ [type]: null })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={portfolio.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  usernameAvailable === true
                    ? "border-green-300 focus:ring-green-500"
                    : usernameAvailable === false
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-all`}
                placeholder="your-username"
              />
              {isCheckingUsername && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              {!isCheckingUsername && usernameAvailable === true && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              )}
              {!isCheckingUsername && usernameAvailable === false && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {usernameAvailable === false
                ? "This username is already taken"
                : `Your profile URL: yoursite.com/${portfolio.username || "username"}`}
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={portfolio.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={portfolio.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="Tell us about yourself"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {portfolio.profileImage ? (
                  <Image
                    src={portfolio.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col space-y-2">
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload("profileImage", e)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        transition-all"
                    />
                  </label>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>

                  {portfolio.profileImage && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage("profileImage")}
                      className="flex items-center w-fit"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <div className="space-y-3">
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {portfolio.bannerImage ? (
                  <Image src={portfolio.bannerImage || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="block">
                  <span className="sr-only">Choose banner image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("bannerImage", e)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      transition-all"
                  />
                </label>
                <p className="text-xs text-gray-500">Recommended size: 1500x500px</p>

                {portfolio.bannerImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage("bannerImage")}
                    className="flex items-center w-fit"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Banner
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
