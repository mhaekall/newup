export type Link = {
  id: string
  platform: string
  url: string
  icon: string
  visible: boolean
}

export type Education = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export type Experience = {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export type Skill = {
  id: string
  name: string
  level: "Beginner" | "Elementary" | "Intermediate" | "Advanced" | "Expert"
  category: string
}

export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  url?: string
  image?: string
}

export type Portfolio = {
  id?: string
  userId: string
  username: string
  name: string
  bio: string
  profileImage?: string
  bannerImage?: string
  links: Link[]
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  projects: Project[]
  templateId: string
  createdAt?: string
  updatedAt?: string
}
