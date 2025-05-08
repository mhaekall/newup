"use client"
import { useState, useEffect } from "react"
import type { Profile, Skill } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Star, ChevronDown, Check } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"
import { toast } from "sonner"

interface SkillsStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
  isMobile?: boolean
}

export function SkillsStep({ profile, updateProfile, isMobile = false }: SkillsStepProps) {
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const [showCategorySelector, setShowCategorySelector] = useState(false)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)
  const haptic = useHaptic()

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.skills.some((skill) => skill.name)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [profile.skills])

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    haptic.light()
    const updatedSkills = [...profile.skills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: field === "level" ? Number.parseInt(value) : value }
    updateProfile({ skills: updatedSkills })
  }

  const addSkill = () => {
    haptic.medium()
    updateProfile({
      skills: [...profile.skills, { name: "", level: 3, category: "Technical" }],
    })
    toast.success("New skill added")
  }

  const removeSkill = (index: number) => {
    haptic.warning()
    const updatedSkills = [...profile.skills]
    updatedSkills.splice(index, 1)
    updateProfile({ skills: updatedSkills })
    toast.info("Skill removed")
  }

  const openLevelSelector = (index: number) => {
    setCurrentSkillIndex(index)
    setShowLevelSelector(true)
    haptic.light()
  }

  const openCategorySelector = (index: number) => {
    setCurrentSkillIndex(index)
    setShowCategorySelector(true)
    haptic.light()
  }

  const skillLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Elementary" },
    { value: 3, label: "Intermediate" },
    { value: 4, label: "Advanced" },
    { value: 5, label: "Expert" },
  ]

  const skillCategories = ["Technical", "Soft", "Language", "Tool", "Design", "Other"]

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
        <CardTitle className="text-xl font-medium text-gray-800">Skills</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Skills & Expertise</Label>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={addSkill}
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              >
                <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                Add Skill
              </Button>
            </motion.div>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {profile.skills.map((skill, index) => (
              <motion.div
                key={index}
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm space-y-3 hover:border-blue-200 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={`skill-name-${index}`} className="text-sm font-normal text-gray-500">
                    Skill Name
                  </Label>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      onClick={() => removeSkill(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <Input
                  id={`skill-name-${index}`}
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                  placeholder="Skill Name (e.g. JavaScript)"
                  className="rounded-xl h-12 mb-3 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`skill-level-${index}`} className="text-sm font-normal text-gray-500 mb-1 block">
                      Level
                    </Label>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors duration-200"
                      onClick={() => openLevelSelector(index)}
                    >
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < skill.level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </div>

                  <div>
                    <Label htmlFor={`skill-category-${index}`} className="text-sm font-normal text-gray-500 mb-1 block">
                      Category
                    </Label>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-12 px-3 rounded-xl border border-gray-300 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors duration-200"
                      onClick={() => openCategorySelector(index)}
                    >
                      <span>{skill.category || "Category"}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {profile.skills.length === 0 && (
            <motion.div
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <Star className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No skills added yet. Click "Add Skill" to get started.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={addSkill}
                    variant="outline"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Skill
                  </Button>
                </motion.div>
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

        {/* Skill Level Selector - Full Screen */}
        <AnimatePresence>
          {showLevelSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 bg-white p-4"
            >
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <h3 className="text-xl font-medium">Select Skill Level</h3>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLevelSelector(false)}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  {skillLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      type="button"
                      className={`w-full text-left p-4 rounded-xl flex items-center justify-between ${
                        profile.skills[currentSkillIndex]?.level === level.value
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "border border-gray-200"
                      }`}
                      onClick={() => {
                        handleSkillChange(currentSkillIndex, "level", level.value)
                        setShowLevelSelector(false)
                        haptic.medium()
                      }}
                      whileHover={{ backgroundColor: "#F9FAFB", y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < level.value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-base">{level.label}</span>
                      </div>
                      {profile.skills[currentSkillIndex]?.level === level.value && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Category Selector - Full Screen */}
        <AnimatePresence>
          {showCategorySelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 bg-white p-4"
            >
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <h3 className="text-xl font-medium">Select Category</h3>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCategorySelector(false)}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  {skillCategories.map((category) => (
                    <motion.button
                      key={category}
                      type="button"
                      className={`w-full text-left p-4 rounded-xl flex items-center justify-between ${
                        profile.skills[currentSkillIndex]?.category === category
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "border border-gray-200"
                      }`}
                      onClick={() => {
                        handleSkillChange(currentSkillIndex, "category", category)
                        setShowCategorySelector(false)
                        haptic.medium()
                      }}
                      whileHover={{ backgroundColor: "#F9FAFB", y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category}
                      {profile.skills[currentSkillIndex]?.category === category && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
