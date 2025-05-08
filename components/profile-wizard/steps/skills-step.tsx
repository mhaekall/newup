"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Skill } from "@/types"
import type { Profile } from "@/types"

interface SkillsStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
  isMobile?: boolean
}

export function SkillsStep({ profile, updateProfile, isMobile = false }: SkillsStepProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: "", level: 3, category: "Technical" })
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const skills = profile.skills || []

  const handleAddSkill = () => {
    if (!currentSkill.name.trim()) return

    if (editIndex !== null) {
      // Update existing skill
      const updatedSkills = [...skills]
      updatedSkills[editIndex] = currentSkill
      updateProfile({ skills: updatedSkills })
    } else {
      // Add new skill
      const updatedSkills = [...skills, currentSkill]
      updateProfile({ skills: updatedSkills })
    }

    // Reset form
    setCurrentSkill({ name: "", level: 3, category: "Technical" })
    setEditIndex(null)
    setShowModal(false)
  }

  const handleEditSkill = (index: number) => {
    setCurrentSkill(skills[index])
    setEditIndex(index)
    setShowModal(true)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    updateProfile({ skills: updatedSkills })
  }

  const handleCancel = () => {
    setCurrentSkill({ name: "", level: 3, category: "Technical" })
    setEditIndex(null)
    setShowModal(false)
  }

  // Function to render stars for skill level
  const renderStars = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  // Map skill level to text
  const getSkillLevelText = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Elementary"
      case 3:
        return "Intermediate"
      case 4:
        return "Advanced"
      case 5:
        return "Expert"
      default:
        return "Intermediate"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Skills</h2>
      <p className="text-gray-600">Add your skills and rate your proficiency level for each one.</p>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No skills added yet. Click the button below to add your first skill.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-500">{skill.category}</div>
                  <div className="mt-1 flex">{renderStars(skill.level)}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSkill(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Button */}
      <Button
        type="button"
        onClick={() => {
          setCurrentSkill({ name: "", level: 3, category: "Technical" })
          setEditIndex(null)
          setShowModal(true)
        }}
        className="w-full"
      >
        Add Skill
      </Button>

      {/* Skill Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">{editIndex !== null ? "Edit Skill" : "Add Skill"}</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    value={currentSkill.name}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                    placeholder="e.g., JavaScript, Project Management"
                  />
                </div>

                <div>
                  <Label>Level</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <Star
                            key={level}
                            className={`h-6 w-6 cursor-pointer ${
                              level <= currentSkill.level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => setCurrentSkill({ ...currentSkill, level })}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{getSkillLevelText(currentSkill.level)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="skill-category">Category</Label>
                  <Select
                    value={currentSkill.category}
                    onValueChange={(value) => setCurrentSkill({ ...currentSkill, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      <SelectItem value="Languages">Languages</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSkill}>{editIndex !== null ? "Update" : "Add"}</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
