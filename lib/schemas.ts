import { z } from "zod"

// Schema untuk Link
export const LinkSchema = z.object({
  label: z.string().min(1, "Label is required").max(50, "Label too long"),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .transform((url) => {
      // Ensure URL has protocol
      if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`
      }
      return url
    }),
  icon: z.string().optional(),
})

// Schema untuk Education
export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(100),
  degree: z.string().min(1, "Degree is required").max(100),
  field: z.string().min(1, "Field is required").max(100),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().max(500).optional(),
})

// Schema untuk Experience
export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(100),
  position: z.string().min(1, "Position is required").max(100),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
})

// Schema untuk Skill
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50),
  level: z.number().min(1).max(5),
  category: z.string().min(1, "Category is required"),
})

// Schema untuk Project
export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title is required").max(100),
  description: z.string().max(500).optional(),
  technologies: z.array(z.string()).optional(),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  image: z.string().optional(),
})

// Schema untuk Profile
export const ProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().min(1, "User ID is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, underscores, and hyphens"),
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  links: z.array(LinkSchema).optional().default([]),
  template_id: z.string().min(1, "Template ID is required"),
  profile_image: z.string().optional(),
  banner_image: z.string().optional(),
  education: z.array(EducationSchema).optional().default([]),
  experience: z.array(ExperienceSchema).optional().default([]),
  skills: z.array(SkillSchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
})

// Schema untuk validasi input dari form
export const ProfileFormSchema = ProfileSchema.omit({ id: true }).extend({
  links: z.array(LinkSchema.partial()).optional().default([]),
  education: z.array(EducationSchema.partial()).optional().default([]),
  experience: z.array(ExperienceSchema.partial()).optional().default([]),
  skills: z.array(SkillSchema.partial()).optional().default([]),
  projects: z.array(ProjectSchema.partial()).optional().default([]),
})
