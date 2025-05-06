"use client"
import { useState, useEffect } from "react"
import type { Profile, Experience } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, Briefcase, Calendar, MapPin } from "lucide-react"

interface ExperienceStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function ExperienceStep({ profile, updateProfile }: ExperienceStepProps) {
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.experience.some((exp) => exp.company)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [profile.experience])

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
          <Briefcase className="h-5 w-5 text-blue-500" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Work Experience</Label>
            <Button
              type="button"
              onClick={addExperience}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Add Experience
            </Button>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {profile.experience.map((exp, index) => (
              <motion.div
                key={index}
                className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:border-blue-200 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Experience #{index + 1}
                  </h4>
                  {profile.experience.length > 0 && (
                    <Button
                      type="button"
                      onClick={() => removeExperience(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`exp-company-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      Company
                    </Label>
                    <Input
                      id={`exp-company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      placeholder="Company Name"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`exp-position-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      Position
                    </Label>
                    <Input
                      id={`exp-position-${index}`}
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      placeholder="Job Title"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`exp-location-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      Location
                    </Label>
                    <Input
                      id={`exp-location-${index}`}
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                      placeholder="City, Country"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`exp-start-${index}`}
                        className="text-sm font-normal text-gray-500 flex items-center gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        Start Date
                      </Label>
                      <Input
                        id={`exp-start-${index}`}
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        placeholder="MM/YYYY"
                        className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`exp-end-${index}`}
                        className="text-sm font-normal text-gray-500 flex items-center gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        End Date
                      </Label>
                      <Input
                        id={`exp-end-${index}`}
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        placeholder="MM/YYYY or Present"
                        className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`exp-description-${index}`} className="text-sm font-normal text-gray-500">
                    Description
                  </Label>
                  <Textarea
                    id={`exp-description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                    className="rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {profile.experience.length === 0 && (
            <motion.div
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <Briefcase className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No experience entries yet. Click "Add Experience" to get started.</p>
                <Button
                  onClick={addExperience}
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Experience
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
