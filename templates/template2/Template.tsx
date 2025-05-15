"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, ExternalLink, Calendar, Mail, Phone, MapPin } from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"

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

  // Helper function to extract platform name from URL
  const getPlatformName = (url: string): string => {
    try {
      if (!url) return "Link"

      if (url.includes("mailto:")) return "Email"
      if (url.includes("tel:")) return "Phone"
      if (url.includes("wa.me") || url.includes("whatsapp")) return "WhatsApp"

      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace("www.", "")

      if (domain.includes("instagram")) return "Instagram"
      if (domain.includes("twitter") || domain.includes("x.com")) return "Twitter"
      if (domain.includes("facebook")) return "Facebook"
      if (domain.includes("linkedin")) return "LinkedIn"
      if (domain.includes("github")) return "GitHub"
      if (domain.includes("telegram")) return "Telegram"
      if (domain.includes("youtube")) return "YouTube"
      if (domain.includes("twitch")) return "Twitch"
      if (domain.includes("dribbble")) return "Dribbble"
      if (domain.includes("figma")) return "Figma"
      if (domain.includes("codepen")) return "CodePen"
      if (domain.includes("slack")) return "Slack"
      if (domain.includes("discord")) return "Discord"

      // If it's the user's own portfolio site
      if (domain.includes(profile.username?.toLowerCase() || "")) return "Portfolio"

      return "Website"
    } catch (error) {
      // If URL parsing fails, try to identify common patterns
      if (url.includes("instagram")) return "Instagram"
      if (url.includes("twitter") || url.includes("x.com")) return "Twitter"
      if (url.includes("facebook")) return "Facebook"
      if (url.includes("linkedin")) return "LinkedIn"
      if (url.includes("github")) return "GitHub"
      if (url.includes("whatsapp")) return "WhatsApp"
      if (url.includes("telegram")) return "Telegram"
      if (url.includes("mailto:")) return "Email"
      if (url.includes("tel:")) return "Phone"

      return "Link"
    }
  }

  return (
    <motion.div className="min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header with Banner */}
      <motion.div
        className="w-full h-48 sm:h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </motion.div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8" variants={fadeInVariants}>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <motion.div
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image || "/placeholder.svg"}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
                  </div>
                )}
              </motion.div>

              {/* Name and Username */}
              <motion.h1 className="text-2xl sm:text-3xl font-bold text-gray-900" variants={itemVariants}>
                {profile.name || "Your Name"}
              </motion.h1>

              <motion.p className="text-blue-600 font-medium mt-1" variants={itemVariants}>
                @{profile.username || "username"}
              </motion.p>

              {/* Bio */}
              <motion.p className="text-gray-600 mt-4 max-w-2xl" variants={itemVariants}>
                {profile.bio || "Your professional bio will appear here."}
              </motion.p>

              {/* Social Links */}
              {profile.links && profile.links.length > 0 && (
                <motion.div className="flex flex-wrap justify-center gap-2 mt-6" variants={containerVariants}>
                  {profile.links.map((link, index) => {
                    if (!link.url) return null
                    const platform = link.label || getPlatformName(link.url)

                    return (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -3, backgroundColor: "#E5E7EB" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <SocialMediaIcon platform={platform} />
                        <span className="text-sm">{platform}</span>
                      </motion.a>
                    )
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Left Column */}
          <motion.div className="md:col-span-1 space-y-6" variants={fadeInVariants}>
            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-2">
                    <Star size={16} />
                  </span>
                  Skills
                </motion.h2>

                <div className="space-y-4">
                  {Array.from(new Set(profile.skills.map((skill) => skill.category || "Other"))).map((category) => (
                    <motion.div key={category} className="mb-4 last:mb-0" variants={itemVariants}>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wider">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills
                          .filter((skill) => (skill.category || "Other") === category)
                          .map((skill, index) => (
                            <motion.span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              variants={itemVariants}
                              whileHover={{ y: -2, backgroundColor: "#DBEAFE" }}
                            >
                              {skill.name}
                            </motion.span>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-green-100 text-green-600 p-1.5 rounded-lg mr-2">
                    <Calendar size={16} />
                  </span>
                  Education
                </motion.h2>

                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      className="border-l-2 border-green-500 pl-4 py-1"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <h3 className="text-base font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-sm text-gray-600">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateRange(edu.startDate || "", edu.endDate || "")}
                      </p>
                      {edu.description && <p className="text-xs text-gray-600 mt-2">{edu.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Info */}
            {profile.contactInfo && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg mr-2">
                    <Mail size={16} />
                  </span>
                  Contact
                </motion.h2>

                <div className="space-y-3">
                  {profile.contactInfo.email && (
                    <motion.a
                      href={`mailto:${profile.contactInfo.email}`}
                      className="flex items-center text-gray-700 hover:text-blue-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{profile.contactInfo.email}</span>
                    </motion.a>
                  )}

                  {profile.contactInfo.phone && (
                    <motion.a
                      href={`tel:${profile.contactInfo.phone}`}
                      className="flex items-center text-gray-700 hover:text-blue-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <Phone size={16} className="mr-2" />
                      <span className="text-sm">{profile.contactInfo.phone}</span>
                    </motion.a>
                  )}

                  {profile.contactInfo.website && (
                    <motion.a
                      href={profile.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-blue-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      <span className="text-sm">Website</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div className="md:col-span-2 space-y-6" variants={fadeInVariants}>
            {/* Experience Section */}
            {profile.experience && profile.experience.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-2">
                    <MapPin size={16} />
                  </span>
                  Experience
                </motion.h2>

                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      className="border-l-2 border-blue-500 pl-4 py-1"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        <div className="mt-1 sm:mt-0">
                          <p className="text-xs text-gray-500">
                            {formatDateRange(exp.startDate || "", exp.endDate || "")}
                          </p>
                          {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {profile.projects && profile.projects.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-yellow-100 text-yellow-600 p-1.5 rounded-lg mr-2">
                    <Star size={16} />
                  </span>
                  Projects
                </motion.h2>

                <div className="grid grid-cols-1 gap-6">
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
                            src={project.image}
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
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
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
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer with looqmy logo */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 flex items-center justify-center gap-2">
            © {new Date().getFullYear()} {profile.name} • Built with <Logo animate={false} className="text-xl inline" />
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
