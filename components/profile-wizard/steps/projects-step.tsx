"use client"
import { useState, useEffect } from "react"
import type { Profile, Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, Code, Link, ImageIcon, Tag } from "lucide-react"

interface ProjectsStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function ProjectsStep({ profile, updateProfile }: ProjectsStepProps) {
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.projects.some((project) => project.title)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [profile.projects])

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
    updateProfile({ projects: updatedProjects })
  }

  const handleProjectImageChange = (index: number, value: string) => {
    const updatedProjects = [...profile.projects]
    updatedProjects[index] = { ...updatedProjects[index], image: value }
    updateProfile({ projects: updatedProjects })
  }

  const addProject = () => {
    updateProfile({
      projects: [...profile.projects, { title: "", description: "", technologies: [], url: "", image: "" }],
    })
  }

  const removeProject = (index: number) => {
    const updatedProjects = [...profile.projects]
    updatedProjects.splice(index, 1)
    updateProfile({ projects: updatedProjects })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Portfolio Projects</Label>
            <Button
              type="button"
              onClick={addProject}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Add Project
            </Button>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {profile.projects.map((project, index) => (
              <motion.div
                key={index}
                className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:border-blue-200 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-500" />
                    Project #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => removeProject(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`project-title-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <Code className="h-3.5 w-3.5 text-gray-400" />
                      Project Title
                    </Label>
                    <Input
                      id={`project-title-${index}`}
                      value={project.title}
                      onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                      placeholder="Project Name"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`project-url-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <Link className="h-3.5 w-3.5 text-gray-400" />
                      Project URL
                    </Label>
                    <Input
                      id={`project-url-${index}`}
                      value={project.url}
                      onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                      placeholder="Project URL"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`project-technologies-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                      Technologies Used
                    </Label>
                    <Input
                      id={`project-technologies-${index}`}
                      value={project.technologies ? project.technologies.join(", ") : ""}
                      onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                      placeholder="e.g., React, Node.js, PostgreSQL"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-500 flex items-center gap-1">
                      <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                      Project Image
                    </Label>
                    <div className="mt-1">
                      <ImageUpload
                        initialImage={project.image}
                        onImageUploaded={(url) => handleProjectImageChange(index, url)}
                        type="project"
                        className="rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-description-${index}`} className="text-sm font-normal text-gray-500">
                    Project Description
                  </Label>
                  <Textarea
                    id={`project-description-${index}`}
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                    placeholder="Describe the project, your role, and the outcome"
                    rows={3}
                    className="rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {profile.projects.length === 0 && (
            <motion.div
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <Code className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No projects added yet. Click "Add Project" to get started.</p>
                <Button
                  onClick={addProject}
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Project
                </Button>
              </div>
            </motion.div>
          )}

          {/* Auto-save indicator */}
          <AnimatePresence>
            {autoSaveIndicator && (
              <motion.div
                className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-full shadow-md flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Check className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Changes saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  )
}
