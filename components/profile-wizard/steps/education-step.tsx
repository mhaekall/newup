"use client"
import type { Profile, Education } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EducationStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function EducationStep({ profile, updateProfile }: EducationStepProps) {
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...profile.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    updateProfile({ education: updatedEducation })
  }

  const addEducation = () => {
    updateProfile({
      education: [
        ...profile.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" },
      ],
    })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...profile.education]
    updatedEducation.splice(index, 1)
    updateProfile({ education: updatedEducation })
  }

  return (
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
  )
}
