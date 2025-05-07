"use client"

import { useState } from "react"
import { ProfileWizard } from "./profile-wizard"
import type { Profile } from "@/types"

interface ModernOnboardingWizardProps {
  initialData?: Partial<Profile>
  userId: string
}

export function ModernOnboardingWizard({ initialData, userId }: ModernOnboardingWizardProps) {
  const [profile, setProfile] = useState<Profile>({
    user_id: userId,
    username: "",
    name: "",
    bio: "",
    links: [],
    template_id: "template1",
    profile_image: "",
    banner_image: "",
    education: [],
    experience: [],
    skills: [],
    projects: [],
  })

  return <ProfileWizard initialData={profile} userId={userId} />
}
