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
  const platforms = [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Facebook",
    "Instagram",
    "YouTube",
    "WhatsApp",
    "Telegram",
    "Email",
    "Medium",
    "Dribbble",
    "Behance",
    "Portfolio",
    "Blog",
    "Other",
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
  const handlePlatformSelect = (index: number, platform: string) => {
    setValue(`links.${index}.label`, platform)
    setValue(`links.${index}.icon`, getPlatformIcon(platform))

    // Set default URL format based on platform
    if (platform === "WhatsApp") {
      setValue(`links.${index}.url`, "https://wa.me/")
    } else if (platform === "Email") {
      setValue(`links.${index}.url`, "mailto:")
    } else if (platform === "Telegram") {
      setValue(`links.${index}.url`, "https://t.me/")
    } else if (platform === "Instagram") {
      setValue(`links.${index}.url`, "https://instagram.com/")
    } else if (platform === "GitHub") {
      setValue(`links.${index}.url`, "https://github.com/")
    } else if (platform === "LinkedIn") {
      setValue(`links.${index}.url`, "https://linkedin.com/in/")
    }
  }

  // Show platform selection modal
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)

  const openPlatformSelector = (index: number) => {
    setCurrentLinkIndex(index)
    setShowPlatformModal(true)
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Kontak & Media Sosial</CardTitle>
        <CardDescription>
          Tambahkan informasi kontak dan link media sosial Anda agar orang lain dapat menghubungi Anda dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validationError && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={addLink} variant="outline" size="sm" className="rounded-full">
                + Link Baru
              </Button>
              <Button type="button" onClick={addWhatsApp} variant="outline" size="sm" className="rounded-full">
                + WhatsApp
              </Button>
              <Button type="button" onClick={addEmail} variant="outline" size="sm" className="rounded-full">
                + Email
              </Button>
            </div>

            {fields.map((field, index) => {
              // Watch URL untuk mendeteksi platform
              const url = watch(`links.${index}.url`)
              const detectedPlatform = detectPlatform(url)

              return (
                <div key={field.id} className="p-4 border border-gray-200 rounded-xl space-y-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Link #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                      >
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`links.${index}.label`} className="flex items-center">
                        Platform/Label <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div
                        className="mt-1 h-12 px-3 py-2 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer"
                        onClick={() => openPlatformSelector(index)}
                      >
                        <span className={!field.label ? "text-gray-400" : ""}>{field.label || "Pilih platform"}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      <input type="hidden" {...register(`links.${index}.label`)} defaultValue={field.label} />
                      {errors.links?.[index]?.label && (
                        <p className="text-red-500 text-xs mt-1">{errors.links[index]?.label?.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`links.${index}.url`} className="flex items-center">
                        URL/Alamat <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id={`links.${index}.url`}
                        {...register(`links.${index}.url`)}
                        placeholder={
                          field.label === "WhatsApp"
                            ? "https://wa.me/628123456789"
                            : field.label === "Email"
                              ? "mailto:email@example.com"
                              : "https://example.com"
                        }
                        defaultValue={field.url}
                        className="rounded-xl h-12"
                      />
                      {errors.links?.[index]?.url && (
                        <p className="text-red-500 text-xs mt-1">{errors.links[index]?.url?.message}</p>
                      )}
                      {field.label === "WhatsApp" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Format: https://wa.me/628123456789 (tanpa tanda + atau spasi)
                        </p>
                      )}
                      {field.label === "Email" && (
                        <p className="text-xs text-gray-500 mt-1">Format: mailto:email@example.com</p>
                      )}
                    </div>
                  </div>

                  <input
                    type="hidden"
                    {...register(`links.${index}.icon`)}
                    defaultValue={field.icon || getPlatformIcon(field.label)}
                  />
                </div>
              )
            })}

            {fields.length === 0 && (
              <Alert>
                <AlertTitle>Belum ada link</AlertTitle>
                <AlertDescription>
                  Klik tombol "Link Baru", "WhatsApp", atau "Email" untuk menambahkan kontak.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="rounded-full h-12 px-6 relative overflow-hidden">
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Menyimpan...
                </span>
              ) : saveSuccess ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Tersimpan!
                </span>
              ) : (
                "Simpan & Lanjutkan"
              )}
            </Button>
          </div>
        </form>

        {/* Platform Selection Modal */}
        {showPlatformModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Pilih platform</h3>
                <button
                  type="button"
                  onClick={() => setShowPlatformModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      handlePlatformSelect(currentLinkIndex, platform)
                      setShowPlatformModal(false)
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-gray-600">{platform.charAt(0)}</span>
                    </div>
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
