"use client"

import type { Profile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons"
import { useEffect, useState } from "react"
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
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
  ]

  const gradientBackground = "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 50%, #10B981 100%)"

  return (
    <motion.div
      className="min-h-screen bg-gray-50 transition-colors duration-300"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Bilah Atas Gaya iOS yang Ditingkatkan */}
      <motion.div
        className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 className="text-xl font-semibold text-gray-900" variants={itemVariants}>
            {profile.name}
          </motion.h1>
          {/* Navigasi Desktop */}
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
          {/* Tombol Menu Mobile */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              variants={itemVariants}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        {/* Menu Navigasi Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-lg absolute w-full"
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Banner */}
      <motion.div
        className="w-full h-64 sm:h-72 md:h-80 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : gradientBackground,
        }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            {profile.profile_image ? (
              <img
                src={profile.profile_image || "/placeholder.svg"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bagian Hero */}
      <motion.div className="bg-white transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900" variants={itemVariants}>
            {profile.name}
          </motion.h1>
          <motion.p className="text-blue-500 font-medium mt-1 text-lg" variants={itemVariants}>
            @{profile.username}
          </motion.p>
          <motion.p className="text-gray-700 mt-4 max-w-2xl mx-auto" variants={itemVariants}>
            {profile.bio}
          </motion.p>
        </div>
      </motion.div>

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Bagian Tentang */}
        <motion.section id="about" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
            variants={itemVariants}
          >
            <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700 leading-relaxed" variants={itemVariants}>
              {profile.bio}
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Bagian Koneksi */}
        {profile.links && profile.links.length > 0 && (
          <motion.section id="connect" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
              variants={itemVariants}
            >
              <motion.h3 className="text-xl font-semibold text-gray-800 mb-3" variants={itemVariants}>
                Connect with Me
              </motion.h3>
              <motion.div className="flex flex-wrap gap-3">
                {profile.links.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    variants={itemVariants}
                    title={link.label}
                  >
                    <span className="mr-2 text-blue-500">
                      <SocialMediaIcon platform={link.label || ""} />
                    </span>
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </motion.section>
        )}

        {/* Bagian Pengalaman */}
        <motion.section id="experience" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>
          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500 transition-colors duration-300"
              variants={itemVariants}
            >
              No experience entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Pendidikan */}
        <motion.section id="education" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>
          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500 transition-colors duration-300"
              variants={itemVariants}
            >
              No education entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Keahlian */}
        <motion.section id="skills" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Skills
          </motion.h2>
          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500 transition-colors duration-300"
              variants={itemVariants}
            >
              No skills added yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Proyek */}
        <motion.section id="projects" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Projects
          </motion.h2>
          {profile.projects && profile.projects.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-colors duration-300"
                  variants={itemVariants}
                >
                  {project.image && (
                    <div className="w-full h-48 sm:h-56 overflow-hidden">
                      <motion.img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }} // Animate when in view
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
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
                          whileHover={{ scale: 1.1, rotate: 3 }}
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
              className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500 transition-colors duration-300"
              variants={itemVariants}
            >
              No projects added yet.
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Footer Gaya iOS */}
      <motion.footer
        className="bg-white border-t border-gray-200 py-8 transition-colors duration-300"
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
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="text-xs mt-1">
            Built with looqmy
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
