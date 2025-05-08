"use client"

import { useState, useEffect, useRef } from "react"
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
import { useHaptic } from "@/hooks/use-haptic"
import { toast } from "sonner"
import { WizardOnboarding } from "./wizard-onboarding"
import { WelcomeModal } from "./welcome-modal"
import { ContextualHelper } from "./contextual-helper"

interface ProfileWizardProps {
  initialData: Profile
  userId: string
  isMobile?: boolean
}

export function ProfileWizard({ initialData, userId, isMobile = false }: ProfileWizardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardProfile, setWizardProfile] = useState<Profile>(getDefaultProfile(initialData, userId))
  const [showConfetti, setShowConfetti] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false) // Changed to false by default
  const [showWelcomeModal, setShowWelcomeModal] = useState(false) // Changed to false by default
  const haptic = useHaptic()
  const contentRef = useRef<HTMLDivElement>(null)

  // Setup React Hook Form
  const methods = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: wizardProfile,
    mode: "onChange",
  })

  // Scroll to top when changing steps
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    // Also scroll the window to top on mobile
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentStep, isMobile])

  const updateWizardProfile = (data: Partial<Profile>) => {
    haptic.light()
    setWizardProfile((prev) => {
      const updated = { ...prev, ...data }
      return updated
    })
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < 7) {
      haptic.medium()
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    if (currentStep < 6) {
      haptic.medium()
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      haptic.light()
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
  }

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    haptic.medium()

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
        id: wizardProfile.id || undefined, // Let Supabase generate the ID
        user_id: userId, // Ensure user ID is included
      }

      console.log("Saving profile:", JSON.stringify(profileToSave, null, 2))
      const savedProfile = await updateProfile(profileToSave)

      setSuccess("Profile saved successfully!")
      setShowConfetti(true)
      haptic.success()
      toast.success("Your portfolio has been saved! 🎉")

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push(`/dashboard`)
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Error saving profile:", error)
      haptic.error()

      // Check for specific error types
      if (error.code === "CONFLICT") {
        setError(`Username '${wizardProfile.username}' is already taken. Please choose another username.`)
        toast.error(`Username '${wizardProfile.username}' is already taken`)
      } else if (error.code === "NOT_FOUND") {
        setError("Profile not found. Please try again.")
        toast.error("Profile not found")
      } else if (error.code === "VALIDATION_ERROR") {
        setError(error.message || "Validation error. Please check your inputs.")
        toast.error("Validation error")
      } else {
        setError(error.message || "An unknown error occurred")
        toast.error("Failed to save profile")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Improved animation variants - smoother and more responsive
  const pageVariants = {
    initial: {
      opacity: 0,
      x: isMobile ? 20 : 50,
      scale: isMobile ? 0.98 : 1,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: isMobile ? -20 : -50,
      scale: isMobile ? 0.98 : 1,
    },
  }

  const pageTransition = {
    type: "spring",
    stiffness: isMobile ? 250 : 300,
    damping: isMobile ? 25 : 30,
    mass: 0.5,
  }

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
                return (
                  <div data-step="basic-info">
                    <BasicInfoStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 1:
                return (
                  <div data-step="links">
                    <LinksStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 2:
                return (
                  <div data-step="education">
                    <EducationStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 3:
                return (
                  <div data-step="experience">
                    <ExperienceStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 4:
                return (
                  <div data-step="skills">
                    <SkillsStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 5:
                return (
                  <div data-step="projects">
                    <ProjectsStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
              case 6:
                return (
                  <div data-step="template">
                    <TemplatePreviewStep
                      profile={wizardProfile}
                      updateProfile={updateWizardProfile}
                      isMobile={isMobile}
                    />
                  </div>
                )
              default:
                return (
                  <div data-step="basic-info">
                    <BasicInfoStep profile={wizardProfile} updateProfile={updateWizardProfile} isMobile={isMobile} />
                  </div>
                )
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
            <ModernWizardProgress currentStep={currentStep} onStepClick={goToStep} isMobile={isMobile} />

            <div
              ref={contentRef}
              className={`p-4 sm:p-6 ${isMobile ? "pb-32" : "pb-16"} overflow-y-auto`}
              style={{
                maxHeight: isMobile ? "calc(100vh - 120px)" : "auto",
                overflowX: "hidden",
              }}
            >
              {renderStep()}

              <ModernWizardNavigation
                currentStep={currentStep}
                totalSteps={7}
                onNext={currentStep === 6 ? handleSave : nextStep}
                onPrevious={prevStep}
                isLastStep={currentStep === 6}
                isSubmitting={isLoading}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>
      {showOnboarding && <WizardOnboarding currentStep={currentStep} onClose={handleCloseOnboarding} />}
      {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}
      <ContextualHelper step={currentStep} isMobile={isMobile} />
    </FormProvider>
  )
}

// Helper function to ensure we have default values for all fields
function getDefaultProfile(initialData: any, userId: string): Profile {
  return {
    id: initialData?.id || undefined, // Let Supabase generate the ID if it's a new profile
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
