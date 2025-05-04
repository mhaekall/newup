"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { formatUrl } from "@/lib/utils"

// Schema untuk validasi form
const contactSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }).or(z.string().length(0)),
  phone: z
    .string()
    .regex(/^(\+?[0-9]{10,15})?$/, { message: "Nomor telepon tidak valid" })
    .or(z.string().length(0)),
  whatsapp: z
    .string()
    .regex(/^(\+?[0-9]{10,15})?$/, { message: "Nomor WhatsApp tidak valid" })
    .or(z.string().length(0)),
  telegram: z.string().or(z.string().length(0)),
  website: z.string().url({ message: "URL website tidak valid" }).or(z.string().length(0)),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactStepProps {
  initialData: {
    email?: string
    phone?: string
    whatsapp?: string
    telegram?: string
    website?: string
  }
  onSave: (data: ContactFormData) => void
}

export function ContactStep({ initialData, onSave }: ContactStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: initialData.email || "",
      phone: initialData.phone || "",
      whatsapp: initialData.whatsapp || "",
      telegram: initialData.telegram || "",
      website: initialData.website || "",
    },
  })

  const onSubmit = (data: ContactFormData) => {
    // Format website URL jika ada
    if (data.website) {
      data.website = formatUrl(data.website)
    }

    onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Kontak</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.email && <Alert className="mt-1 py-1 text-sm text-red-500">{errors.email.message}</Alert>}
              <p className="text-sm text-gray-500 mt-1">Email yang akan ditampilkan di profil Anda</p>
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+628123456789"
                    {...field}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.phone && <Alert className="mt-1 py-1 text-sm text-red-500">{errors.phone.message}</Alert>}
              <p className="text-sm text-gray-500 mt-1">Format: +628123456789 (opsional)</p>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Controller
                name="whatsapp"
                control={control}
                render={({ field }) => (
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+628123456789"
                    {...field}
                    className={errors.whatsapp ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.whatsapp && <Alert className="mt-1 py-1 text-sm text-red-500">{errors.whatsapp.message}</Alert>}
              <p className="text-sm text-gray-500 mt-1">Format: +628123456789 (opsional)</p>
            </div>

            <div>
              <Label htmlFor="telegram">Username Telegram</Label>
              <Controller
                name="telegram"
                control={control}
                render={({ field }) => (
                  <Input
                    id="telegram"
                    type="text"
                    placeholder="username"
                    {...field}
                    className={errors.telegram ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.telegram && <Alert className="mt-1 py-1 text-sm text-red-500">{errors.telegram.message}</Alert>}
              <p className="text-sm text-gray-500 mt-1">Tanpa tanda @ (opsional)</p>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    {...field}
                    className={errors.website ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.website && <Alert className="mt-1 py-1 text-sm text-red-500">{errors.website.message}</Alert>}
              <p className="text-sm text-gray-500 mt-1">URL website pribadi Anda (opsional)</p>
            </div>
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
