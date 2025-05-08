"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUrl } from "@/lib/utils"
import { useState } from "react"
import { SocialMediaIcon } from "@/components/social-media-icons"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Search } from "lucide-react"

// Schema untuk validasi link
const linkSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  url: z.string().optional(),
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
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

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
    setValue,
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
    { name: "GitHub", icon: "github" },
    { name: "LinkedIn", icon: "linkedin" },
    { name: "Twitter", icon: "twitter" },
    { name: "Instagram", icon: "instagram" },
    { name: "Facebook", icon: "facebook" },
    { name: "YouTube", icon: "youtube" },
    { name: "TikTok", icon: "tiktok" },
    { name: "WhatsApp", icon: "whatsapp" },
    { name: "Telegram", icon: "telegram" },
    { name: "Discord", icon: "discord" },
    { name: "Snapchat", icon: "snapchat" },
    { name: "Pinterest", icon: "pinterest" },
    { name: "Reddit", icon: "reddit" },
    { name: "Twitch", icon: "twitch" },
    { name: "Dribbble", icon: "dribbble" },
    { name: "Behance", icon: "behance" },
    { name: "Medium", icon: "medium" },
    { name: "Email", icon: "mail" },
    { name: "Phone", icon: "phone" },
    { name: "Website", icon: "globe" },
  ]

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addLink = () => {
    append({ id: crypto.randomUUID(), label: "", url: "", icon: "" })
  }

  const onSubmit = (data: LinkFormData) => {
    setIsSubmitting(true)

    // Format URLs before saving
    const formattedLinks = data.links.map((link) => ({
      ...link,
      url: formatUrl(link.url || ""),
    }))

    onSave(formattedLinks)
    setIsSubmitting(false)
  }

  const openPlatformSelector = (index: number) => {
    setCurrentLinkIndex(index)
    setShowPlatformSelector(true)
    setSearchTerm("")
  }

  const selectPlatform = (platform: string, icon: string) => {
    setValue(`links.${currentLinkIndex}.label`, platform)
    setValue(`links.${currentLinkIndex}.icon`, icon)
    setShowPlatformSelector(false)
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
    <Card className="rounded-xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-medium text-gray-800">Media Sosial & Link</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link Media Sosial & Website</Label>
              <Button
                type="button"
                onClick={addLink}
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Link
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Tambahkan link ke profil media sosial, website, atau kontak Anda. Pengunjung dapat mengklik link ini untuk
              menghubungi Anda.
            </p>
          </div>

          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4 hover:border-blue-200 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Link #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`links.${index}.label`}>Platform</Label>
                  <div
                    className="h-12 px-3 mt-1 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors duration-200"
                    onClick={() => openPlatformSelector(index)}
                  >
                    <div className="flex items-center">
                      {watch(`links.${index}.icon`) ? (
                        <>
                          <SocialMediaIcon platform={watch(`links.${index}.icon`) || ""} className="h-5 w-5 mr-2" />
                          <span>{watch(`links.${index}.label`) || "Pilih Platform"}</span>
                        </>
                      ) : (
                        <span>Pilih Platform</span>
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
                  </div>
                  <input type="hidden" {...register(`links.${index}.label`)} />
                  <input type="hidden" {...register(`links.${index}.icon`)} />
                </div>

                <div>
                  <Label htmlFor={`links.${index}.url`}>URL</Label>
                  <Input
                    id={`links.${index}.url`}
                    placeholder="https://github.com/username"
                    {...register(`links.${index}.url`)}
                    className={`mt-1 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.links?.[index]?.url ? "border-red-500" : ""}`}
                  />
                  {errors.links?.[index]?.url && (
                    <p className="text-red-500 text-sm mt-1">{errors.links?.[index]?.url?.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Contoh: https://github.com/username, https://linkedin.com/in/username
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="rounded-xl px-6">
              {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
            </Button>
          </div>
        </form>

        {/* Platform Selector - iOS Style Modal */}
        <AnimatePresence>
          {showPlatformSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
              onClick={() => setShowPlatformSelector(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-md rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-center mb-3">Pilih Platform</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Cari platform..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-full h-10 bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto p-2 flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredPlatforms.map((platform) => (
                      <motion.button
                        key={platform.name}
                        type="button"
                        className={`text-left p-4 rounded-xl flex flex-col items-center justify-center border ${
                          watch(`links.${currentLinkIndex}.label`) === platform.name
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "border-gray-200"
                        }`}
                        onClick={() => selectPlatform(platform.name, platform.icon)}
                        whileHover={{ backgroundColor: "#F9FAFB", y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <SocialMediaIcon platform={platform.icon} className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">{platform.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <Button
                    onClick={() => setShowPlatformSelector(false)}
                    className="w-full rounded-full h-12 text-base"
                    variant="outline"
                  >
                    Batal
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
