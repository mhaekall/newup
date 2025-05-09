"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, ExternalLink, Calendar } from "lucide-react"
import type { Profile } from "@/types"

interface TemplateProps {
  profile: Profile
}

export default function Template2({ profile }: TemplateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div className="min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Banner */}
      <motion.div
        className="w-full h-48 md:h-64 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated overlay pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 2h2v2H2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm8 0h2v2h-2V2zm-48 8h2v2H2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm-48 8h2v2H2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm-48 8h2v2H2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm-48 8h2v2H2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm-48 8h2v2H2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2zm8 0h2v2h-2v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          animate={{
            x: [0, 10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Card */}
        <motion.div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8" variants={fadeInVariants}>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image */}
              <motion.div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold rounded-full">
                    {profile.name?.charAt(0) || "U"}
                  </div>
                )}
              </motion.div>

              {/* Profile Info */}
              <motion.div className="text-center md:text-left flex-1" variants={containerVariants}>
                <motion.h1 className="text-3xl sm:text-4xl font-bold text-gray-900" variants={itemVariants}>
                  {profile.name || "Your Name"}
                </motion.h1>
                <motion.p className="text-blue-500 font-medium mt-1" variants={itemVariants}>
                  @{profile.username || "username"}
                </motion.p>
                <motion.p className="text-gray-700 mt-3 text-base sm:text-lg leading-relaxed" variants={itemVariants}>
                  {profile.bio || "Your professional bio will appear here."}
                </motion.p>

                {/* Social Links */}
                {profile.links && profile.links.length > 0 && (
                  <motion.div
                    className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start"
                    variants={containerVariants}
                  >
                    {profile.links.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
                        variants={itemVariants}
                        whileHover={{ y: -2, backgroundColor: "#E5E7EB" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="mr-1 text-blue-500">
                          <ExternalLink size={14} />
                        </span>
                        <span>{link.label || link.platform || "Link"}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Left Column */}
          <motion.div className="md:col-span-4 space-y-6" variants={fadeInVariants}>
            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
                  Skills
                </motion.h2>

                {/* Group skills by category */}
                {Array.from(new Set(profile.skills.map((skill) => skill.category))).map((category) => (
                  <motion.div key={category} className="mb-6 last:mb-0" variants={itemVariants}>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">{category}</h3>
                    <div className="space-y-3">
                      {profile.skills
                        .filter((skill) => skill.category === category)
                        .map((skill, index) => (
                          <motion.div key={index} className="flex flex-col" variants={itemVariants}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < skill.level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
                  Education
                </motion.h2>
                <motion.div className="space-y-4" variants={containerVariants}>
                  {profile.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      className="relative pl-5 pb-4 last:pb-0"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="absolute left-0.5 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                      <h3 className="text-base font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-gray-600 text-sm">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                      {edu.description && <p className="text-gray-600 text-sm mt-2">{edu.description}</p>}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div className="md:col-span-8 space-y-6" variants={fadeInVariants}>
            {/* Experience Section */}
            {profile.experience && profile.experience.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
                  Experience
                </motion.h2>
                <motion.div className="space-y-6" variants={containerVariants}>
                  {profile.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      className="relative pl-5 pb-6 last:pb-0"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="absolute left-0.5 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <div className="mt-1 sm:mt-0 text-right">
                          <p className="text-xs text-gray-500 flex items-center sm:justify-end">
                            <Calendar size={12} className="mr-1" />
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </p>
                          {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && <p className="text-gray-600 text-sm mt-2">{exp.description}</p>}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Projects Section */}
            {profile.projects && profile.projects.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
                  Projects
                </motion.h2>
                <motion.div className="grid grid-cols-1 gap-6" variants={containerVariants}>
                  {profile.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                      variants={itemVariants}
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                    >
                      {project.image && (
                        <div className="w-full h-40 overflow-hidden">
                          <motion.img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.03 }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-semibold text-gray-800">{project.title}</h3>
                          {project.url && (
                            <motion.a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink size={16} />
                            </motion.a>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <motion.div className="mt-3 flex flex-wrap gap-1" variants={containerVariants}>
                            {project.technologies.map((tech, techIndex) => (
                              <motion.span
                                key={techIndex}
                                className="inline-block bg-blue-50 rounded-full px-2 py-0.5 text-xs font-medium text-blue-600"
                                variants={itemVariants}
                                whileHover={{ y: -1, backgroundColor: "#DBEAFE" }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="text-xl font-pacifico text-blue-500">looqmy</span>
            </motion.div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {profile.name || "Portfolio"} • Built with looqmy
            </p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}
