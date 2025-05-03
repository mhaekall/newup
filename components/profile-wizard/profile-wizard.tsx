"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WizardProvider } from "./wizard-context"
import { WizardProgress } from "./wizard-progress"
import { WizardNavigation } from "./wizard-navigation"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LinksStep } from "./steps/links-step"
import { EducationStep } from "./steps/education-step"
import { ExperienceStep } from "./steps/experience-step"
import { SkillsStep } from "./steps/skills-step"
import { ProjectsStep } from "./steps/projects-step"
import { updateProfile } from "@/lib/supabase"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useWizard } from "./wizard-context"
import type { Profile } from "@/types"

interface ProfileWizardContentProps {
  onSave: () => void
  isSaving: boolean
}

function ProfileWizardContent({ onSave, isSaving }: ProfileWizardContentProps) {
  const { currentStep } = useWizard()

  return (
    <div className="space-y-6">
      <WizardProgress />

      <div className="mt-6">
        {currentStep === 0 && <BasicInfoStep />}
        {currentStep === 1 && <LinksStep />}
        {currentStep === 2 && <EducationStep />}
        {currentStep === 3 && <ExperienceStep />}
        {currentStep === 4 && <SkillsStep />}
        {currentStep === 5 && <ProjectsStep />}
      </div>

      <WizardNavigation onSave={onSave} isSaving={isSaving} />
    </div>
  )
}

interface ProfileWizardProps {
  initialData: Profile
  userId: string
}

export function ProfileWizard({ initialData, userId }: ProfileWizardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Get the current profile data from the wizard context
      const wizardElement = document.getElementById("profile-wizard")
      if (!wizardElement) {
        throw new Error("Wizard element not found")
      }

      // @ts-ignore - Access the React component instance
      const wizardInstance = wizardElement.__REACT_INSTANCE__
      if (!wizardInstance || !wizardInstance.memoizedProps || !wizardInstance.memoizedProps.value) {
        throw new Error("Could not access wizard context")
      }

      const profile = wizardInstance.memoizedProps.value.profile

      // Validate required fields
      if (!profile.username.trim()) {
        throw new Error("Username is required")
      }
      if (!profile.name.trim()) {
        throw new Error("Name is required")
      }

      // Filter out empty fields
      const filteredLinks = profile.links.filter((link) => link.label && link.url)
      const filteredEducation = profile.education.filter((edu) => edu.institution && edu.degree)
      const filteredExperience = profile.experience.filter((exp) => exp.company && exp.position)
      const filteredSkills = profile.skills.filter((skill) => skill.name)
      const filteredProjects = profile.projects.filter((project) => project.title)

      // Create a new profile object with the filtered data
      const profileToSave = {
        ...profile,
        links: filteredLinks,
        education: filteredEducation,
        experience: filteredExperience,
        skills: filteredSkills,
        projects: filteredProjects,
        // Only generate ID if it doesn't exist
        id: profile.id || crypto.randomUUID(),
        user_id: userId, // Ensure user ID is included
      }

      console.log("Saving profile:", profileToSave)

      const savedProfile = await updateProfile(profileToSave)
      console.log("Profile saved successfully:", savedProfile)

      setSuccess("Profile saved successfully!")

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push(`/dashboard`)
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error saving profile:", error)

      // Check for username already taken error
      if (error.message && error.message.includes("already taken")) {
        setError(`Username '${initialData.username}' is already taken. Please choose another username.`)
      } else {
        setError(error.message || "An unknown error occurred")
      }

      setIsLoading(false)
    }
  }

  // Ensure we have default values for all fields
  const defaultProfile: Profile = {
    id: initialData?.id,
    user_id: userId,
    username: initialData?.username || "",
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    links: initialData?.links || [{ label: "", url: "", icon: "" }],
    template_id: initialData?.template_id || "template1",
    profile_image: initialData?.profile_image || "",
    banner_image: initialData?.banner_image || "",
    education: initialData?.education?.length
      ? initialData.education
      : [
          {
            institution: "Universitas Indonesia",
            degree: "Bachelor",
            field: "Computer Science",
            startDate: "2018",
            endDate: "2022",
            description: "Studied computer science with focus on web development and artificial intelligence.",
          },
        ],
    experience: initialData?.experience?.length
      ? initialData.experience
      : [
          {
            company: "Tech Solutions",
            position: "Frontend Developer",
            startDate: "2022",
            endDate: "Present",
            description: "Developing responsive web applications using React and Next.js.",
            location: "Jakarta, Indonesia",
          },
        ],
    skills: initialData?.skills?.length
      ? initialData.skills
      : [
          { name: "JavaScript", level: 4, category: "Technical" },
          { name: "React", level: 4, category: "Technical" },
          { name: "Next.js", level: 3, category: "Technical" },
          { name: "UI/UX Design", level: 3, category: "Design" },
        ],
    projects: initialData?.projects?.length
      ? initialData.projects
      : [
          {
            title: "E-commerce Website",
            description: "A full-stack e-commerce platform with payment integration.",
            technologies: ["React", "Node.js", "MongoDB"],
            url: "https://example.com",
            image: "",
          },
        ],
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div id="profile-wizard">
        <WizardProvider initialData={defaultProfile} totalSteps={6}>
          <ProfileWizardContent onSave={handleSave} isSaving={isLoading} />
        </WizardProvider>
      </div>
    </div>
  )
}
