"use client"

import type { Profile } from "@/types"
import { motion } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
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
      {/* iOS-style top bar */}
      <motion.div
        className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/90 supports-[backdrop-filter]:bg-white/60"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1 className="text-xl font-semibold text-gray-900" variants={itemVariants}>
            {profile.name}
          </motion.h1>
          <motion.div className="flex items-center space-x-4" variants={containerVariants}>
            {profile.links && profile.links.length > 0 && (
              <div className="flex space-x-2">
                {profile.links.slice(0, 3).map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.1, backgroundColor: "#E5E7EB" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SocialMediaIcon platform={link.label || ""} />
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

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

      {/* Hero Section */}
      <motion.div className="bg-white" variants={fadeInVariants}>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              {profile.profile_image ? (
                <img
                  src={profile.profile_image || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </motion.div>

            {/* Profile Info */}
            <motion.div className="text-center md:text-left" variants={containerVariants}>
              <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900" variants={itemVariants}>
                {profile.name}
              </motion.h1>
              <motion.p className="text-blue-500 font-medium mt-1" variants={itemVariants}>
                @{profile.username}
              </motion.p>
              <motion.p className="text-gray-700 mt-4 max-w-2xl" variants={itemVariants}>
                {profile.bio}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* iOS-style segmented control for sections */}
        <motion.div className="bg-gray-100 rounded-xl p-1 flex mb-8 overflow-x-auto" variants={fadeInVariants}>
          <motion.a
            href="#about"
            className="flex-1 py-2 px-4 rounded-lg bg-white shadow-sm text-center font-medium text-gray-900"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            About
          </motion.a>
          <motion.a
            href="#experience"
            className="flex-1 py-2 px-4 text-center font-medium text-gray-700 hover:text-gray-900"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Experience
          </motion.a>
          <motion.a
            href="#education"
            className="flex-1 py-2 px-4 text-center font-medium text-gray-700 hover:text-gray-900"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Education
          </motion.a>
          <motion.a
            href="#skills"
            className="flex-1 py-2 px-4 text-center font-medium text-gray-700 hover:text-gray-900"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Skills
          </motion.a>
          <motion.a
            href="#projects"
            className="flex-1 py-2 px-4 text-center font-medium text-gray-700 hover:text-gray-900"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Projects
          </motion.a>
        </motion.div>

        {/* About Section */}
        <motion.section id="about" className="mb-12" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <motion.h2 className="text-2xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700" variants={itemVariants}>
              {profile.bio}
            </motion.p>

            {/* Social Links */}
            {profile.links && profile.links.length > 0 && (
              <motion.div className="mt-6" variants={containerVariants}>
                <motion.h3 className="text-lg font-semibold text-gray-800 mb-3" variants={itemVariants}>
                  Connect with me
                </motion.h3>
                <motion.div className="flex flex-wrap gap-3" variants={containerVariants}>
                  {profile.links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      variants={itemVariants}
                      whileHover={{ y: -3, backgroundColor: "#E5E7EB" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="mr-2 text-blue-500">
                        <SocialMediaIcon platform={link.label || ""} />
                      </span>
                      <span>{link.label}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section id="experience" className="mb-12" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-6"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-sm text-gray-500">{formatDateRange(exp.startDate, exp.endDate)}</p>
                      {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-600 mt-4">{exp.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No experience entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Education Section */}
        <motion.section id="education" className="mb-12" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-6"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-gray-600">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-sm text-gray-500">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-600 mt-4">{edu.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No education entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Skills Section */}
        <motion.section id="skills" className="mb-12" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Skills
          </motion.h2>

          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Group skills by category */}
              {Array.from(new Set(profile.skills.map((skill) => skill.category))).map((category) => (
                <motion.div key={category} className="mb-8 last:mb-0" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skills
                      .filter((skill) => skill.category === category)
                      .map((skill, index) => (
                        <motion.div key={index} className="flex flex-col" variants={itemVariants}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700">{skill.name}</span>
                            <span className="text-xs text-gray-500">
                              {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level * 20}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No skills added yet.
            </motion.div>
          )}
        </motion.section>

        {/* Projects Section */}
        <motion.section id="projects" className="mb-12" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Projects
          </motion.h2>

          {profile.projects && profile.projects.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  {project.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <motion.img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </motion.a>
                      )}
                    </div>
                    <p className="text-gray-600 mt-3">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <motion.div className="mt-4 flex flex-wrap gap-2" variants={containerVariants}>
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="inline-block bg-blue-50 rounded-full px-3 py-1 text-xs font-medium text-blue-600"
                            variants={itemVariants}
                            whileHover={{ y: -2, backgroundColor: "#DBEAFE" }}
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
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No projects added yet.
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* iOS-style footer */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 flex items-center justify-center gap-2">
            © {new Date().getFullYear()} {profile.name} • Built with <Logo animate={false} className="text-xl inline" />
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
