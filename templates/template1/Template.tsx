"use client"

import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

interface TemplateProps {
  profile: Profile
}

export default function Template1({ profile }: TemplateProps) {
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

  // Format display text for links
  const getDisplayText = (url: string, platform: string): string => {
    if (platform === "Email") {
      return url.replace("mailto:", "")
    }
    if (platform === "Phone") {
      return url.replace("tel:", "")
    }
    if (platform === "WhatsApp") {
      return "WhatsApp"
    }
    return platform
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
        className="w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg -mt-32 relative z-10">
        <motion.div className="flex flex-col items-center mb-8" variants={containerVariants}>
          {profile.profile_image && (
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <img
                src={profile.profile_image || "/placeholder.svg?height=128&width=128"}
                alt={`${profile.name || profile.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          <motion.h1 className="text-3xl font-bold text-gray-800" variants={itemVariants}>
            {profile.name || profile.username}
          </motion.h1>
          {profile.username && (
            <motion.p className="text-blue-500 mb-2" variants={itemVariants}>
              @{profile.username}
            </motion.p>
          )}
          {profile.bio && (
            <motion.p className="text-gray-600 text-center max-w-md mb-4" variants={itemVariants}>
              {profile.bio}
            </motion.p>
          )}

          {/* Social Links with Brand Icons */}
          {profile.links && profile.links.length > 0 && (
            <motion.div className="flex flex-wrap justify-center gap-2 mb-6" variants={containerVariants}>
              {profile.links.map((link, index) => {
                if (!link.url) return null
                const platform = link.label || getPlatformName(link.url)
                const displayText = getDisplayText(link.url, platform)

                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
                    variants={itemVariants}
                    whileHover={{ y: -3, backgroundColor: "#E5E7EB" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <SocialMediaIcon platform={platform} />
                    <span>{displayText}</span>
                  </motion.a>
                )
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <motion.div className="mb-8" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
              Skills
            </motion.h2>
            <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: "#DBEAFE" }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <motion.div className="mb-8" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
              Experience
            </motion.h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4"
                  variants={itemVariants}
                  whileHover={{ x: 5, borderColor: "#3B82F6" }}
                >
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <motion.div className="mb-8" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
              Education
            </motion.h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="border-l-4 border-green-500 pl-4"
                  variants={itemVariants}
                  whileHover={{ x: 5, borderColor: "#10B981" }}
                >
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                  {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <motion.div variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
              Projects
            </motion.h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  {project.image && (
                    <img
                      src={project.image || "/placeholder.svg?height=200&width=400"}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer with looqmy logo */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-8 mt-8"
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
