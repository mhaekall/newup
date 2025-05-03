"use client"
import { useWizard } from "../wizard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import type { Project } from "@/types"

export function ProjectsStep() {
  const { profile, updateProfile } = useWizard()

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

  return (
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
  )
}
