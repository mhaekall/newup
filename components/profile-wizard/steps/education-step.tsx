"use client"
import { useState, useEffect } from "react"
import type { Profile, Education } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, School, Calendar, BookOpen } from "lucide-react"

interface EducationStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function EducationStep({ profile, updateProfile }: EducationStepProps) {
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false)

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.education.some((edu) => edu.institution)) {
        setAutoSaveIndicator(true)
        setTimeout(() => setAutoSaveIndicator(false), 2000)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [profile.education])

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
          <School className="h-5 w-5 text-blue-500" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between">
            <Label className="text-base font-normal text-gray-700">Education History</Label>
            <Button
              type="button"
              onClick={addEducation}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Add Education
            </Button>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {profile.education.map((edu, index) => (
              <motion.div
                key={index}
                className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:border-blue-200 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <School className="h-4 w-4 text-blue-500" />
                    Education #{index + 1}
                  </h4>
                  {profile.education.length > 0 && (
                    <Button
                      type="button"
                      onClick={() => removeEducation(index)}
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
                      htmlFor={`edu-institution-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <School className="h-3.5 w-3.5 text-gray-400" />
                      Institution
                    </Label>
                    <Input
                      id={`edu-institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      placeholder="University/School Name"
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`edu-degree-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                      Degree
                    </Label>
                    <Input
                      id={`edu-degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`edu-field-${index}`}
                      className="text-sm font-normal text-gray-500 flex items-center gap-1"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                      Field of Study
                    </Label>
                    <Input
                      id={`edu-field-${index}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                      placeholder="Computer Science, Design, etc."
                      className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`edu-start-${index}`}
                        className="text-sm font-normal text-gray-500 flex items-center gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        Start Date
                      </Label>
                      <Input
                        id={`edu-start-${index}`}
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                        placeholder="MM/YYYY"
                        className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`edu-end-${index}`}
                        className="text-sm font-normal text-gray-500 flex items-center gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        End Date
                      </Label>
                      <Input
                        id={`edu-end-${index}`}
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                        placeholder="MM/YYYY or Present"
                        className="rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-description-${index}`} className="text-sm font-normal text-gray-500">
                    Description
                  </Label>
                  <Textarea
                    id={`edu-description-${index}`}
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                    placeholder="Describe your studies, achievements, etc."
                    rows={3}
                    className="rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {profile.education.length === 0 && (
            <motion.div
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <School className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No education entries yet. Click "Add Education" to get started.</p>
                <Button
                  onClick={addEducation}
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Education
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
