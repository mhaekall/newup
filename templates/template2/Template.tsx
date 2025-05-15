"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  ExternalLink,
  Mail,
  Phone,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Menu,
  X,
} from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { ProfileBanner } from "@/components/ui/profile-banner"

interface TemplateProps {
  profile: Profile
}

export default function Template2({ profile }: TemplateProps) {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add scroll event listener to update active section
    const handleScroll = () => {
      const sections = ["about", "experience", "education", "skills", "projects"]

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

  // Membuat data untuk progress timeline
  const educationSteps =
    profile.education?.map((edu) => ({
      title: edu.degree,
      description: edu.institution,
      completed: true,
      active: false,
    })) || []

  // Membuat data untuk progress timeline experience
  const experienceSteps =
    profile.experience?.map((exp) => ({
      title: exp.position,
      description: exp.company,
      completed: true,
      active: false,
    })) || []

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

  // Step navigation items
  const steps = [
    { id: "about", label: "About", icon: <User size={18} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
    { id: "skills", label: "Skills", icon: <Star size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
  ]

  return (
    <motion.div className="min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Custom Navbar */}
      <motion.nav
        className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <span className="text-xl font-bold text-rose-600">{profile.name || profile.username}</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-rose-600 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Menu size={24} />
            </motion.div>
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {steps.map((step) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className={`text-sm font-medium transition-colors ${
                activeSection === step.id ? "text-rose-600" : "text-gray-600 hover:text-rose-600"
              }`}
            >
              {step.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white pt-16"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 py-6 space-y-6">
              {steps.map((step, index) => (
                <motion.a
                  key={step.id}
                  href={`#${step.id}`}
                  className={`flex items-center py-3 border-b border-gray-100 ${
                    activeSection === step.id ? "text-rose-600" : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="mr-3">{step.icon}</span>
                  <span className="text-lg font-medium">{step.label}</span>
                  {activeSection === step.id && <ChevronRight className="ml-auto" size={18} />}
                </motion.a>
              ))}

              <div className="pt-6 text-center">
                <Logo animate={false} className="text-3xl inline-block text-rose-500" />
                <p className="text-sm text-gray-500 mt-2">Portfolio by Looqmy</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Banner */}
      <div className="w-full relative">
        {profile.banner_image ? (
          <ProfileBanner bannerUrl={profile.banner_image} height={300} className="w-full" />
        ) : (
          <motion.div
            className="w-full h-48 sm:h-64 bg-cover bg-center relative"
            style={{
              backgroundImage: "linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)",
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </motion.div>
        )}
      </div>

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
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
                  </div>
                )}
              </motion.div>

              {/* Name and Username */}
              <motion.h1 className="text-2xl sm:text-3xl font-bold text-gray-900" variants={itemVariants}>
                {profile.name || "Your Name"}
              </motion.h1>

              <motion.p className="text-rose-600 font-medium mt-1" variants={itemVariants}>
                @{profile.username || "username"}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Left Column */}
          <motion.div className="md:col-span-1 space-y-6" variants={fadeInVariants}>
            {/* About Section */}
            <motion.section
              id="about"
              className="bg-white rounded-xl shadow-sm p-5 scroll-mt-24"
              variants={itemVariants}
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            >
              <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                <span className="bg-rose-100 text-rose-600 p-1.5 rounded-lg mr-2">
                  <User size={16} />
                </span>
                About Me
              </motion.h2>

              <motion.p className="text-gray-600 mt-4" variants={itemVariants}>
                {profile.bio || "Your professional bio will appear here."}
              </motion.p>
            </motion.section>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.section
                id="skills"
                className="bg-white rounded-xl shadow-sm p-5 scroll-mt-24"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                  <span className="bg-rose-100 text-rose-600 p-1.5 rounded-lg mr-2">
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
                              className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm"
                              variants={itemVariants}
                              whileHover={{ y: -2, backgroundColor: "#FFF1F2" }}
                            >
                              {skill.name}
                            </motion.span>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Contact & Connect Section */}
            <motion.section
              className="bg-white rounded-xl shadow-sm p-5"
              variants={itemVariants}
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            >
              <motion.h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center" variants={itemVariants}>
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg mr-2">
                  <Mail size={16} />
                </span>
                Contact & Connect
              </motion.h2>

              <div className="space-y-3">
                {/* Email */}
                {profile.links
                  ?.filter((link) => link.label === "Email" || link.url?.includes("mailto:"))
                  .map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      className="flex items-center text-gray-700 hover:text-rose-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{link.url?.replace("mailto:", "")}</span>
                    </motion.a>
                  ))}

                {/* Phone */}
                {profile.links
                  ?.filter((link) => link.label === "Phone" || link.url?.includes("tel:"))
                  .map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      className="flex items-center text-gray-700 hover:text-rose-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <Phone size={16} className="mr-2" />
                      <span className="text-sm">{link.url?.replace("tel:", "")}</span>
                    </motion.a>
                  ))}

                {/* Website */}
                {profile.links
                  ?.filter(
                    (link) =>
                      link.label === "Website" ||
                      (link.url && !link.url.includes("mailto:") && !link.url.includes("tel:")),
                  )
                  .slice(0, 1)
                  .map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-rose-600"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      <span className="text-sm">Website</span>
                    </motion.a>
                  ))}
              </div>

              {/* Social Links */}
              {profile.links && profile.links.length > 0 && (
                <motion.div className="flex flex-wrap gap-2 mt-4" variants={containerVariants}>
                  {profile.links
                    .filter(
                      (link) =>
                        link.label !== "Email" &&
                        !link.url?.includes("mailto:") &&
                        link.label !== "Phone" &&
                        !link.url?.includes("tel:") &&
                        link.label !== "Website",
                    )
                    .map((link, index) => {
                      if (!link.url) return null
                      const platform = link.label || getPlatformName(link.url)

                      return (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
                          variants={itemVariants}
                          whileHover={{ y: -2, backgroundColor: "#E5E7EB" }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <SocialMediaIcon platform={link.icon || platform} />
                          <span className="text-xs">{platform}</span>
                        </motion.a>
                      )
                    })}
                </motion.div>
              )}
            </motion.section>
          </motion.div>

          {/* Right Column */}
          <motion.div className="md:col-span-2 space-y-6" variants={fadeInVariants}>
            {/* Experience with Timeline */}
            {profile.experience && profile.experience.length > 0 && (
              <motion.section
                id="experience"
                className="bg-white rounded-xl shadow-sm p-5 scroll-mt-24"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2" variants={itemVariants}>
                  Experience
                </motion.h2>

                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-rose-400"></div>

                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-2 w-6 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-rose-500 border-4 border-rose-100"></div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-rose-600">{exp.company}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Education with Timeline */}
            {profile.education && profile.education.length > 0 && (
              <motion.section
                id="education"
                className="bg-white rounded-xl shadow-sm p-5 scroll-mt-24"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2" variants={itemVariants}>
                  Education
                </motion.h2>

                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-cyan-400"></div>

                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-2 w-6 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-cyan-100"></div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-cyan-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.startDate} - {edu.endDate || "Present"}
                          </p>
                          <p className="mt-2 text-gray-700">{edu.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <motion.section
                id="projects"
                className="bg-white rounded-xl shadow-sm p-5 scroll-mt-24"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2" variants={itemVariants}>
                  Projects
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      {project.image && (
                        <div className="w-full aspect-video overflow-hidden">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="mt-2 text-gray-700">{project.description}</p>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <span>View Project</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer with looqmy logo */}
      <motion.footer
        className="bg-gray-900 text-white py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo animate={false} className="text-2xl text-white" />
            <span className="ml-2 font-medium">Portfolio</span>
          </div>
          <div className="flex items-center">
            <Heart size={16} className="mr-2" />
            <p className="text-sm">
              © {new Date().getFullYear()} {profile.name} • All rights reserved
            </p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}
