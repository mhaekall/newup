"use client"

import type { Profile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface TemplateProps {
  profile: Profile
}

export default function Template2({ profile }: TemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Format date range
  const formatDateRange = (startDate: string, endDate: string | undefined) => {
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

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#connect", label: "Connect" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
  ]

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Fixed Header with improved mobile layout */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 className="text-xl font-semibold text-gray-900" variants={itemVariants}>
            {profile.name || "mhaekal"}
          </motion.h1>
          
          {/* Desktop Navigation */}
          <motion.nav className="hidden md:flex items-center space-x-1" variants={containerVariants}>
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                variants={itemVariants}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
          
          {/* Mobile Menu Button - Enhanced visibility */}
          <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-800 border border-gray-200 bg-white shadow-sm"
            variants={itemVariants}
            aria-label="Toggle Menu"
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.header>
      
      {/* Mobile Navigation Menu - Improved text visibility and styling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4 border-b border-gray-100">
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} className="text-gray-800" />
                </button>
              </div>
              
              <nav className="p-4">
                {navLinks.map((link) => (
                  <motion.a
                    key={`mobile-${link.label}`}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg mb-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              
              {/* Social links in mobile menu */}
              {profile.links && profile.links.length > 0 && (
                <div className="mt-4 p-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">CONNECT WITH ME</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.links.map((link, index) => (
                      <motion.a
                        key={`mobile-social-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                        variants={itemVariants}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mr-2">
                          <SocialMediaIcon platform={link.label || ""} />
                        </span>
                        <span className="text-gray-800 text-sm">{link.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile section with properly positioned elements */}
      <motion.div className="relative pb-6" variants={fadeInVariants}>
        {/* Name display at top */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name || "mhaekal"}</h1>
        </div>
        
        {/* Profile Image - Centered with proper sizing */}
        <div className="relative flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {(profile.name || "User").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {/* About Section */}
        <motion.section id="about" className="mb-8" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6"
            variants={itemVariants}
          >
            <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700 leading-relaxed" variants={itemVariants}>
              {profile.bio || "idc and idkkan bisa uahaha senengnyo Abang Jakarta pusat Jakarta DKI Jakarta pusat Jakarta DKI Jakarta pusat Jakarta DKI Jakarta pusat ke kanan dengan menggunakan sesi tes"}
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Connect Section - Redesigned for better mobile experience */}
        {profile.links && profile.links.length > 0 && (
          <motion.section id="connect" className="mb-8" variants={fadeInVariants}>
            <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              Connect with Me
            </motion.h2>
            
            <motion.div 
              className="bg-blue-50 rounded-2xl shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Let's stay connected</h3>
                <p className="text-gray-600 text-sm mb-4">Find me on these platforms and let's collaborate!</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {profile.links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-xl bg-white shadow-sm hover:shadow border border-gray-100"
                      variants={itemVariants}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mr-2">
                        <SocialMediaIcon platform={link.label || ""} />
                      </span>
                      <span className="font-medium text-gray-700 text-sm">{link.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Experience Section */}
        <motion.section id="experience" className="mb-8" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Experience
          </motion.h2>
          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-5"
                  variants={itemVariants}
                >
                  <div className="flex flex-col mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-blue-500 text-sm">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDateRange(exp.startDate, exp.endDate)}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  </div>
                  {exp.description && <p className="text-gray-600 text-sm mt-3">{exp.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-md p-5 text-center text-gray-500"
              variants={itemVariants}
            >
              No experience entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Education Section */}
        <motion.section id="education" className="mb-8" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Education
          </motion.h2>
          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-5"
                  variants={itemVariants}
                >
                  <div className="flex flex-col mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{edu.institution}</h3>
                    <p className="text-gray-600 text-sm">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDateRange(edu.startDate, edu.endDate)}</p>
                  </div>
                  {edu.description && <p className="text-gray-600 text-sm mt-3">{edu.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-md p-5 text-center text-gray-500"
              variants={itemVariants}
            >
              No education entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Skills Section */}
        <motion.section id="skills" className="mb-8" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Skills
          </motion.h2>
          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-md p-5"
              variants={itemVariants}
            >
              {Array.from(new Set(profile.skills.map((skill) => skill.category || "General"))).map((category) => (
                <motion.div key={category} className="mb-6 last:mb-0" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {profile.skills
                      .filter((skill) => (skill.category || "General") === category)
                      .map((skill, index) => (
                        <motion.div key={index} className="flex flex-col" variants={itemVariants}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                            <span className="text-xs text-gray-500">
                              {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level * 20}%` }}
                              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
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
              className="bg-white rounded-2xl shadow-md p-5 text-center text-gray-500"
              variants={itemVariants}
            >
              No skills added yet.
            </motion.div>
          )}
        </motion.section>

        {/* Projects Section - With 16:9 aspect ratio */}
        <motion.section id="projects" className="mb-8" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Projects
          </motion.h2>
          {profile.projects && profile.projects.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                  variants={itemVariants}
                >
                  {project.image && (
                    <div className="w-full relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                      <motion.img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 p-1"
                          whileTap={{ scale: 0.95 }}
                          title="View Project"
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
                    <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <motion.div className="mt-3 flex flex-wrap gap-1" variants={containerVariants}>
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="inline-block bg-blue-100 rounded-full px-2 py-1 text-xs font-medium text-blue-700"
                            variants={itemVariants}
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
              className="bg-white rounded-2xl shadow-md p-5 text-center text-gray-500"
              variants={itemVariants}
            >
              No projects added yet.
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-3 text-xs text-blue-500 hover:underline"
            whileHover={{ y: -2 }}
          >
            Back to Top
          </motion.button>
          <p className="text-sm">
            © {new Date().getFullYear()} {profile.name || "mhaekal"}
          </p>
          <p className="text-xs mt-1">
            Built with looqmy
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
