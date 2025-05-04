"use client"

import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { formatUrl } from "@/lib/utils"
import type { Profile } from "@/types"

// Schema untuk validasi link
const linkSchema = z.object({
  label: z.string().min(1, "Label harus diisi"),
  url: z.string().min(1, "URL harus diisi").transform(formatUrl),
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

  // Inisialisasi form dengan React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
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
    if (lowerUrl.includes("medium.com")) return "Medium"
    if (lowerUrl.includes("dribbble.com")) return "Dribbble"
    if (lowerUrl.includes("behance.net")) return "Behance"

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

  // Fungsi untuk menyimpan data
  const onSubmit = async (data: LinksFormValues) => {
    setIsSubmitting(true)
    try {
      // Format URLs dan tambahkan ikon berdasarkan platform
      const formattedLinks = data.links.map((link) => ({
        ...link,
        url: formatUrl(link.url),
        icon: link.icon || getPlatformIcon(link.label),
      }))

      // Update profile dengan links yang sudah diformat
      updateProfile({ links: formattedLinks })
      console.log("Links saved:", formattedLinks)
    } catch (error) {
      console.error("Error saving links:", error)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontak & Media Sosial</CardTitle>
        <CardDescription>
          Tambahkan informasi kontak dan link media sosial Anda agar orang lain dapat menghubungi Anda dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={addLink} variant="outline" size="sm">
                + Link Baru
              </Button>
              <Button type="button" onClick={addWhatsApp} variant="outline" size="sm">
                + WhatsApp
              </Button>
              <Button type="button" onClick={addEmail} variant="outline" size="sm">
                + Email
              </Button>
            </div>

            {fields.map((field, index) => {
              // Watch URL untuk mendeteksi platform
              const url = watch(`links.${index}.url`)
              const detectedPlatform = detectPlatform(url)

              return (
                <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Link #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button type="button" onClick={() => remove(index)} variant="destructive" size="sm">
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`links.${index}.label`}>
                        Platform/Label <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        id={`links.${index}.label`}
                        {...register(`links.${index}.label`)}
                        defaultValue={field.label}
                      >
                        <option value="">Pilih platform</option>
                        {platforms.map((platform) => (
                          <option
                            key={platform}
                            value={platform}
                            selected={detectedPlatform === platform || field.label === platform}
                          >
                            {platform}
                          </option>
                        ))}
                      </Select>
                      {errors.links?.[index]?.label && (
                        <p className="text-red-500 text-sm mt-1">{errors.links[index]?.label?.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`links.${index}.url`}>
                        URL/Alamat <span className="text-red-500">*</span>
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
                      />
                      {errors.links?.[index]?.url && (
                        <p className="text-red-500 text-sm mt-1">{errors.links[index]?.url?.message}</p>
                      )}
                      {field.label === "WhatsApp" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Format: https://wa.me/628123456789 (tanpa tanda + atau spasi)
                        </p>
                      )}
                      {field.label === "Email" && (
                        <p className="text-sm text-gray-500 mt-1">Format: mailto:email@example.com</p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
