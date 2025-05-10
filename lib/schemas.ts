import { z } from "zod"

// URL validation regex - more permissive to allow various URL formats including Supabase storage URLs
const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/

// Link schema
export const LinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().refine((val) => !val || urlRegex.test(val), {
    message: "Please enter a valid URL",
  }),
  icon: z.string().optional(),
})

// Education schema
export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

// Experience schema
export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

// Skill schema
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(5).optional(),
  category: z.string().optional(),
})

// Project schema
export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional().nullable(),
})

// Contact info schema
export const ContactInfoSchema = z.object({
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
})

// Profile schema
export const ProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().min(1, "User ID is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  template_id: z.string().optional(),
  profile_image: z.string().optional().nullable(),
  banner_image: z.string().optional().nullable(),
  cv_url: z.string().optional().nullable(), // Allow any string format for CV URL
  links: z.array(LinkSchema).optional().nullable(),
  education: z.array(EducationSchema).optional().nullable(),
  experience: z.array(ExperienceSchema).optional().nullable(),
  skills: z.array(SkillSchema).optional().nullable(),
  projects: z.array(ProjectSchema).optional().nullable(),
  contactInfo: ContactInfoSchema.optional().nullable(),
})

export const ProfileFormSchema = ProfileSchema
