"use client"
import { useWizard } from "../wizard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Skill } from "@/types"

export function SkillsStep() {
  const { profile, updateProfile } = useWizard()

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...profile.skills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: field === "level" ? Number.parseInt(value) : value }
    updateProfile({ skills: updatedSkills })
  }

  const addSkill = () => {
    updateProfile({
      skills: [...profile.skills, { name: "", level: 3, category: "Technical" }],
    })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...profile.skills]
    updatedSkills.splice(index, 1)
    updateProfile({ skills: updatedSkills })
  }

  return (
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
  )
}
