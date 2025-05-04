"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { BasicInfoStep } from "@/components/profile-wizard/steps/basic-info-step"
import { LinksStepWithReactHookForm } from "@/components/profile-wizard/steps/links-step-with-react-hook-form"
import { ContactStep } from "@/components/profile-wizard/steps/contact-step"
import { EducationStep } from "@/components/profile-wizard/steps/education-step"
import { ExperienceStep } from "@/components/profile-wizard/steps/experience-step"
import { SkillsStep } from "@/components/profile-wizard/steps/skills-step"
import { ProjectsStep } from "@/components/profile-wizard/steps/projects-step"
import { updateProfile } from "@/lib/supabase"
import { ProfileSchema } from "@/lib/schemas"
import type { Profile } from "@/types"

interface ProfileFormProps {
  initialData?: Partial<Profile>
  userId: string
}

export default function ProfileFormWithReactHookForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Inisialisasi form dengan React Hook Form
  const methods = useForm<Profile>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      id: initialData?.id,
      user_id: userId,
      username: initialData?.username || "",
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      links: initialData?.links || [{ label: "", url: "", icon: "" }],
      template_id: initialData?.template_id || "template1",
      profile_image: initialData?.profile_image || "",
      banner_image: initialData?.banner_image || "",
      education: initialData?.education || [
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      experience: initialData?.experience || [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          location: "",
        },
      ],
      skills: initialData?.skills || [{ name: "", level: 3, category: "Technical" }],
      projects: initialData?.projects || [
        {
          title: "",
          description: "",
          technologies: [],
          url: "",
          image: "",
        },
      ],
      contactInfo: initialData?.contactInfo || {
        email: "",
        phone: "",
        whatsapp: "",
        telegram: "",
        website: "",
      },
    },
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const onSubmit = async (data: Profile) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Filter out empty fields
      const filteredLinks = data.links.filter((link) => link.label && link.url)
      const filteredEducation = data.education.filter((edu) => edu.institution && edu.degree)
      const filteredExperience = data.experience.filter((exp) => exp.company && exp.position)
      const filteredSkills = data.skills.filter((skill) => skill.name)
      const filteredProjects = data.projects.filter((project) => project.title)

      // Create a new profile object with the filtered data
      const profileToSave = {
        ...data,
        links: filteredLinks,
        education: filteredEducation,
        experience: filteredExperience,
        skills: filteredSkills,
        projects: filteredProjects,
        // Only generate ID if it doesn't exist
        id: data.id || crypto.randomUUID(),
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
        setError(`Username '${data.username}' is already taken. Please choose another username.`)
      } else {
        setError(error.message || "An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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

        <Tabs className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full flex justify-between mb-6 overflow-x-auto">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoStep />
          </TabsContent>

          <TabsContent value="contact">
            <ContactStep />
          </TabsContent>

          <TabsContent value="links">
            <LinksStepWithReactHookForm />
          </TabsContent>

          <TabsContent value="education">
            <EducationStep />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceStep />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsStep />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsStep />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
