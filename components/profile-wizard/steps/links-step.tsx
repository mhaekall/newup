"use client"

import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { X, Check } from "lucide-react"
import type { Profile } from "@/types"

// Schema untuk validasi link
const linkSchema = z.object({
  label: z.string().min(1, "Label harus diisi"),
  url: z.string().min(1, "URL harus diisi"),
  icon: z.string().optional(),
})

// Schema untuk form links
const linksFormSchema = z.object({
  links: z.array(linkSchema).min(1),
})

type LinksFormValues = z.infer<typeof linksFormSchema>

interface LinksStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function LinksStep({ profile, updateProfile }: LinksStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")

  // Inisialisasi form dengan React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LinksFormValues>({
    resolver: zodResolver(linksFormSchema),
    defaultValues: {
      links: profile.links?.length ? profile.links : [{ label: "", url: "", icon: "" }],
    },
  })

  // Field array untuk mengelola array links
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  })

  // Fungsi untuk mendeteksi platform dari URL
  const detectPlatform = (url: string): string => {
    if (!url) return ""

    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes("github.com")) return "GitHub"
    if (lowerUrl.includes("linkedin.com")) return "LinkedIn"
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "Twitter"
    if (lowerUrl.includes("instagram.com")) return "Instagram"
    if (lowerUrl.includes("facebook.com")) return "Facebook"
    if (lowerUrl.includes("youtube.com")) return "YouTube"
    if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp.com")) return "WhatsApp"
    if (lowerUrl.includes("t.me")) return "Telegram"
    if (lowerUrl.includes("mailto:")) return "Email"
    return ""
  }

  // Fungsi untuk mendapatkan ikon berdasarkan platform
  const getPlatformIcon = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case "github":
        return "github"
      case "linkedin":
        return "linkedin"
      case "twitter":
        return "twitter"
      case "instagram":
        return "instagram"
      case "facebook":
        return "facebook"
      case "youtube":
        return "youtube"
      case "whatsapp":
        return "whatsapp"
      case "telegram":
        return "telegram"
      case "email":
        return "mail"
      case "medium":
        return "medium"
      case "dribbble":
        return "dribbble"
      case "behance":
        return "behance"
      default:
        return "link"
    }
  }

  // Fungsi untuk memvalidasi URL
  const validateUrl = (url: string, platform: string): boolean => {
    if (platform === "Email") {
      // Simple email validation for mailto: links
      return url.startsWith("mailto:") && url.includes("@")
    }

    if (platform === "WhatsApp") {
      // WhatsApp validation
      return url.startsWith("https://wa.me/") && url.length > 13
    }

    // General URL validation
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Fungsi untuk menyimpan data
  const onSubmit = async (data: LinksFormValues) => {
    setIsSubmitting(true)
    setSaveSuccess(false)
    setValidationError(null)

    try {
      // Validate URLs based on platform
      let hasError = false

      for (const link of data.links) {
        if (!validateUrl(link.url, link.label)) {
          setValidationError(`Invalid URL format for ${link.label}: ${link.url}`)
          hasError = true
          break
        }
      }

      if (hasError) {
        setIsSubmitting(false)
        return
      }

      // Format URLs dan tambahkan ikon berdasarkan platform
      const formattedLinks = data.links.map((link) => ({
        ...link,
        url: link.url,
        icon: link.icon || getPlatformIcon(link.label),
      }))

      // Update profile dengan links yang sudah diformat
      updateProfile({ links: formattedLinks })
      console.log("Links saved:", formattedLinks)

      // Show success message
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving links:", error)
      setValidationError("Failed to save links. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Daftar platform yang tersedia
  const PLATFORM_OPTIONS = [
    { label: "GitHub", value: "GitHub", icon: "github" },
    { label: "LinkedIn", value: "LinkedIn", icon: "linkedin" },
    { label: "Twitter", value: "Twitter", icon: "twitter" },
    { label: "Facebook", value: "Facebook", icon: "facebook" },
    { label: "Instagram", value: "Instagram", icon: "instagram" },
    { label: "YouTube", value: "YouTube", icon: "youtube" },
    { label: "WhatsApp", value: "WhatsApp", icon: "whatsapp" },
    { label: "Telegram", value: "Telegram", icon: "telegram" },
    { label: "Email", value: "Email", icon: "mail" },
    { label: "Medium", value: "Medium", icon: "medium" },
    { label: "Dribbble", value: "Dribbble", icon: "dribbble" },
    { label: "Behance", value: "Behance", icon: "behance" },
    { label: "Portfolio", value: "Portfolio", icon: "link" },
    { label: "Blog", value: "Blog", icon: "link" },
    { label: "Other", value: "Other", icon: "link" },
  ]

  // Fungsi untuk menambahkan link baru
  const addLink = () => {
    append({ label: "", url: "", icon: "" })
  }

  // Fungsi untuk menambahkan link WhatsApp
  const addWhatsApp = () => {
    append({ label: "WhatsApp", url: "https://wa.me/", icon: "whatsapp" })
  }

  // Fungsi untuk menambahkan link Email
  const addEmail = () => {
    append({ label: "Email", url: "mailto:", icon: "mail" })
  }

  // Handle platform selection
  const handlePlatformSelect = (platform: string) => {
    setValue(`links.${currentLinkIndex}.label`, platform)
    setValue(`links.${currentLinkIndex}.icon`, getPlatformIcon(platform))

    // Set default URL format based on platform
    if (platform === "WhatsApp") {
      setValue(`links.${currentLinkIndex}.url`, "https://wa.me/")
    } else if (platform === "Email") {
      setValue(`links.${currentLinkIndex}.url`, "mailto:")
    } else if (platform === "Telegram") {
      setValue(`links.${currentLinkIndex}.url`, "https://t.me/")
    } else if (platform === "Instagram") {
      setValue(`links.${currentLinkIndex}.url`, "https://instagram.com/")
    } else if (platform === "GitHub") {
      setValue(`links.${currentLinkIndex}.url`, "https://github.com/")
    } else if (platform === "LinkedIn") {
      setValue(`links.${currentLinkIndex}.url`, "https://linkedin.com/in/")
    }

    setShowPlatformModal(false)
  }

  const openPlatformSelector = (index: number) => {
    setCurrentLinkIndex(index)
    setShowPlatformModal(true)
  }

  // Render platform icon
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#181717]" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        )
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2]" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        )
      case "twitter":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1DA1F2]" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        )
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#E4405F]" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2]" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF0000]" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case "whatsapp":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.463 3.488C18.217 1.24 15.231 0.001 12.05 0C5.495 0 0.16 5.334 0.157 11.892c-0.001 2.096 0.547 4.142 1.588 5.946L0.057 24l6.304-1.654c1.737 0.948 3.693 1.447 5.683 1.448h0.005c6.554 0 11.89-5.335 11.893-11.893 0.002-3.177-1.234-6.163-3.479-8.413ZM12.05 21.785h-0.004c-1.774 0-3.513-0.477-5.031-1.378l-0.361-0.214-3.741 0.981 0.999-3.648-0.235-0.374c-0.99-1.574-1.512-3.393-1.511-5.26 0.002-5.45 4.437-9.884 9.889-9.884 2.64 0.001 5.122 1.031 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.993-0.003 5.45-4.437 9.886-9.885 9.886Zm5.43-7.403c-0.3-0.15-1.767-0.872-2.04-0.972-0.273-0.097-0.472-0.148-0.67 0.15-0.2 0.297-0.767 0.972-0.94 1.17-0.174 0.2-0.347 0.223-0.646 0.075-0.3-0.15-1.263-0.465-2.403-1.485-0.888-0.795-1.489-1.77-1.663-2.07-0.174-0.3-0.019-0.465 0.13-0.615 0.134-0.135 0.3-0.345 0.45-0.52 0.15-0.174 0.2-0.3 0.3-0.499 0.099-0.2 0.05-0.375-0.025-0.524-0.075-0.15-0.672-1.62-0.922-2.206-0.242-0.58-0.487-0.5-0.672-0.51-0.172-0.01-0.371-0.01-0.57-0.01-0.2 0-0.522 0.074-0.797 0.375-0.274 0.3-1.045 1.02-1.045 2.475 0 1.455 1.075 2.875 1.224 3.074 0.15 0.2 2.11 3.22 5.11 4.512 0.714 0.31 1.27 0.492 1.705 0.632 0.716 0.227 1.368 0.195 1.883 0.118 0.574-0.085 1.767-0.72 2.016-1.42 0.25-0.697 0.25-1.293 0.174-1.418-0.075-0.124-0.274-0.198-0.574-0.347Z"
            />
          </svg>
        )
      case "telegram":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#26A5E4]" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        )
      case "email":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#EA4335]" fill="currentColor">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
          </svg>
        )
      case "medium":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#000000]" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
          </svg>
        )
      case "dribbble":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#EA4C89]" fill="currentColor">
            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
          </svg>
        )
      case "behance":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1769FF]" fill="currentColor">
            <path d="M0 4.48v14.763h7.155c.645 0 1.262-.08 1.88-.241a4.57 4.57 0 001.575-.723 3.53 3.53 0 001.073-1.205c.263-.482.395-1.046.395-1.685 0-.803-.183-1.478-.555-2.033-.367-.544-.937-.938-1.71-1.17.55-.267.967-.636 1.259-1.121.287-.474.43-1.066.43-1.772 0-.593-.107-1.097-.322-1.528-.221-.426-.526-.773-.913-1.034-.381-.25-.83-.448-1.343-.567-.513-.119-1.066-.176-1.66-.176H0zm15.667 0v1.412h5.556V4.48h-5.556zm-10.51 2.505h2.813c.263 0 .513.028.75.08.247.063.455.155.627.29.17.134.306.313.41.531.1.22.15.485.15.783 0 .574-.17.989-.507 1.265-.339.267-.783.407-1.33.407h-2.914V6.985zm10.51 2.042c-.605 0-1.157.096-1.657.29-.5.191-.934.459-1.294.793-.36.336-.641.734-.837 1.206-.197.464-.296.974-.296 1.528 0 .566.099 1.082.296 1.547.198.465.478.86.837 1.205.36.336.794.6 1.294.782.5.183 1.052.279 1.657.279.69 0 1.31-.11 1.859-.324.549-.214 1.015-.515 1.402-.897.382-.387.675-.846.88-1.381.204-.535.307-1.117.307-1.752 0-.146-.006-.293-.016-.435H16.21c0-.455.094-.848.286-1.187.2-.338.603-.511 1.2-.511.323 0 .595.08.814.233.213.146.345.359.39.628h2.909c-.116-.861-.507-1.511-1.173-1.957-.667-.445-1.46-.668-2.368-.668zm-10.51.435h3.061c.55 0 .989.116 1.324.348.33.233.494.61.494 1.139 0 .33-.053.6-.156.815-.104.213-.242.383-.415.51a1.635 1.635 0 01-.597.279 2.59 2.59 0 01-.695-.056c-.224-.116-.39-.31-.5-.582v-1.943zm10.51 3.478c-.247.282-.58.489-1.002.62-.422.13-.91.195-1.462.195-.549 0-1.033-.064-1.45-.191-.422-.127-.75-.328-.982-.603-.232-.275-.349-.622-.349-1.04 0-.418.117-.764.349-1.034.232-.271.56-.472.982-.603.417-.127.9-.191 1.45-.191.552 0 1.04.064 1.462.195.422.13.755.336.998.62.243.282.365.634.365 1.056 0 .422-.122.774-.365 1.056z" />
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="currentColor">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z" />
          </svg>
        )
    }
  }

  const LinkItem = ({ index }: { index: number }) => {
    const link = watch(`links.${index}`) || {}
    const platform = link.label || ""

    return (
      <div key={fields[index].id} className="flex items-center space-x-2">
        <div className="relative flex items-center">
          {platform ? (
            renderPlatformIcon(platform)
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="currentColor">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z" />
            </svg>
          )}
        </div>
        <div className="grid gap-1.5 flex-1">
          <Label htmlFor={`links.${index}.label`}>Platform</Label>
          <Input
            id={`links.${index}.label`}
            type="text"
            value={platform}
            className="col-span-3"
            onClick={() => openPlatformSelector(index)}
            readOnly
          />
          {errors.links?.[index]?.label && (
            <p className="text-sm text-red-500">{errors.links?.[index]?.label?.message}</p>
          )}
          <Label htmlFor={`links.${index}.url`}>URL</Label>
          <Input id={`links.${index}.url`} type="url" className="col-span-3" {...register(`links.${index}.url`)} />
          {errors.links?.[index]?.url && <p className="text-sm text-red-500">{errors.links?.[index]?.url?.message}</p>}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>Tambahkan link ke profil Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {fields.map((item, index) => (
            <LinkItem key={item.id} index={index} />
          ))}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={addLink} className="rounded-full">
              Tambah Link
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addWhatsApp} className="rounded-full">
              Tambah WhatsApp
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addEmail} className="rounded-full">
              Tambah Email
            </Button>
          </div>
          {validationError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          {saveSuccess && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Links saved successfully!</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isSubmitting} className="rounded-full">
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </CardContent>

      {/* iOS-style Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-center">Select Platform</h2>
            </div>
            <div className="divide-y">
              {PLATFORM_OPTIONS.map((platform) => (
                <div
                  key={platform.value}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handlePlatformSelect(platform.value)}
                >
                  <div className="flex-1 flex items-center">
                    <div className="mr-3">{renderPlatformIcon(platform.value.toLowerCase())}</div>
                    <span>{platform.label}</span>
                  </div>
                  {selectedPlatform === platform.value && <Check className="h-5 w-5 text-blue-500" />}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full rounded-full" onClick={() => setShowPlatformModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
