"use client"

import { useState } from "react"
import { ProfileWizard } from "./profile-wizard"
import type { Profile } from "@/types"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ModernOnboardingWizardProps {
  initialData?: Partial<Profile>
  userId: string
}

export function ModernOnboardingWizard({ initialData, userId }: ModernOnboardingWizardProps) {
  const [profile, setProfile] = useState<Profile>({
    user_id: userId,
    username: initialData?.username || "",
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    links: initialData?.links || [],
    template_id: initialData?.template_id || "template1",
    profile_image: initialData?.profile_image || "",
    banner_image: initialData?.banner_image || "",
    education: initialData?.education || [],
    experience: initialData?.experience || [],
    skills: initialData?.skills || [],
    projects: initialData?.projects || [],
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

  const [hasChanges, setHasChanges] = useState(false)

  const handleProfileUpdate = (changes: Partial<Profile>) => {
    // Make sure we're not overwriting the username when updating other fields
    setProfile((prev) => ({
      ...prev,
      ...changes,
      // Ensure username remains the same unless explicitly changed
      username: changes.username !== undefined ? changes.username : prev.username,
    }))

    // Mark as changed to enable the save button
    setHasChanges(true)
  }

  return (
    <ProfileWizard
      initialData={profile}
      userId={userId}
      isMobile={isMobile}
      onProfileUpdate={handleProfileUpdate}
      hasChanges={hasChanges}
    />
  )
}
