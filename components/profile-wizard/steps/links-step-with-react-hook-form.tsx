"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUrl } from "@/lib/utils"
import { useState } from "react"

// Schema untuk validasi link
const linkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, { message: "Label harus diisi" }),
  url: z.string().min(1, { message: "URL harus diisi" }),
  icon: z.string().optional(),
})

// Schema untuk validasi form
const linksFormSchema = z.object({
  links: z.array(linkSchema),
})

type LinkFormData = z.infer<typeof linksFormSchema>

interface LinksStepProps {
  initialLinks: Array<{
    id?: string
    label: string
    url: string
    icon?: string
  }>
  onSave: (links: LinkFormData["links"]) => void
}

export function LinksStepWithReactHookForm({ initialLinks = [], onSave }: LinksStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pastikan setiap link memiliki ID
  const linksWithIds = initialLinks.map((link) => ({
    ...link,
    id: link.id || crypto.randomUUID(),
  }))

  // Jika tidak ada link, tambahkan satu link kosong
  const defaultLinks =
    linksWithIds.length > 0 ? linksWithIds : [{ id: crypto.randomUUID(), label: "", url: "", icon: "" }]

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linksFormSchema),
    defaultValues: {
      links: defaultLinks,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  })

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
    "Website",
    "Portfolio",
    "Blog",
    "Other",
  ]

  const addLink = () => {
    append({ id: crypto.randomUUID(), label: "", url: "", icon: "" })
  }

  const onSubmit = (data: LinkFormData) => {
    setIsSubmitting(true)

    // Format URLs before saving
    const formattedLinks = data.links.map((link) => ({
      ...link,
      url: formatUrl(link.url),
    }))

    onSave(formattedLinks)
    setIsSubmitting(false)
  }

  // Auto-detect icon based on URL
  const getIconFromUrl = (url: string): string => {
    if (!url) return ""

    const domain = url.toLowerCase()
    if (domain.includes("github")) return "github"
    if (domain.includes("linkedin")) return "linkedin"
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter"
    if (domain.includes("instagram")) return "instagram"
    if (domain.includes("facebook")) return "facebook"
    if (domain.includes("youtube")) return "youtube"
    if (domain.includes("wa.me") || domain.includes("whatsapp")) return "whatsapp"
    if (domain.includes("t.me") || domain.includes("telegram")) return "telegram"
    if (domain.includes("mailto:") || domain.includes("@")) return "email"
    return "link"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Sosial & Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link Media Sosial & Website</Label>
              <Button type="button" onClick={addLink} variant="outline" size="sm">
                Tambah Link
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Tambahkan link ke profil media sosial, website, atau kontak Anda. Pengunjung dapat mengklik link ini untuk
              menghubungi Anda.
            </p>
          </div>

          {fields.map((field, index) => (
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
                  <Label htmlFor={`links.${index}.label`}>Label</Label>
                  <Input
                    id={`links.${index}.label`}
                    placeholder="GitHub, LinkedIn, dll."
                    {...register(`links.${index}.label`)}
                    className={errors.links?.[index]?.label ? "border-red-500" : ""}
                  />
                  {errors.links?.[index]?.label && (
                    <p className="text-red-500 text-sm mt-1">{errors.links?.[index]?.label?.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`links.${index}.icon`}>Jenis</Label>
                  <Select
                    id={`links.${index}.icon`}
                    {...register(`links.${index}.icon`)}
                    defaultValue={getIconFromUrl(watch(`links.${index}.url`) || "")}
                  >
                    <option value="">Pilih Jenis</option>
                    {platforms.map((platform) => (
                      <option key={platform} value={platform.toLowerCase()}>
                        {platform}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor={`links.${index}.url`}>URL</Label>
                  <Input
                    id={`links.${index}.url`}
                    placeholder="https://github.com/username"
                    {...register(`links.${index}.url`)}
                    className={errors.links?.[index]?.url ? "border-red-500" : ""}
                  />
                  {errors.links?.[index]?.url && (
                    <p className="text-red-500 text-sm mt-1">{errors.links?.[index]?.url?.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Contoh: https://github.com/username, https://linkedin.com/in/username
                  </p>
                </div>
              </div>
            </div>
          ))}

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
