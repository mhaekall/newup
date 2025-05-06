"use client"
import { useState, useEffect } from "react"
import type { Profile, SocialLink } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Plus, X, Check, LinkIcon, ChevronDown } from "lucide-react"
import { SocialMediaIcon } from "@/components/social-media-icons"

interface LinksStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function LinksStep({ profile, updateProfile }: LinksStepProps) {
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.links.some((link) => link.url)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [profile.links])

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...profile.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    updateProfile({ links: updatedLinks })
  }

  const addLink = () => {
    updateProfile({
      links: [...profile.links, { platform: "", url: "" }],
    })
  }

  const removeLink = (index: number) => {
    const updatedLinks = [...profile.links]
    updatedLinks.splice(index, 1)
    updateProfile({ links: updatedLinks })
  }

  const openPlatformSelector = (index: number) => {
    setCurrentLinkIndex(index)
    setShowPlatformSelector(true)
  }

  const platforms = [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Instagram",
    "Facebook",
    "YouTube",
    "TikTok",
    "Dribbble",
    "Behance",
    "Medium",
    "Dev.to",
    "Personal Website",
    "Other",
  ]

  // Function to validate YouTube URL
  const validateYouTubeUrl = (url: string): boolean => {
    // Accept various YouTube URL formats
    const youtubeRegex =
      /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)(\/(@|channel\/|user\/|v\/|watch\?v=|embed\/|shorts\/|playlist\?list=))?([a-zA-Z0-9_-]{1,})(\S*)$/
    return youtubeRegex.test(url)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-medium text-gray-800">Social Links</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Connect Your Profiles</Label>
            <Button
              type="button"
              onClick={addLink}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Add Link
            </Button>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {profile.links.map((link, index) => (
              <motion.div
                key={index}
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm space-y-3 hover:border-blue-200 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={`link-platform-${index}`} className="text-sm font-normal text-gray-500">
                    Platform
                  </Label>
                  <Button
                    type="button"
                    onClick={() => removeLink(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div
                  className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors duration-200"
                  onClick={() => openPlatformSelector(index)}
                >
                  {link.platform ? (
                    <div className="flex items-center">
                      <SocialMediaIcon platform={link.platform} className="h-5 w-5 mr-2" />
                      <span>{link.platform}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select Platform</span>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`link-url-${index}`} className="text-sm font-normal text-gray-500">
                    URL
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id={`link-url-${index}`}
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                      placeholder={link.platform ? `Your ${link.platform} URL` : "https://example.com/username"}
                      className="pl-10 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {profile.links.length === 0 && (
            <motion.div
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <LinkIcon className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No links added yet. Click "Add Link" to get started.</p>
                <Button
                  onClick={addLink}
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Link
                </Button>
              </div>
            </motion.div>
          )}

          {/* Auto-save indicator */}
          {autoSaveIndicator && (
            <motion.div
              className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-full shadow-md flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Check className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Changes saved</span>
            </motion.div>
          )}
        </motion.div>

        {/* Platform Selector - Full Screen */}
        {showPlatformSelector && (
          <div className="fixed inset-0 z-50 bg-white p-4">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h3 className="text-xl font-medium">Select Platform</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPlatformSelector(false)}
                  className="h-8 w-8 rounded-full p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {platforms.map((platform) => (
                  <motion.button
                    key={platform}
                    type="button"
                    className={`w-full text-left p-4 rounded-xl flex items-center justify-between ${
                      profile.links[currentLinkIndex]?.platform === platform
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "border border-gray-200"
                    }`}
                    onClick={() => {
                      // Update both platform and icon simultaneously
                      handleLinkChange(currentLinkIndex, "platform", platform)
                      setShowPlatformSelector(false)
                    }}
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <SocialMediaIcon platform={platform} className="h-5 w-5 mr-3" />
                      <span className="text-base">{platform}</span>
                    </div>
                    {profile.links[currentLinkIndex]?.platform === platform && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
