"use client"

import { useState, useRef, useEffect } from "react"
import { PortfolioProvider } from "@/context/PortfolioContext"
import { ProgressBar } from "@/components/ProgressBar"
import { SectionContainer } from "@/components/SectionContainer"
import { BasicInfoSection } from "@/components/BasicInfoSection"
import { LinksSection } from "@/components/LinksSection"
import { v4 as uuidv4 } from "uuid"

// Mock initial data
const initialData = {
  userId: "user123",
  username: "johndoe",
  name: "John Doe",
  bio: "Full-stack developer passionate about creating beautiful user experiences.",
  profileImage: "",
  bannerImage: "",
  links: [
    {
      id: uuidv4(),
      platform: "GitHub",
      url: "https://github.com/johndoe",
      icon: "github",
      visible: true,
    },
    {
      id: uuidv4(),
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      icon: "linkedin",
      visible: true,
    },
  ],
  education: [],
  experience: [],
  skills: [],
  projects: [],
  templateId: "template1",
}

// Define steps
const steps = [
  { id: "basic-info", label: "Basic Info" },
  { id: "links", label: "Links" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "template", label: "Template" },
]

export default function EditPortfolioPage() {
  const [currentStep, setCurrentStep] = useState("basic-info")
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  // Handle step click
  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId)
    const section = document.getElementById(stepId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Setup intersection observer to update current step based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setCurrentStep(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    // Observe all section elements
    steps.forEach((step) => {
      const element = document.getElementById(step.id)
      if (element) {
        observer.observe(element)
        sectionsRef.current[step.id] = element
      }
    })

    return () => {
      steps.forEach((step) => {
        const element = sectionsRef.current[step.id]
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [])

  return (
    <PortfolioProvider initialData={initialData}>
      <div className="min-h-screen bg-gray-50 font-inter">
        <ProgressBar steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Your Portfolio</h1>
            <p className="text-gray-600 mt-2">Customize your portfolio to showcase your skills and experience.</p>
          </div>

          <div className="space-y-6">
            <SectionContainer id="basic-info" title="Basic Information" isActive={currentStep === "basic-info"}>
              <BasicInfoSection />
            </SectionContainer>

            <SectionContainer id="links" title="Social Links" isActive={currentStep === "links"}>
              <LinksSection />
            </SectionContainer>

            <SectionContainer id="education" title="Education" isActive={currentStep === "education"}>
              <p className="text-gray-500">Education section placeholder</p>
            </SectionContainer>

            <SectionContainer id="experience" title="Experience" isActive={currentStep === "experience"}>
              <p className="text-gray-500">Experience section placeholder</p>
            </SectionContainer>

            <SectionContainer id="skills" title="Skills" isActive={currentStep === "skills"}>
              <p className="text-gray-500">Skills section placeholder</p>
            </SectionContainer>

            <SectionContainer id="projects" title="Projects" isActive={currentStep === "projects"}>
              <p className="text-gray-500">Projects section placeholder</p>
            </SectionContainer>

            <SectionContainer id="template" title="Template & Preview" isActive={currentStep === "template"}>
              <p className="text-gray-500">Template section placeholder</p>
            </SectionContainer>
          </div>
        </main>
      </div>
    </PortfolioProvider>
  )
}
