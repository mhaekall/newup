"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Profile, Link, Education, Experience, Project, Skill } from "@/types"
import { updateProfile } from "@/lib/supabase"
import { templates } from "@/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import ImageUpload from "@/components/image-upload"
import TemplatePreview from "@/components/template-preview"
import { ensureBucketsExist } from "@/lib/supabase-storage"

interface ProfileFormProps {
  initialData?: Partial<Profile>
  userId: string
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formChanged, setFormChanged] = useState(false)

  // Ensure buckets exist when component mounts
  useEffect(() => {
    ensureBucketsExist().catch(console.error)
  }, [])

  const [profile, setProfile] = useState<Profile>({
    id: initialData?.id || undefined,
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
        institution: "Universitas Indonesia",
        degree: "Bachelor",
        field: "Computer Science",
        startDate: "2018",
        endDate: "2022",
        description: "Studied computer science with focus on web development and artificial intelligence.",
      },
    ],
    experience: initialData?.experience || [
      {
        company: "Tech Solutions",
        position: "Frontend Developer",
        startDate: "2022",
        endDate: "Present",
        description: "Developing responsive web applications using React and Next.js.",
        location: "Jakarta, Indonesia",
      },
    ],
    skills: initialData?.skills || [
      { name: "JavaScript", level: 4, category: "Technical" },
      { name: "React", level: 4, category: "Technical" },
      { name: "Next.js", level: 3, category: "Technical" },
      { name: "UI/UX Design", level: 3, category: "Design" },
    ],
    projects: initialData?.projects || [
      {
        title: "E-commerce Website",
        description: "A full-stack e-commerce platform with payment integration.",
        technologies: ["React", "Node.js", "MongoDB"],
        url: "https://example.com",
        image: "",
      },
    ],
  })

  // Mark form as changed when any field is updated
  useEffect(() => {
    setFormChanged(true)
  }, [profile])

  // Basic info handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  // Template selection handler
  const handleTemplateChange = (templateId: string) => {
    setProfile((prev) => ({ ...prev, template_id: templateId }))
  }

  // Image handlers
  const handleImageChange = (field: "profile_image" | "banner_image", value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  // Project image handler
  const handleProjectImageChange = (index: number, value: string) => {
    const updatedProjects = [...profile.projects]
    updatedProjects[index] = { ...updatedProjects[index], image: value }
    setProfile((prev) => ({ ...prev, projects: updatedProjects }))
  }

  // Links handlers
  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const updatedLinks = [...profile.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    setProfile((prev) => ({ ...prev, links: updatedLinks }))
  }

  const addLink = () => {
    setProfile((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "", icon: "" }],
    }))
  }

  const removeLink = (index: number) => {
    const updatedLinks = [...profile.links]
    updatedLinks.splice(index, 1)
    setProfile((prev) => ({ ...prev, links: updatedLinks }))
  }

  // Education handlers
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...profile.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setProfile((prev) => ({ ...prev, education: updatedEducation }))
  }

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...profile.education]
    updatedEducation.splice(index, 1)
    setProfile((prev) => ({ ...prev, education: updatedEducation }))
  }

  // Experience handlers
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...profile.experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    setProfile((prev) => ({ ...prev, experience: updatedExperience }))
  }

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "", location: "" },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...profile.experience]
    updatedExperience.splice(index, 1)
    setProfile((prev) => ({ ...prev, experience: updatedExperience }))
  }

  // Skills handlers
  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...profile.skills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: field === "level" ? Number.parseInt(value) : value }
    setProfile((prev) => ({ ...prev, skills: updatedSkills }))
  }

  const addSkill = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: 3, category: "Technical" }],
    }))
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...profile.skills]
    updatedSkills.splice(index, 1)
    setProfile((prev) => ({ ...prev, skills: updatedSkills }))
  }

  // Projects handlers
  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...profile.projects]
    if (field === "technologies") {
      // Handle technologies as an array
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value.split(",").map((tech: string) => tech.trim()),
      }
    } else {
      updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    }
    setProfile((prev) => ({ ...prev, projects: updatedProjects }))
  }

  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: [], url: "", image: "" }],
    }))
  }

  const removeProject = (index: number) => {
    const updatedProjects = [...profile.projects]
    updatedProjects.splice(index, 1)
    setProfile((prev) => ({ ...prev, projects: updatedProjects }))
  }

  // Handle tab change without saving
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
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
      setFormChanged(false)

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push(`/dashboard`)
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error saving profile:", error)

      // Check for username already taken error
      if (error.message && error.message.includes("already taken")) {
        setError(`Username '${profile.username}' is already taken. Please choose another username.`)
      } else {
        setError(error.message || "An unknown error occurred")
      }

      setIsLoading(false)
    }
  }

  // Social media icon mapping
  const getSocialIcon = (url: string): string => {
    const domain = url.toLowerCase()
    if (domain.includes("github")) return "github"
    if (domain.includes("linkedin")) return "linkedin"
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter"
    if (domain.includes("instagram")) return "instagram"
    if (domain.includes("facebook")) return "facebook"
    if (domain.includes("youtube")) return "youtube"
    if (domain.includes("medium")) return "medium"
    if (domain.includes("dribbble")) return "dribbble"
    if (domain.includes("behance")) return "behance"
    return "link"
  }

  // Auto-detect social media icon when URL changes
  const handleUrlChange = (index: number, value: string) => {
    handleLinkChange(index, "url", value)
    if (value) {
      const icon = getSocialIcon(value)
      handleLinkChange(index, "icon", icon)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Tabs className="w-full">
        <TabsList className="w-full flex justify-between mb-6 overflow-x-auto">
          <TabsTrigger active={activeTab === "basic"} onClick={() => handleTabChange("basic")}>
            Basic Info
          </TabsTrigger>
          <TabsTrigger active={activeTab === "links"} onClick={() => handleTabChange("links")}>
            Links
          </TabsTrigger>
          <TabsTrigger active={activeTab === "education"} onClick={() => handleTabChange("education")}>
            Education
          </TabsTrigger>
          <TabsTrigger active={activeTab === "experience"} onClick={() => handleTabChange("experience")}>
            Experience
          </TabsTrigger>
          <TabsTrigger active={activeTab === "skills"} onClick={() => handleTabChange("skills")}>
            Skills
          </TabsTrigger>
          <TabsTrigger active={activeTab === "projects"} onClick={() => handleTabChange("projects")}>
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent className={activeTab === "basic" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your profile URL: https://v0-next-js-full-stack-seven.vercel.app/
                  {profile.username || "username"}
                </p>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <div>
                <Label>Profile Image</Label>
                <ImageUpload
                  initialImage={profile.profile_image}
                  onImageUploaded={(url) => handleImageChange("profile_image", url)}
                  type="profile"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Banner Image</Label>
                <ImageUpload
                  initialImage={profile.banner_image}
                  onImageUploaded={(url) => handleImageChange("banner_image", url)}
                  type="banner"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="template_id">Template</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Select id="template_id" name="template_id" value={profile.template_id} onChange={handleChange}>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </Select>

                  <TemplatePreview
                    profile={profile}
                    onSelect={handleTemplateChange}
                    currentTemplateId={profile.template_id}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent className={activeTab === "links" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Links</Label>
                  <Button type="button" onClick={addLink} variant="outline" size="sm">
                    Add Link
                  </Button>
                </div>

                {profile.links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Label htmlFor={`link-label-${index}`} className="sr-only">
                        Link Label
                      </Label>
                      <Input
                        id={`link-label-${index}`}
                        value={link.label}
                        onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                        placeholder="Label (e.g. GitHub)"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`link-url-${index}`} className="sr-only">
                        Link URL
                      </Label>
                      <Input
                        id={`link-url-${index}`}
                        value={link.url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="URL (e.g. https://github.com)"
                      />
                    </div>
                    <div className="w-24">
                      <Label htmlFor={`link-icon-${index}`} className="sr-only">
                        Icon
                      </Label>
                      <Select
                        id={`link-icon-${index}`}
                        value={link.icon || ""}
                        onChange={(e) => handleLinkChange(index, "icon", e.target.value)}
                      >
                        <option value="">Icon</option>
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="medium">Medium</option>
                        <option value="dribbble">Dribbble</option>
                        <option value="behance">Behance</option>
                        <option value="link">Website</option>
                      </Select>
                    </div>
                    {profile.links.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeLink(index)}
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent className={activeTab === "education" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Education History</Label>
                  <Button type="button" onClick={addEducation} variant="outline" size="sm">
                    Add Education
                  </Button>
                </div>

                {profile.education.map((edu, index) => (
                  <div key={index} className="space-y-4 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Education #{index + 1}</h4>
                      {profile.education.length > 0 && (
                        <Button type="button" onClick={() => removeEducation(index)} variant="outline" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                        <Input
                          id={`edu-institution-${index}`}
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                          placeholder="University/School Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                        <Input
                          id={`edu-degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                        <Input
                          id={`edu-field-${index}`}
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                          placeholder="Computer Science, Design, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                          <Input
                            id={`edu-start-${index}`}
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                          <Input
                            id={`edu-end-${index}`}
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                            placeholder="MM/YYYY or Present"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edu-description-${index}`}>Description</Label>
                      <Textarea
                        id={`edu-description-${index}`}
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        placeholder="Describe your studies, achievements, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                {profile.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No education entries yet. Click "Add Education" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent className={activeTab === "experience" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Work Experience</Label>
                  <Button type="button" onClick={addExperience} variant="outline" size="sm">
                    Add Experience
                  </Button>
                </div>

                {profile.experience.map((exp, index) => (
                  <div key={index} className="space-y-4 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Experience #{index + 1}</h4>
                      {profile.experience.length > 0 && (
                        <Button type="button" onClick={() => removeExperience(index)} variant="outline" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`exp-company-${index}`}>Company</Label>
                        <Input
                          id={`exp-company-${index}`}
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exp-position-${index}`}>Position</Label>
                        <Input
                          id={`exp-position-${index}`}
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exp-location-${index}`}>Location</Label>
                        <Input
                          id={`exp-location-${index}`}
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                          <Input
                            id={`exp-start-${index}`}
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                          <Input
                            id={`exp-end-${index}`}
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                            placeholder="MM/YYYY or Present"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`exp-description-${index}`}>Description</Label>
                      <Textarea
                        id={`exp-description-${index}`}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                {profile.experience.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No experience entries yet. Click "Add Experience" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent className={activeTab === "skills" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Skills & Expertise</Label>
                  <Button type="button" onClick={addSkill} variant="outline" size="sm">
                    Add Skill
                  </Button>
                </div>

                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Label htmlFor={`skill-name-${index}`} className="sr-only">
                        Skill Name
                      </Label>
                      <Input
                        id={`skill-name-${index}`}
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                        placeholder="Skill Name (e.g. JavaScript)"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`skill-level-${index}`} className="sr-only">
                        Skill Level
                      </Label>
                      <Select
                        id={`skill-level-${index}`}
                        value={skill.level.toString()}
                        onChange={(e) => handleSkillChange(index, "level", e.target.value)}
                      >
                        <option value="1">Beginner</option>
                        <option value="2">Elementary</option>
                        <option value="3">Intermediate</option>
                        <option value="4">Advanced</option>
                        <option value="5">Expert</option>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`skill-category-${index}`} className="sr-only">
                        Category
                      </Label>
                      <Select
                        id={`skill-category-${index}`}
                        value={skill.category}
                        onChange={(e) => handleSkillChange(index, "category", e.target.value)}
                      >
                        <option value="Technical">Technical</option>
                        <option value="Soft">Soft</option>
                        <option value="Language">Language</option>
                        <option value="Tool">Tool</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeSkill(index)}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                {profile.skills.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No skills added yet. Click "Add Skill" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent className={activeTab === "projects" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Portfolio Projects</Label>
                  <Button type="button" onClick={addProject} variant="outline" size="sm">
                    Add Project
                  </Button>
                </div>

                {profile.projects.map((project, index) => (
                  <div key={index} className="space-y-4 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Project #{index + 1}</h4>
                      <Button type="button" onClick={() => removeProject(index)} variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                        <Input
                          id={`project-title-${index}`}
                          value={project.title}
                          onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                        <Input
                          id={`project-url-${index}`}
                          value={project.url}
                          onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                          placeholder="Project URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`project-technologies-${index}`}>Technologies Used</Label>
                        <Input
                          id={`project-technologies-${index}`}
                          value={project.technologies ? project.technologies.join(", ") : ""}
                          onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                          placeholder="e.g., React, Node.js, PostgreSQL"
                        />
                      </div>
                      <div>
                        <Label>Project Image</Label>
                        <ImageUpload
                          initialImage={project.image}
                          onImageUploaded={(url) => handleProjectImageChange(index, url)}
                          type="project"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`project-description-${index}`}>Project Description</Label>
                      <Textarea
                        id={`project-description-${index}`}
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                        placeholder="Describe the project, your role, and the outcome"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                {profile.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No projects added yet. Click "Add Project" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  )
}
