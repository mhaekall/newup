"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Profile } from "@/types"

interface TemplateProps {
  profile: Profile
}

export default function Template2({ profile }: TemplateProps) {
  // Format links to ensure they have proper protocols
  const formatUrl = (url: string) => {
    if (!url) return ""
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // Render stars for skill level
  const renderStars = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Banner */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <motion.div
              variants={itemVariants}
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md"
            >
              {profile.profile_image ? (
                <Image
                  src={profile.profile_image || "/placeholder.svg"}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name?.charAt(0) || "?"}
                </div>
              )}
            </motion.div>

            <div className="text-center sm:text-left">
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900">
                {profile.name}
              </motion.h1>
              <motion.div variants={itemVariants} className="text-blue-500 text-lg mt-1">
                @{profile.username}
              </motion.div>
              <motion.p variants={itemVariants} className="mt-3 text-gray-600 max-w-2xl">
                {profile.bio}
              </motion.p>

              {/* Social Links */}
              {profile.links && profile.links.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start"
                >
                  {profile.links.map((link, index) => (
                    <Link
                      key={index}
                      href={formatUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {link.platform}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <motion.div variants={itemVariants} className="px-6 sm:px-10 py-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profile.skills.map((skill, index) => (
                  <motion.div key={index} variants={itemVariants} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-900">{skill.name}</div>
                    <div className="mt-2 flex">{renderStars(skill.level)}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <motion.div variants={itemVariants} className="px-6 sm:px-10 py-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-gray-200"
                  >
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500 -translate-x-1/2"></div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {exp.start_date} - {exp.end_date || "Present"}
                    </p>
                    <p className="mt-2 text-gray-600">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <motion.div variants={itemVariants} className="px-6 sm:px-10 py-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {edu.start_date} - {edu.end_date || "Present"}
                    </p>
                    <p className="mt-2 text-gray-600">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <motion.div variants={itemVariants} className="px-6 sm:px-10 py-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <p className="mt-2 text-gray-600">{project.description}</p>
                    {project.url && (
                      <a
                        href={formatUrl(project.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-500 hover:text-blue-700"
                      >
                        View Project →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="px-6 sm:px-10 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500"
          >
            <div className="flex items-center justify-center gap-1">
              Built with
              <span className="text-blue-500 font-pacifico mx-1">looqmy</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#ef4444"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
