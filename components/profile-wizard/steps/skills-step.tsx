"use client"
import { useState } from "react"
import type { Profile, Skill } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SkillsStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function SkillsStep({ profile, updateProfile }: SkillsStepProps) {
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  const openLevelSelector = (index: number) => {
    setCurrentSkillIndex(index)
    setShowLevelModal(true)
  }

  const openCategorySelector = (index: number) => {
    setCurrentSkillIndex(index)
    setShowCategoryModal(true)
  }

  const skillLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Elementary" },
    { value: 3, label: "Intermediate" },
    { value: 4, label: "Advanced" },
    { value: 5, label: "Expert" },
  ]

  const skillCategories = ["Technical", "Soft", "Language", "Tool", "Design", "Other"]

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Skills & Expertise</Label>
            <Button type="button" onClick={addSkill} variant="outline" size="sm" className="rounded-full">
              Add Skill
            </Button>
          </div>

          {profile.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                  placeholder="Skill Name (e.g. JavaScript)"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="w-32">
                <div
                  className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer"
                  onClick={() => openLevelSelector(index)}
                >
                  <span>{skillLevels.find((level) => level.value === skill.level)?.label || "Level"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <div className="w-32">
                <div
                  className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer"
                  onClick={() => openCategorySelector(index)}
                >
                  <span>{skill.category || "Category"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => removeSkill(index)}
                variant="outline"
                size="icon"
                className="flex-shrink-0 rounded-full h-12 w-12"
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

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full h-12 px-6 relative overflow-hidden"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : saveSuccess ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </div>

        {/* Skill Level Modal */}
        {showLevelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Select Level</h3>
                <button
                  type="button"
                  onClick={() => setShowLevelModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                      profile.skills[currentSkillIndex]?.level === level.value ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    onClick={() => {
                      handleSkillChange(currentSkillIndex, "level", level.value)
                      setShowLevelModal(false)
                    }}
                  >
                    {level.label}
                    {profile.skills[currentSkillIndex]?.level === level.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skill Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Select Category</h3>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {skillCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                      profile.skills[currentSkillIndex]?.category === category ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    onClick={() => {
                      handleSkillChange(currentSkillIndex, "category", category)
                      setShowCategoryModal(false)
                    }}
                  >
                    {category}
                    {profile.skills[currentSkillIndex]?.category === category && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
