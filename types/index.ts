import type React from "react"

export type Link = {
  label: string
  url: string
  icon?: string
}

export type Education = {
  institution: string
  degree: string
  field?: string
  startDate?: string
  endDate?: string | null
  description?: string | null
}

export type Experience = {
  company: string
  position: string
  startDate?: string
  endDate?: string | null
  description?: string | null
  location?: string | null
}

export type Project = {
  title: string
  description?: string | null
  technologies?: string[] | null
  url?: string | null
  image?: string | null
}

export type Skill = {
  name: string
  level?: number
  category?: string
}

export type ContactInfo = {
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  telegram?: string | null
  website?: string | null
}

export type Profile = {
  id?: string
  user_id: string
  username: string
  name: string
  bio?: string
  template_id?: string
  profile_image?: string | null
  banner_image?: string | null
  cv_url?: string | null
  links?: Link[] | null
  education?: Education[] | null
  experience?: Experience[] | null
  skills?: Skill[] | null
  projects?: Project[] | null
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
