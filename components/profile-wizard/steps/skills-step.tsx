"use client"

import { useState } from "react"
import { useWizard } from "../wizard-context"
import { Button } from "@/components/ui/button"
import { Star, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Skill {
  name: string
  level: number
  category?: string
}

const skillLevels = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Elementary" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
]

const skillCategories = ["Technical", "Soft Skills", "Languages", "Tools", "Other"]

export function SkillsStep() {
  const { profile, updateProfile } = useWizard()
  const [showModal, setShowModal] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: "", level: 3, category: "Technical" })
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleAddSkill = () => {
    setCurrentSkill({ name: "", level: 3, category: "Technical" })
    setEditIndex(null)
    setShowModal(true)
  }

  const handleEditSkill = (index: number) => {
    setCurrentSkill(profile.skills[index])
    setEditIndex(index)
    setShowModal(true)
  }

  const handleSaveSkill = () => {
    if (!currentSkill.name.trim()) return

    const updatedSkills = [...(profile.skills || [])]

    if (editIndex !== null) {
      updatedSkills[editIndex] = currentSkill
    } else {
      updatedSkills.push(currentSkill)
    }

    updateProfile({ skills: updatedSkills })
    setShowModal(false)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...(profile.skills || [])]
    updatedSkills.splice(index, 1)
    updateProfile({ skills: updatedSkills })
  }

  // Function to render skill level as stars
  const renderSkillLevel = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-gray-500">Add your skills and expertise levels</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {profile.skills && profile.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{skill.name}</h3>
                      <div className="flex mt-1">{renderSkillLevel(skill.level)}</div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditSkill(index)} className="text-blue-500 hover:text-blue-700">
                        Edit
                      </button>
                      <button onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No skills added yet</p>
            </div>
          )}
        </AnimatePresence>

        <Button onClick={handleAddSkill} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">{editIndex !== null ? "Edit Skill" : "Add Skill"}</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="skillName"
                  value={currentSkill.name}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {skillLevels.map((level) => (
                        <Star
                          key={level.value}
                          className={`h-6 w-6 cursor-pointer ${
                            level.value <= currentSkill.level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setCurrentSkill({ ...currentSkill, level: level.value })}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {skillLevels.find((l) => l.value === currentSkill.level)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={currentSkill.category}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {skillCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSkill}>Save</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
