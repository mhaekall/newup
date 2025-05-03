"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import type { Profile } from "@/types"

interface ProfileWizardContentProps {
  profile: Profile
  updateWizardProfile: (data: Partial<Profile>) => void
  onSave: () => void
  isSaving: boolean
  currentStep: number
}

function ProfileWizardContent({
  profile,
  updateWizardProfile,
  onSave,
  isSaving,
  currentStep,
}: ProfileWizardContentProps) {
  return (
    <div className="space-y-6">
      <WizardProgress currentStep={currentStep} />

      <div className="mt-6">
        {currentStep === 0 && <BasicInfoStep profile={profile} updateProfile={updateWizardProfile} />}
        {currentStep === 1 && <LinksStep profile={profile} updateProfile={updateWizardProfile} />}
        {currentStep === 2 && <EducationStep profile={profile} updateProfile={updateWizardProfile} />}
        {currentStep === 3 && <ExperienceStep profile={profile} updateProfile={updateWizardProfile} />}
        {currentStep === 4 && <SkillsStep profile={profile} updateProfile={updateWizardProfile} />}
        {currentStep === 5 && <ProjectsStep profile={profile} updateProfile={updateWizardProfile} />}
      </div>

      <WizardNavigation
        onSave={onSave}
        isSaving={isSaving}
        currentStep={currentStep}
        totalSteps={6}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === 5}
      />
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
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardProfile, setWizardProfile] = useState<Profile>(getDefaultProfile(initialData, userId))

  const updateWizardProfile = (data: Partial<Profile>) => {
    setWizardProfile((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!wizardProfile.username.trim()) {
        throw new Error("Username is required")
      }
      if (!wizardProfile.name.trim()) {
        throw new Error("Name is required")
      }

      // Filter out empty fields
      const filteredLinks = wizardProfile.links.filter((link) => link.label && link.url)
      const filteredEducation = wizardProfile.education.filter((edu) => edu.institution && edu.degree)
      const filteredExperience = wizardProfile.experience.filter((exp) => exp.company && exp.position)
      const filteredSkills = wizardProfile.skills.filter((skill) => skill.name)
      const filteredProjects = wizardProfile.projects.filter((project) => project.title)

      // Create a new profile object with the filtered data
      const profileToSave = {
        ...wizardProfile,
        links: filteredLinks,
        education: filteredEducation,
        experience: filteredExperience,
        skills: filteredSkills,
        projects: filteredProjects,
        // Only generate ID if it doesn't exist
        id: wizardProfile.id || crypto.randomUUID(),
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
        setError(`Username '${wizardProfile.username}' is already taken. Please choose another username.`)
      } else {
        setError(error.message || "An unknown error occurred")
      }

      setIsLoading(false)
    }
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

      <ProfileWizardContent
        profile={wizardProfile}
        updateWizardProfile={updateWizardProfile}
        onSave={handleSave}
        isSaving={isLoading}
        currentStep={currentStep}
      />
    </div>
  )
}

// Helper function to ensure we have default values for all fields
function getDefaultProfile(initialData: any, userId: string): Profile {
  return {
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
}
