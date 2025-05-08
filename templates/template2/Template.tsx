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

  // Format rentang tanggal
  const formatDateRange = (startDate: string, endDate: string | undefined) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // Varian animasi
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

  const gradientBackground = "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 50%, #10B981 100%)"

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Fixed Header */}
      <motion.div
        className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg"
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
          
          {/* Mobile Menu Button - FIXED to ensure it's visible */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 border border-gray-200"
              variants={itemVariants}
              aria-label="Toggle Menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - FIXED to ensure it shows content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-lg absolute w-full z-50"
            >
              <nav className="flex flex-col px-4 py-2 space-y-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={`mobile-${link.label}`}
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variants={itemVariants}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                {/* Show social icons in mobile menu */}
                {profile.links && profile.links.length > 0 && (
                  <div className="flex space-x-3 py-3 justify-center border-t border-gray-100 mt-2">
                    {profile.links.map((link, index) => (
                      <motion.a
                        key={`mobile-social-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        variants={itemVariants}
                        title={link.label}
                      >
                        <SocialMediaIcon platform={link.label || ""} />
                      </motion.a>
                    ))}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Banner and Profile - FIXED to ensure they appear */}
      <motion.div
        className="relative w-full"
        variants={fadeInVariants}
      >
        {/* Banner Image */}
        <div 
          className="w-full h-48 sm:h-64 bg-cover bg-center"
          style={{
            backgroundImage: profile.banner_image
              ? `url(${profile.banner_image})`
              : gradientBackground,
          }}
        ></div>
        
        {/* Profile Image - Positioned to overlap banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
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

      {/* Name and Username Section - Adjusted for profile image overlap */}
      <motion.div className="pt-20 pb-8 text-center bg-white" variants={fadeInVariants}>
        <motion.h1 className="text-3xl font-bold text-gray-900" variants={itemVariants}>
          {profile.name || "mhaekal"}
        </motion.h1>
        <motion.p className="text-blue-500 font-medium mt-1" variants={itemVariants}>
          @{profile.username || "username"}
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <motion.section id="about" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            variants={itemVariants}
          >
            <motion.h2 className="text-2xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700 leading-relaxed" variants={itemVariants}>
              {profile.bio || "idc and idkkan bisa uahaha senengnyo Abang Jakarta pusat Jakarta DKI Jakarta pusat Jakarta DKI Jakarta pusat Jakarta DKI Jakarta pusat ke kanan dengan menggunakan sesi tes"}
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Connect Section - REDESIGNED with unique layout */}
        {profile.links && profile.links.length > 0 && (
          <motion.section id="connect" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
              Connect with Me
            </motion.h2>
            
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left decorative area */}
                <div className="hidden md:block bg-gradient-to-br from-blue-400 to-indigo-500 p-6">
                  <div className="h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.48 22.926l-1.193.658c-6.979 3.621-19.082-17.494-12.279-21.484l1.145-.637 3.714 6.467-1.139.632c-2.067 1.245 2.76 9.707 4.879 8.545l1.162-.642 3.711 6.461zm-9.808-22.926l-1.68.975 3.714 6.466 1.681-.975-3.715-6.466zm8.613 14.997l-1.68.975 3.714 6.467 1.681-.975-3.715-6.467z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Right content area */}
                <div className="col-span-2 p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Let's stay connected</h3>
                  <p className="text-gray-600 mb-6">Find me on these platforms and let's collaborate!</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.links.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-3 text-blue-500 flex-shrink-0">
                          <SocialMediaIcon platform={link.label || ""} />
                        </span>
                        <span className="font-medium text-gray-700">{link.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Experience Section */}
        <motion.section id="experience" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>
          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  variants={itemVariants}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-blue-500">{exp.company}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-gray-500">{formatDateRange(exp.startDate, exp.endDate)}</p>
                      {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-600 mt-3 leading-relaxed">{exp.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No experience entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Education Section */}
        <motion.section id="education" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>
          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  variants={itemVariants}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-gray-500">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-600 mt-3 leading-relaxed">{edu.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No education entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Skills Section */}
        <motion.section id="skills" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Skills
          </motion.h2>
          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
              variants={itemVariants}
            >
              {Array.from(new Set(profile.skills.map((skill) => skill.category || "General"))).map((category) => (
                <motion.div key={category} className="mb-8 last:mb-0" variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {profile.skills
                      .filter((skill) => (skill.category || "General") === category)
                      .map((skill, index) => (
                        <motion.div key={index} className="flex flex-col" variants={itemVariants}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700">{skill.name}</span>
                            <span className="text-xs text-gray-500">
                              {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div
                              className="bg-blue-500 h-2.5 rounded-full"
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No skills added yet.
            </motion.div>
          )}
        </motion.section>

        {/* Projects Section - FIXED with 16:9 aspect ratio */}
        <motion.section id="projects" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Projects
          </motion.h2>
          {profile.projects && profile.projects.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
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
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="View Project"
                        >
                          <svg
                            className="w-6 h-6"
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
                    <p className="text-gray-600 mt-2 leading-relaxed flex-grow">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <motion.div className="mt-4 flex flex-wrap gap-2" variants={containerVariants}>
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-700"
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500"
              variants={itemVariants}
            >
              No projects added yet.
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-4 text-xs text-blue-500 hover:underline"
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
