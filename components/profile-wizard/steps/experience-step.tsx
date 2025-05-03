"use client"
import type { Profile, Experience } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExperienceStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function ExperienceStep({ profile, updateProfile }: ExperienceStepProps) {
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...profile.experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    updateProfile({ experience: updatedExperience })
  }

  const addExperience = () => {
    updateProfile({
      experience: [
        ...profile.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "", location: "" },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...profile.experience]
    updatedExperience.splice(index, 1)
    updateProfile({ experience: updatedExperience })
  }

  return (
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
  )
}
