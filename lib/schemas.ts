import { z } from "zod"

// Helper function untuk memvalidasi dan memformat URL
const formatUrl = (url: string) => {
  if (!url) return ""

  // Jika URL tidak dimulai dengan http:// atau https://, tambahkan https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }

  return url
}

// Skema untuk validasi URL
export const urlSchema = z
  .string()
  .trim()
  .refine((val) => !val || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val), {
    message: "URL tidak valid",
  })
  .transform(formatUrl)

// Skema untuk validasi email
export const emailSchema = z.string().trim().email({ message: "Email tidak valid" }).or(z.literal(""))

// Skema untuk validasi username
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "Username minimal 3 karakter" })
  .max(30, { message: "Username maksimal 30 karakter" })
  .refine((val) => /^[a-z0-9_-]+$/i.test(val), {
    message: "Username hanya boleh berisi huruf, angka, underscore, dan dash",
  })

// Skema untuk validasi link
export const linkSchema = z.object({
  label: z.string().min(1, { message: "Label harus diisi" }),
  url: urlSchema,
  icon: z.string().optional(),
})

// Skema untuk validasi pendidikan
export const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institusi harus diisi" }),
  degree: z.string().min(1, { message: "Gelar harus diisi" }),
  field: z.string().min(1, { message: "Bidang studi harus diisi" }),
  startDate: z.string().min(1, { message: "Tanggal mulai harus diisi" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

// Skema untuk validasi pengalaman
export const experienceSchema = z.object({
  company: z.string().min(1, { message: "Perusahaan harus diisi" }),
  position: z.string().min(1, { message: "Posisi harus diisi" }),
  startDate: z.string().min(1, { message: "Tanggal mulai harus diisi" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
})

// Skema untuk validasi skill
export const skillSchema = z.object({
  name: z.string().min(1, { message: "Nama skill harus diisi" }),
  level: z.number().min(1).max(5).optional(),
  category: z.string().optional(),
})

// Skema untuk validasi proyek
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Judul proyek harus diisi" }),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  url: urlSchema.optional(),
  image: z.string().optional(),
})

// Skema untuk validasi profil lengkap
export const ProfileSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  username: usernameSchema,
  name: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  bio: z.string().optional(),
  profile_image: z.string().optional(),
  banner_image: z.string().optional(),
  template_id: z.string().optional(),
  links: z.array(linkSchema).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
})

// Skema untuk validasi form profil dasar
export const basicProfileSchema = z.object({
  username: usernameSchema,
  name: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  bio: z.string().optional(),
})

// Skema untuk validasi form links
export const linksFormSchema = z.object({
  links: z.array(linkSchema),
})

// Skema untuk validasi form pendidikan
export const educationFormSchema = z.object({
  education: z.array(educationSchema),
})

// Skema untuk validasi form pengalaman
export const experienceFormSchema = z.object({
  experience: z.array(experienceSchema),
})

// Skema untuk validasi form skills
export const skillsFormSchema = z.object({
  skills: z.array(skillSchema),
})

// Skema untuk validasi form proyek
export const projectsFormSchema = z.object({
  projects: z.array(projectSchema),
})

export const ProfileFormSchema = ProfileSchema
