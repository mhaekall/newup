import type React from "react"

export type Link = {
  label: string
  url: string
  icon?: string
}

export type Education = {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export type Experience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  location: string
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  url?: string
  image?: string
}

export type Skill = {
  name: string
  level: number // 1-5
  category: string
}

export type ContactInfo = {
  id?: string
  profile_id?: string
  email?: string
  phone?: string
  whatsapp?: string
  telegram?: string
  website?: string
}

export type Profile = {
  id?: string
  user_id: string
  username: string
  name: string
  bio: string
  links: Link[]
  template_id: string
  profile_image?: string
  banner_image?: string
  education: Education[] // Pastikan ini selalu ada dan tidak undefined
  experience: Experience[]
  skills: Skill[]
  projects: Project[]
  contactInfo?: ContactInfo | null
}

export type Template = {
  id: string
  name: string
  component: React.ComponentType<{ profile: Profile }>
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Profile
        Update: Partial<Profile>
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          image: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          image?: string
          created_at?: string
        }
        Update: Partial<{
          id: string
          email: string
          name: string
          image: string
          created_at: string
        }>
      }
    }
  }
}

// Extend the next-auth session type to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export type SocialLink = {
  platform: string
  url: string
}
