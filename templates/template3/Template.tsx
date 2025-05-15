"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, User, Briefcase, GraduationCap, Code, Home, Menu, X, ChevronRight } from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { ProfileBanner } from "@/components/ui/profile-banner"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add scroll event listener to update active section
    const handleScroll = () => {
      const sections = ["about", "contact", "experience", "education", "skills", "projects"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  // Step navigation items
  const steps = [
    { id: "about", label: "About", icon: <User size={18} /> },
    { id: "contact", label: "Contact", icon: <Home size={18} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
    { id: "skills", label: "Skills", icon: <Star size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
  ]

  return (
    <motion.div className="min-h-screen bg-gray-100" initial="hidden" animate="visible" variants={containerVariants}>
      {/* iOS-style top bar */}
      <motion.div
        className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/90 supports-[backdrop-filter]:bg-white/60"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-green-600">{profile.name || profile.username}</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                <Menu size={24} />
              </motion.div>
            )}
          </button>

          {/* Desktop navigation */}
          <motion.div className="hidden md:flex items-center space-x-6" variants={containerVariants}>
            {steps.map((step) => (
              <motion.a
                key={step.id}
                href={`#${step.id}`}
                className={`text-sm font-medium transition-colors ${
                  activeSection === step.id ? "text-green-600" : "text-gray-600 hover:text-green-600"
                }`}
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                {step.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-white pt-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-6">
                {steps.map((step, index) => (
                  <motion.a
                    key={step.id}
                    href={`#${step.id}`}
                    className={`flex items-center py-3 border-b border-gray-100 ${
                      activeSection === step.id ? "text-green-600" : "text-gray-700"
                    }`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="mr-3">{step.icon}</span>
                    <span className="text-lg font-medium">{step.label}</span>
                    {activeSection === step.id && (
                      <motion.div
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <ChevronRight size={18} />
                      </motion.div>
                    )}
                  </motion.a>
                ))}

                <div className="pt-6 text-center">
                  <Logo animate={false} className="text-3xl inline-block text-green-500" />
                  <p className="text-sm text-gray-500 mt-2">Portfolio by Looqmy</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Banner */}
      <div className="w-full relative">
        {profile.banner_image ? (
          <ProfileBanner bannerUrl={profile.banner_image} height={300} className="w-full" />
        ) : (
          <motion.div
            className="w-full h-64 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      {/* Hero Section */}
      <motion.div className="bg-white" variants={fadeInVariants}>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16 md:-mt-20 bg-white"
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
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
                </div>
              )}
            </motion.div>

            {/* Profile Info */}
            <motion.div className="text-center md:text-left" variants={containerVariants}>
              <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900" variants={itemVariants}>
                {profile.name}
              </motion.h1>
              <motion.p className="text-green-500 font-medium mt-1" variants={itemVariants}>
                @{profile.username}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* About Section */}
        <motion.section id="about" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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
          </motion.div>
        </motion.section>

        {/* Contact & Connect Section */}
        <motion.section id="contact" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <motion.h2 className="text-2xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              Contact & Connect
            </motion.h2>

            {/* Contact Info */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" variants={containerVariants}>
              {profile.links
                ?.filter(
                  (link) =>
                    link.label === "Email" ||
                    link.url?.includes("mailto:") ||
                    link.label === "Phone" ||
                    link.url?.includes("tel:"),
                )
                .map((link, index) => {
                  const platform = link.label || (link.url?.includes("mailto:") ? "Email" : "Phone")

                  return (
                    <motion.a
                      key={index}
                      href={link.url}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                    >
                      <SocialMediaIcon platform={link.icon || platform} />
                      <span className="ml-3">{link.url?.replace("mailto:", "").replace("tel:", "")}</span>
                    </motion.a>
                  )
                })}
            </motion.div>

            {/* Social Links */}
            {profile.links && profile.links.length > 0 && (
              <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
                {profile.links
                  .filter(
                    (link) =>
                      link.label !== "Email" &&
                      !link.url?.includes("mailto:") &&
                      link.label !== "Phone" &&
                      !link.url?.includes("tel:"),
                  )
                  .map((link, index) => {
                    if (!link.url) return null
                    const platform =
                      link.label ||
                      (link.url?.includes("https://") ? new URL(link.url).hostname.replace("www.", "") : "Link")

                    return (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-full text-green-800 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <SocialMediaIcon platform={link.icon || platform} />
                        <span>{platform}</span>
                      </motion.a>
                    )
                  })}
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section id="experience" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-0 relative" variants={containerVariants}>
              {/* Vertical timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-400"></div>

              {profile.experience.map((exp, index) => (
                <motion.div key={index} className="relative pl-10 pb-6" variants={itemVariants} whileHover={{ x: 5 }}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-6 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
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
                  </div>
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
        <motion.section id="education" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-0 relative" variants={containerVariants}>
              {/* Vertical timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-green-400"></div>

              {profile.education.map((edu, index) => (
                <motion.div key={index} className="relative pl-10 pb-6" variants={itemVariants} whileHover={{ x: 5 }}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-6 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-green-100"></div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{edu.institution}</h3>
                        <p className="text-gray-600">
                          {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-sm text-gray-500">{formatDateRange(edu.startDate, edu.endDate)}</p>
                      </div>
                    </div>
                    {edu.description && <p className="text-gray-600 mt-4">{edu.description}</p>}
                  </div>
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
        <motion.section id="skills" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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
                            <span className="text-xs text-gray-500">{skill.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  skill.level === "Beginner"
                                    ? 20
                                    : skill.level === "Elementary"
                                      ? 40
                                      : skill.level === "Intermediate"
                                        ? 60
                                        : skill.level === "Advanced"
                                          ? 80
                                          : 100
                                }%`,
                              }}
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
        <motion.section id="projects" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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
                    <div className="w-full aspect-video overflow-hidden">
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
                          className="text-green-500 hover:text-green-600"
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
                            className="inline-block bg-green-50 rounded-full px-3 py-1 text-xs font-medium text-green-600"
                            variants={itemVariants}
                            whileHover={{ y: -2, backgroundColor: "#DCFCE7" }}
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
        className="bg-gray-900 text-white py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo animate={false} className="text-2xl text-white" />
            <span className="ml-2 font-medium">Portfolio</span>
          </div>
          <div className="flex items-center">
            <Home size={16} className="mr-2" />
            <p className="text-sm">
              © {new Date().getFullYear()} {profile.name} • All rights reserved
            </p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}
