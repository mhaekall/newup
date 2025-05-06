"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Check, AlertCircle } from "lucide-react"
import type { Profile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

interface LinksStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

type LinkItem = {
  label: string
  url: string
  icon?: string
  isValid?: boolean
  errorMessage?: string
}

export function LinksStep({ profile, updateProfile }: LinksStepProps) {
  // Initialize with WhatsApp, Instagram, and LinkedIn by default
  const [links, setLinks] = useState<LinkItem[]>(
    profile.links?.length
      ? profile.links
      : [
          { label: "WhatsApp", url: "https://wa.me/", icon: "whatsapp" },
          { label: "Instagram", url: "https://instagram.com/", icon: "instagram" },
          { label: "LinkedIn", url: "https://linkedin.com/in/", icon: "linkedin" },
        ],
  )
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [activeLinkIndex, setActiveLinkIndex] = useState<number | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const urlInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)

  // Platform options with icons
  const platforms = [
    { name: "GitHub", icon: "github", urlPrefix: "https://github.com/" },
    { name: "LinkedIn", icon: "linkedin", urlPrefix: "https://linkedin.com/in/" },
    { name: "Twitter", icon: "twitter", urlPrefix: "https://twitter.com/" },
    { name: "Instagram", icon: "instagram", urlPrefix: "https://instagram.com/" },
    { name: "Facebook", icon: "facebook", urlPrefix: "https://facebook.com/" },
    { name: "YouTube", icon: "youtube", urlPrefix: "https://youtube.com/" },
    { name: "WhatsApp", icon: "whatsapp", urlPrefix: "https://wa.me/" },
    { name: "Telegram", icon: "telegram", urlPrefix: "https://t.me/" },
    { name: "Portfolio", icon: "link", urlPrefix: "https://" },
    { name: "Other", icon: "link", urlPrefix: "https://" },
  ]

  // Validate links
  const validateLinks = (links: LinkItem[]): LinkItem[] => {
    return links.map((link) => {
      let isValid = true
      let errorMessage = ""

      if (link.label && link.url) {
        switch (link.label.toLowerCase()) {
          case "youtube":
            // Accept both youtube.com/ and youtube.com/@
            if (!link.url.includes("youtube.com/") && !link.url.includes("youtu.be/")) {
              isValid = false
              errorMessage = "YouTube URL should contain youtube.com/ or youtu.be/"
            }
            break
          case "instagram":
            if (!link.url.includes("instagram.com/")) {
              isValid = false
              errorMessage = "Instagram URL should contain instagram.com/"
            }
            break
          case "github":
            if (!link.url.includes("github.com/")) {
              isValid = false
              errorMessage = "GitHub URL should contain github.com/"
            }
            break
          case "linkedin":
            if (!link.url.includes("linkedin.com/in/")) {
              isValid = false
              errorMessage = "LinkedIn URL should contain linkedin.com/in/"
            }
            break
          case "twitter":
            if (!link.url.includes("twitter.com/")) {
              isValid = false
              errorMessage = "Twitter URL should contain twitter.com/"
            }
            break
          case "facebook":
            if (!link.url.includes("facebook.com/")) {
              isValid = false
              errorMessage = "Facebook URL should contain facebook.com/"
            }
            break
          case "whatsapp":
            if (!link.url.includes("wa.me/")) {
              isValid = false
              errorMessage = "WhatsApp URL should contain wa.me/"
            }
            break
          case "telegram":
            if (!link.url.includes("t.me/")) {
              isValid = false
              errorMessage = "Telegram URL should contain t.me/"
            }
            break
          default:
            // For other links, just check if it's a valid URL
            try {
              new URL(link.url)
            } catch (e) {
              isValid = false
              errorMessage = "Please enter a valid URL"
            }
        }
      }

      return { ...link, isValid, errorMessage }
    })
  }

  // Auto-save when links change
  useEffect(() => {
    const timer = setTimeout(() => {
      const validatedLinks = validateLinks(links)
      setLinks(validatedLinks)

      // Only save valid links or empty links
      const linksToSave = validatedLinks.filter((link) => !link.label || !link.url || link.isValid)
      updateProfile({ links: linksToSave })

      // Show auto-save indicator
      if (links.some((link) => link.label && link.url)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [links, updateProfile])

  // Handle adding a new link
  const addLink = () => {
    const newLink = {
      label: "",
      url: "",
      icon: "",
    }

    const newLinks = [...links, newLink]
    setLinks(newLinks)

    // Focus the new URL input after a short delay
    setTimeout(() => {
      const newIndex = newLinks.length - 1
      if (urlInputRefs.current[newIndex]) {
        urlInputRefs.current[newIndex]?.focus()
      }
    }, 100)
  }

  // Handle removing a link
  const removeLink = (index: number) => {
    const newLinks = [...links]
    newLinks.splice(index, 1)
    setLinks(newLinks)
  }

  // Handle updating a link
  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }

    // If updating the platform, also update the icon
    if (field === "label") {
      newLinks[index].icon = getPlatformIcon(value)

      // Set URL prefix based on platform
      const platform = platforms.find((p) => p.name === value)
      if (platform && (!newLinks[index].url || newLinks[index].url === "")) {
        newLinks[index].url = platform.urlPrefix
      }
    }

    setLinks(newLinks)
  }

  // Get platform icon
  const getPlatformIcon = (platform: string): string => {
    const platformInfo = platforms.find((p) => p.name === platform)
    return platformInfo?.icon || "link"
  }

  // Handle platform selection
  const selectPlatform = (platform: string) => {
    if (activeLinkIndex !== null) {
      const platformInfo = platforms.find((p) => p.name === platform)
      updateLink(activeLinkIndex, "label", platform)

      // Set URL prefix if URL is empty
      if (platformInfo && (!links[activeLinkIndex].url || links[activeLinkIndex].url === "")) {
        updateLink(activeLinkIndex, "url", platformInfo.urlPrefix)
      }

      // Focus the URL input after selection
      setTimeout(() => {
        if (urlInputRefs.current[activeLinkIndex]) {
          urlInputRefs.current[activeLinkIndex]?.focus()
        }
      }, 100)
    }
    setShowPlatformSelector(false)
  }

  // Render platform icon
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#181717]" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        )
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0A66C2]" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        )
      case "twitter":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1DA1F2]" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        )
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#E4405F]" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      case "whatsapp":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#25D366]" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.463 3.488C18.217 1.24 15.231 0.001 12.05 0C5.495 0 0.16 5.334 0.157 11.892c-0.001 2.096 0.547 4.142 1.588 5.946L0.057 24l6.304-1.654c1.737 0.948 3.693 1.447 5.683 1.448h0.005c6.554 0 11.89-5.335 11.893-11.893 0.002-3.177-1.234-6.163-3.479-8.413ZM12.05 21.785h-0.004c-1.774 0-3.513-0.477-5.031-1.378l-0.361-0.214-3.741 0.981 0.999-3.648-0.235-0.374c-0.99-1.574-1.512-3.393-1.511-5.26 0.002-5.45 4.437-9.884 9.889-9.884 2.64 0.001 5.122 1.031 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.993-0.003 5.45-4.437 9.886-9.885 9.886Zm5.43-7.403c-0.3-0.15-1.767-0.872-2.04-0.972-0.273-0.097-0.472-0.148-0.67 0.15-0.2 0.297-0.767 0.972-0.94 1.17-0.174 0.2-0.347 0.223-0.646 0.075-0.3-0.15-1.263-0.465-2.403-1.485-0.888-0.795-1.489-1.77-1.663-2.07-0.174-0.3-0.019-0.465 0.13-0.615 0.134-0.135 0.3-0.345 0.45-0.52 0.15-0.174 0.2-0.3 0.3-0.499 0.099-0.2 0.05-0.375-0.025-0.524-0.075-0.15-0.672-1.62-0.922-2.206-0.242-0.58-0.487-0.5-0.672-0.51-0.172-0.01-0.371-0.01-0.57-0.01-0.2 0-0.522 0.074-0.797 0.375-0.274 0.3-1.045 1.02-1.045 2.475 0 1.455 1.075 2.875 1.224 3.074 0.15 0.2 2.11 3.22 5.11 4.512 0.714 0.31 1.27 0.492 1.705 0.632 0.716 0.227 1.368 0.195 1.883 0.118 0.574-0.085 1.767-0.72 2.016-1.42 0.25-0.697 0.25-1.293 0.174-1.418-0.075-0.124-0.274-0.198-0.574-0.347Z"
            />
          </svg>
        )
      case "telegram":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#26A5E4]" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        )
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF0000]" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1877F2]" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case "portfolio":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0070F3]" fill="currentColor">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z" />
          </svg>
        )
      case "other":
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        )
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        )
    }
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
    <div className="space-y-6">
      <div className="text-2xl font-medium">Links</div>
      <p className="text-gray-500 font-normal">Add links to your social profiles and websites.</p>

      {/* Links list */}
      <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
        {links.map((link, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 bg-white p-4 rounded-xl border ${
              link.isValid === false ? "border-red-200 bg-red-50" : "border-gray-100"
            } hover:border-blue-200 transition-colors duration-200`}
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex-shrink-0">
              {link.label ? (
                renderPlatformIcon(link.label)
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              {/* Platform selector */}
              <div
                className={`flex items-center h-12 px-3 border ${
                  link.isValid === false ? "border-red-300" : "border-gray-200"
                } rounded-xl bg-gray-50 cursor-pointer hover:border-blue-300 transition-colors duration-200`}
                onClick={() => {
                  setActiveLinkIndex(index)
                  setShowPlatformSelector(true)
                }}
              >
                <span className={link.label ? "text-gray-900" : "text-gray-400"}>
                  {link.label || "Select platform"}
                </span>
              </div>

              {/* URL input */}
              <div className="relative">
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  placeholder="https://"
                  className={`h-12 rounded-xl ${
                    link.isValid === false ? "border-red-300 bg-red-50" : ""
                  } focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  ref={(el) => {
                    urlInputRefs.current[index] = el
                  }}
                />
                {link.isValid === false && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>

              {/* Error message */}
              {link.isValid === false && link.errorMessage && (
                <p className="text-sm text-red-500 mt-1">{link.errorMessage}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink(index)}
              className="flex-shrink-0 h-10 w-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Add button */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => addLink()}
          className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
        >
          <Plus className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
          Add Link
        </Button>
      </div>

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

      {/* Platform selector sheet */}
      {showPlatformSelector && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-50 backdrop-blur-sm"
          onClick={() => setShowPlatformSelector(false)}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-center pt-2 pb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-4 pb-8">
              <h3 className="text-lg font-medium mb-4">Select Platform</h3>
              <motion.div
                className="space-y-2 max-h-[60vh] overflow-auto pb-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {platforms
                  .filter((platform) => platform.name !== "Email") // Remove Email from options
                  .map((platform) => (
                    <motion.div
                      key={platform.name}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                      onClick={() => selectPlatform(platform.name)}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "#F9FAFB", x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-shrink-0">{renderPlatformIcon(platform.name.toLowerCase())}</div>
                      <span className="flex-1">{platform.name}</span>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
