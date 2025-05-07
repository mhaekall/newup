"use client"

import { useState, useEffect } from "react"
import type { Profile, Link as ProfileLink } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, ExternalLink, Check } from "lucide-react"
import { SocialMediaIcon } from "@/components/social-media-icons"
import { useHaptic } from "@/hooks/use-haptic"
import { toast } from "sonner"

interface LinksStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function LinksStep({ profile, updateProfile }: LinksStepProps) {
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)
  const haptic = useHaptic()

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

  const handleLinkChange = (index: number, field: keyof ProfileLink, value: string) => {
    haptic.light()
    const updatedLinks = [...profile.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    updateProfile({ links: updatedLinks })
  }

  const addLink = () => {
    haptic.medium()
    updateProfile({
      links: [...profile.links, { label: "", url: "", icon: "" }],
    })
    toast.success("New link added")
  }

  const removeLink = (index: number) => {
    haptic.warning()
    const updatedLinks = [...profile.links]
    updatedLinks.splice(index, 1)
    updateProfile({ links: updatedLinks })
    toast.info("Link removed")
  }

  const openPlatformSelector = (index: number) => {
    setCurrentLinkIndex(index)
    setShowPlatformSelector(true)
    haptic.light()
  }

  const selectPlatform = (platform: string, icon: string) => {
    haptic.medium()
    const updatedLinks = [...profile.links]
    updatedLinks[currentLinkIndex] = {
      ...updatedLinks[currentLinkIndex],
      label: platform,
      icon: icon,
    }
    updateProfile({ links: updatedLinks })
    setShowPlatformSelector(false)
  }

  const platforms = [
    { name: "GitHub", icon: "github" },
    { name: "LinkedIn", icon: "linkedin" },
    { name: "Twitter", icon: "twitter" },
    { name: "Instagram", icon: "instagram" },
    { name: "Facebook", icon: "facebook" },
    { name: "YouTube", icon: "youtube" },
    { name: "TikTok", icon: "tiktok" },
    { name: "Dribbble", icon: "dribbble" },
    { name: "Behance", icon: "behance" },
    { name: "Medium", icon: "medium" },
    { name: "Website", icon: "globe" },
  ]

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
        <CardTitle className="text-xl font-medium text-gray-800">Links</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Social Media & Websites</Label>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
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
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      onClick={() => removeLink(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors duration-200"
                  onClick={() => openPlatformSelector(index)}
                >
                  <div className="flex items-center">
                    {link.icon ? (
                      <>
                        <SocialMediaIcon platform={link.icon} className="h-5 w-5 mr-2" />
                        <span>{link.label || "Select Platform"}</span>
                      </>
                    ) : (
                      <span>Select Platform</span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-gray-400"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.div>

                <div>
                  <Label htmlFor={`link-url-${index}`} className="text-sm font-normal text-gray-500 mb-1 block">
                    URL
                  </Label>
                  <Input
                    id={`link-url-${index}`}
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
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
                <ExternalLink className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No links added yet. Click "Add Link" to get started.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={addLink}
                    variant="outline"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Link
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Auto-save indicator */}
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>

        {/* Platform Selector - Full Screen */}
        <AnimatePresence>
          {showPlatformSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 bg-white p-4"
            >
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <h3 className="text-xl font-medium">Select Platform</h3>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPlatformSelector(false)}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <motion.button
                      key={platform.name}
                      type="button"
                      className={`w-full text-left p-4 rounded-xl flex items-center justify-between border border-gray-200 ${
                        profile.links[currentLinkIndex]?.label === platform.name
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : ""
                      }`}
                      onClick={() => selectPlatform(platform.name, platform.icon)}
                      whileHover={{ backgroundColor: "#F9FAFB", y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <SocialMediaIcon platform={platform.icon} className="h-5 w-5 mr-3" />
                        <span className="text-base">{platform.name}</span>
                      </div>
                      {profile.links[currentLinkIndex]?.label === platform.name && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
