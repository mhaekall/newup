import { z } from "zod"

// Helper function to format URL
const formatUrl = (url: string) => {
  if (!url) return ""

  // If URL doesn't start with http:// or https://, add https://
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
    return `https://${url}`
  }

  return url
}

// Very lenient URL validation
const urlSchema = z.string().trim().transform(formatUrl)

// Email validation
export const emailSchema = z.string().trim().email({ message: "Email tidak valid" }).or(z.literal(""))

// Username validation
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "Username minimal 3 karakter" })
  .max(30, { message: "Username maksimal 30 karakter" })
  .refine((val) => /^[a-z0-9_-]+$/i.test(val), {
    message: "Username hanya boleh berisi huruf, angka, underscore, dan dash",
  })

// Link schema
export const linkSchema = z.object({
  label: z.string().optional(),
  url: urlSchema,
  icon: z.string().optional(),
})

// Education schema
export const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institusi harus diisi" }),
  degree: z.string().min(1, { message: "Gelar harus diisi" }),
  field: z.string().min(1, { message: "Bidang studi harus diisi" }),
  startDate: z.string().min(1, { message: "Tanggal mulai harus diisi" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

// Experience schema
export const experienceSchema = z.object({
  company: z.string().min(1, { message: "Perusahaan harus diisi" }),
  position: z.string().min(1, { message: "Posisi harus diisi" }),
  startDate: z.string().min(1, { message: "Tanggal mulai harus diisi" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
})

// Skill schema
export const skillSchema = z.object({
  name: z.string().min(1, { message: "Nama skill harus diisi" }),
  level: z.number().min(1).max(5).optional(),
  category: z.string().optional(),
})

// Project schema
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Judul proyek harus diisi" }),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  url: urlSchema.optional(),
  image: z.string().optional(),
})

// Complete profile schema
export const ProfileSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  username: usernameSchema,
  name: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  bio: z.string().optional(),
  profile_image: z.string().optional(),
  banner_image: z.string().optional(),
  template_id: z.string().optional(),
  links: z.array(linkSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  skills: z.array(skillSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
})

// Basic profile schema
export const basicProfileSchema = z.object({
  username: usernameSchema,
  name: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  bio: z.string().optional(),
})

// Links form schema
export const linksFormSchema = z.object({
  links: z.array(linkSchema),
})

// Education form schema
export const educationFormSchema = z.object({
  education: z.array(educationSchema),
})

// Experience form schema
export const experienceFormSchema = z.object({
  experience: z.array(experienceSchema),
})

// Skills form schema
export const skillsFormSchema = z.object({
  skills: z.array(skillSchema),
})

// Projects form schema
export const projectsFormSchema = z.object({
  projects: z.array(projectSchema),
})

// Alias for ProfileSchema
export const ProfileFormSchema = ProfileSchema

// Profile schema with YouTube URL
export const profileSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and hyphens",
    }),
  name: z.string().min(1, { message: "Name is required" }),
  bio: z.string().optional(),
  title: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  links: z.array(
    z.object({
      platform: z.string(),
      url: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.number().min(1).max(5),
      category: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    }),
  ),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
      location: z.string(),
    }),
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      url: z.string().optional().or(z.literal("")),
      image: z.string().optional(),
    }),
  ),
  templateId: z.number().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
