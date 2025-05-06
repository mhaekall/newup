"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ModernWizardProgress } from "./modern-wizard-progress"
import { ModernWizardNavigation } from "./modern-wizard-navigation"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LinksStep } from "./steps/links-step"
import { EducationStep } from "./steps/education-step"
import { ExperienceStep } from "./steps/experience-step"
import { SkillsStep } from "./steps/skills-step"
import { ProjectsStep } from "./steps/projects-step"
import { TemplatePreviewStep } from "./steps/template-preview-step"
import { updateProfile } from "@/lib/supabase"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import type { Profile } from "@/types"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema } from "@/lib/schemas"
import { motion, AnimatePresence } from "framer-motion"

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

  // Setup React Hook Form
  const methods = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: wizardProfile,
    mode: "onChange",
  })

  const updateWizardProfile = (data: Partial<Profile>) => {
    setWizardProfile((prev) => {
      const updated = { ...prev, ...data }
      console.log("Updated profile:", updated)
      return updated
    })
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < 7) {
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
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
      const filteredLinks = wizardProfile.links?.filter((link) => link.label && link.url) || []
      const filteredEducation = wizardProfile.education?.filter((edu) => edu.institution && edu.degree) || []
      const filteredExperience = wizardProfile.experience?.filter((exp) => exp.company && exp.position) || []
      const filteredSkills = wizardProfile.skills?.filter((skill) => skill.name) || []
      const filteredProjects = wizardProfile.projects?.filter((project) => project.title) || []

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
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants - faster and more dynamic
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 50,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -50,
    },
  }

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.3,
  }

  // Render the current step
  const renderStep = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-[50vh]"
        >
          {(() => {
            switch (currentStep) {
              case 0:
                return <BasicInfoStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 1:
                return <LinksStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 2:
                return <EducationStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 3:
                return <ExperienceStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 4:
                return <SkillsStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 5:
                return <ProjectsStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              case 6:
                return <TemplatePreviewStep profile={wizardProfile} updateProfile={updateWizardProfile} />
              default:
                return <BasicInfoStep profile={wizardProfile} updateProfile={updateWizardProfile} />
            }
          })()}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full min-h-screen bg-white">
        <div className="w-full">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-3 mb-4"
            >
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-3 mb-4"
            >
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="bg-white">
            <ModernWizardProgress currentStep={currentStep} onStepClick={goToStep} />

            <div className="p-4 sm:p-6">
              {renderStep()}

              <ModernWizardNavigation
                currentStep={currentStep}
                totalSteps={7}
                onNext={currentStep === 6 ? handleSave : nextStep}
                onPrevious={prevStep}
                isLastStep={currentStep === 6}
                isSubmitting={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

// Helper function to ensure we have default values for all fields
function getDefaultProfile(initialData: any, userId: string): Profile {
  return {
    id: initialData?.id || null,
    user_id: userId,
    username: initialData?.username || "",
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    links: initialData?.links || [{ label: "", url: "", icon: "" }],
    template_id: initialData?.template_id || "template1",
    profile_image: initialData?.profile_image || "",
    banner_image: initialData?.banner_image || "",
    education:
      Array.isArray(initialData?.education) && initialData.education.length > 0
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
