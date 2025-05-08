"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ExternalLink, Calendar, Briefcase, GraduationCap } from "lucide-react"
import Image from "next/image"
import type { Profile } from "@/types"

interface TemplateProps {
  profile: Profile
  isPreview?: boolean
}

export default function Template2({ profile, isPreview = false }: TemplateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const {
    name,
    username,
    bio,
    profile_image,
    links = [],
    skills = [],
    experience = [],
    education = [],
    projects = [],
  } = profile

  // Function to render skill level as stars
  const renderSkillLevel = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  // Function to format links with proper protocol
  const formatLink = (url: string) => {
    if (!url) return "#"
    return url.startsWith("http") ? url : `https://${url}`
  }

  // Function to get social media icon
  const getSocialIcon = (url: string) => {
    const domain = url.toLowerCase()
    if (domain.includes("github")) return "/icons/github.svg"
    if (domain.includes("linkedin")) return "/icons/linkedin.svg"
    if (domain.includes("twitter")) return "/icons/twitter.svg"
    if (domain.includes("instagram")) return "/icons/instagram.svg"
    if (domain.includes("facebook")) return "/icons/facebook.svg"
    return "/icons/link.svg"
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Banner with animated pattern */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={Math.random() * 5 + 1}
                fill="white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.3 }}
                transition={{
                  delay: i * 0.1,
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                {profile_image ? (
                  <Image
                    src={profile_image || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 128px"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl text-blue-500">{name?.charAt(0) || "U"}</span>
                  </div>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {name || "Your Name"}
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-blue-500 text-lg mt-1"
                >
                  @{username || "username"}
                </motion.p>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-3 text-gray-600"
                >
                  {bio || "Your professional bio will appear here."}
                </motion.p>

                {/* Social Links */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3"
                >
                  {links && links.length > 0 ? (
                    links.map((link, index) => (
                      <motion.a
                        key={index}
                        href={formatLink(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                      >
                        <Image
                          src={getSocialIcon(link.url) || "/placeholder.svg"}
                          alt={link.title || "Social link"}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{link.title || "Link"}</span>
                      </motion.a>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No social links added</span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Skills Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Skills</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills && skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800">{skill.name}</h3>
                        <div className="flex">{renderSkillLevel(skill.level || 3)}</div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full">No skills added yet</p>
                )}
              </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Experience</h2>
              <div className="mt-4 space-y-4">
                {experience && experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            <Calendar className="inline-block w-4 h-4 mr-1" />
                            {exp.start_date} - {exp.end_date || "Present"}
                          </p>
                          {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
                        </div>
                        <Briefcase className="w-5 h-5 text-blue-500" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No experience added yet</p>
                )}
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Education</h2>
              <div className="mt-4 space-y-4">
                {education && education.length > 0 ? (
                  education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            <Calendar className="inline-block w-4 h-4 mr-1" />
                            {edu.start_date} - {edu.end_date || "Present"}
                          </p>
                        </div>
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No education added yet</p>
                )}
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Projects</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                      {project.description && <p className="mt-2 text-gray-600 text-sm">{project.description}</p>}
                      {project.url && (
                        <a
                          href={formatLink(project.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <span>View Project</span>
                          <ExternalLink className="ml-1 w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full">No projects added yet</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm">Built with</span>
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-lg font-medium text-blue-500 mx-1"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              looqmy
            </motion.span>
          </div>
          <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  )
}
