"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Star,
  Menu,
  X,
  ChevronRight,
  Heart,
  Share2,
  ExternalLink,
  Mail,
  Eye,
} from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { ProfileBanner } from "@/components/ui/profile-banner"
import { useProfileStats } from "@/hooks/use-profile-stats"
import { shareProfile } from "@/utils/share-profile"
import { submitContactForm } from "@/actions/contact-form"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
  // State
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "submitting" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  // Stats from hook (will use real data in production)
  const { viewCount, likeCount, isLiked, toggleLike } = useProfileStats(profile.username)

  // Refs for sections
  const aboutRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // Handle scroll
  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = [
        { id: "about", ref: aboutRef },
        { id: "contact", ref: contactRef },
        { id: "experience", ref: experienceRef },
        { id: "education", ref: educationRef },
        { id: "skills", ref: skillsRef },
        { id: "projects", ref: projectsRef },
      ]

      // Find the section that is currently in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveSection(tabId)
    setMenuOpen(false)

    // Scroll to the corresponding section
    const sectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
      about: aboutRef,
      contact: contactRef,
      experience: experienceRef,
      education: educationRef,
      skills: skillsRef,
      projects: projectsRef,
    }

    const targetRef = sectionMap[tabId]
    if (targetRef && targetRef.current) {
      const yOffset = -80 // Header height offset
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Handle share
  const handleShare = async () => {
    const result = await shareProfile(profile.username, profile.name)
    if (result.success && result.method === "clipboard") {
      alert("Link copied to clipboard!")
    }
  }

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus({ status: "submitting", message: "Sending message..." })

    const formData = new FormData(e.currentTarget)
    // Add recipient email from profile
    const contactEmail = profile.links
      ?.find((link) => link.label === "Email" || link.url?.includes("mailto:"))
      ?.url?.replace("mailto:", "")

    if (contactEmail) {
      formData.append("recipientEmail", contactEmail)
    }

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setFormStatus({ status: "success", message: result.message })
        // Reset form
        e.currentTarget.reset()
      } else {
        setFormStatus({ status: "error", message: result.message })
      }
    } catch (error) {
      setFormStatus({
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    }
  }

  if (!mounted) {
    return null
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
    { id: "contact", label: "Contact", icon: <Mail size={18} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
    { id: "skills", label: "Skills", icon: <Star size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
  ]

  return (
    <motion.div className="min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={containerVariants}>
      {/* iOS-style top bar */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/90 supports-[backdrop-filter]:bg-white/60"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">{profile.name || profile.username}</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
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
                  activeSection === step.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault()
                  handleTabChange(step.id)
                }}
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
              <div className="px-4 py-6 space-y-6 flex flex-col h-full">
                <div className="flex-1">
                  {steps.map((step, index) => (
                    <motion.a
                      key={step.id}
                      href={`#${step.id}`}
                      className={`flex items-center py-3 border-b border-gray-100 ${
                        activeSection === step.id ? "text-blue-600" : "text-gray-700"
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTabChange(step.id)
                      }}
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
                </div>

                <div className="pt-6 text-center mt-auto">
                  <Logo animate={false} className="text-3xl inline-block text-blue-500" />
                  <p className="text-sm text-gray-500 mt-2 font-light" style={{ fontFamily: "'Pacifico', cursive" }}>
                    Portfolio by Looqmy
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Banner and Profile Image */}
      <div className="w-full relative">
        {/* Banner */}
        {profile.banner_image ? (
          <div className="w-full h-48 md:h-64 relative">
            <ProfileBanner bannerUrl={profile.banner_image} height={256} className="w-full" />
          </div>
        ) : (
          <motion.div
            className="w-full h-48 md:h-64 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Profile Image - Positioned at the bottom edge of banner */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white z-10"
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
              {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
            </div>
          )}
        </motion.div>
      </div>

      {/* Profile Info - Adjusted for profile image position */}
      <motion.div className="bg-white pt-20 pb-8" variants={fadeInVariants}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={containerVariants}>
            <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900" variants={itemVariants}>
              {profile.name}
            </motion.h1>
            <motion.p className="text-blue-500 font-medium mt-1" variants={itemVariants}>
              @{profile.username}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <div className="bg-white border-t border-b border-gray-200 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLike}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center text-gray-500">
              <Eye size={18} className="mr-1" />
              <span>{viewCount} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-[57px] z-30">
        <div className="flex overflow-x-auto hide-scrollbar">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleTabChange(step.id)}
              className={`flex-1 py-3 px-2 text-sm font-medium whitespace-nowrap ${
                activeSection === step.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <div className="flex flex-col items-center">
                {step.icon}
                <span className="mt-1">{step.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* About Section */}
        <motion.section ref={aboutRef} id="about" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.div
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <motion.h2 className="text-2xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700" variants={itemVariants}>
              {profile.bio || "No bio information available."}
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Contact & Connect Section */}
        <motion.section ref={contactRef} id="contact" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={formStatus.status === "submitting"}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {formStatus.status === "submitting" ? "Sending..." : "Send Message"}
              </button>

              {formStatus.status !== "idle" && (
                <div className={`text-center ${formStatus.status === "success" ? "text-green-600" : "text-red-600"}`}>
                  {formStatus.message}
                </div>
              )}
            </form>

            {/* Social Links */}
            {profile.links && profile.links.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Connect</h3>
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
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-800 transition-colors"
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
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section ref={experienceRef} id="experience" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-0 relative pl-6 md:pl-10" variants={containerVariants}>
              {/* Vertical timeline line */}
              <div className="absolute left-3 md:left-4 top-2 bottom-0 w-0.5 bg-blue-400 rounded-full"></div>

              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="relative pb-8 last:pb-0"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-13px] md:left-[-18px] top-2 w-6 h-6 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100 z-10"></div>
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
        <motion.section ref={educationRef} id="education" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-0 relative pl-6 md:pl-10" variants={containerVariants}>
              {/* Vertical timeline line */}
              <div className="absolute left-3 md:left-4 top-2 bottom-0 w-0.5 bg-green-400 rounded-full"></div>

              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="relative pb-8 last:pb-0"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-13px] md:left-[-18px] top-2 w-6 h-6 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-green-100 z-10"></div>
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
        <motion.section ref={skillsRef} id="skills" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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
                              className="bg-blue-500 h-2 rounded-full"
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
        <motion.section ref={projectsRef} id="projects" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
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
                          className="text-blue-500 hover:text-blue-600"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={18} />
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

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Logo animate={false} className="text-3xl text-white" style={{ fontFamily: "'Pacifico', cursive" }} />
          <p className="text-sm text-gray-300 mt-2 font-light" style={{ fontFamily: "'Pacifico', cursive" }}>
            Portfolio by Looqmy
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
