"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Menu,
  X,
  ChevronRight,
  Heart,
  Share2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { ProfileBanner } from "@/components/ui/profile-banner"
import { useProfileAnalytics } from "@/hooks/use-profile-analytics"
import { IOSTimeline } from "@/components/ui/ios-timeline"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
  // State
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "submitting" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  // Analytics hook - real data!
  const { stats, handleLike } = useProfileAnalytics(profile.username)

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
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Portfolio`,
          text: `Check out ${profile.name}'s portfolio!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fallback to clipboard
        copyToClipboard()
      }
    } else {
      // Fallback to clipboard
      copyToClipboard()
    }
  }

  // Copy to clipboard helper
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
      })
  }

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus({ status: "submitting", message: "Sending message..." })

    // In a real implementation, you would send the form data to your server
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setFormStatus({
        status: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      })
      // Reset form
      e.currentTarget.reset()
    }, 1500)
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

  // Experience timeline items
  const experienceTimelineItems =
    profile.experience?.map((exp) => ({
      id: exp.company + exp.startDate,
      title: exp.position,
      subtitle: exp.company,
      date: formatDateRange(exp.startDate, exp.endDate),
      content: (
        <div className="space-y-2">
          {exp.location && (
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{exp.location}</span>
            </div>
          )}
          {exp.description && <p>{exp.description}</p>}
        </div>
      ),
      color: "blue",
    })) || []

  // Education timeline items
  const educationTimelineItems =
    profile.education?.map((edu) => ({
      id: edu.institution + edu.startDate,
      title: edu.institution,
      subtitle: `${edu.degree} ${edu.field ? `in ${edu.field}` : ""}`,
      date: formatDateRange(edu.startDate, edu.endDate),
      content: edu.description && <p>{edu.description}</p>,
      color: "green",
    })) || []

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

      {/* Banner */}
      <div className="w-full relative">
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
      </div>

      {/* Profile Info with Profile Image */}
      <motion.div className="bg-white py-6" variants={fadeInVariants}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image - Positioned to the side on desktop, centered on mobile */}
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white -mt-20 md:mt-[-5rem] flex-shrink-0"
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

            {/* Name and Username */}
            <motion.div className="text-center md:text-left" variants={containerVariants}>
              <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900" variants={itemVariants}>
                {profile.name}
              </motion.h1>
              <motion.p className="text-blue-500 font-medium mt-1" variants={itemVariants}>
                @{profile.username}
              </motion.p>
            </motion.div>

            {/* Action buttons - desktop */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Heart size={18} className={stats.isLiked ? "fill-red-500 text-red-500" : ""} />
                <span>{stats.likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>

              <div className="flex items-center text-gray-500">
                <Eye size={18} className="mr-1" />
                <span>{stats.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Bar - mobile only */}
      <div className="md:hidden bg-white border-t border-b border-gray-200 py-3">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={20} className={stats.isLiked ? "fill-red-500 text-red-500" : ""} />
              <span>{stats.likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Share2 size={20} />
              <span>Share</span>
            </button>

            <div className="flex items-center text-gray-500">
              <Eye size={18} className="mr-1" />
              <span>{stats.views} views</span>
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
        <motion.section ref={aboutRef} id="about" className="mb-12 md:mb-16 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            About Me
          </motion.h2>
          <motion.div
            className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <motion.p className="text-gray-700 text-lg leading-relaxed" variants={itemVariants}>
              {profile.bio || "No bio information available."}
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Contact & Connect Section */}
        <motion.section ref={contactRef} id="contact" className="mb-12 md:mb-16 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Contact & Connect
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info */}
            <motion.div
              className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 md:p-8"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                    const icon = platform === "Email" ? <Mail size={20} /> : <Phone size={20} />

                    return (
                      <motion.a
                        key={index}
                        href={link.url}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          {icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{platform}</p>
                          <p className="text-sm text-gray-600">
                            {link.url?.replace("mailto:", "").replace("tel:", "")}
                          </p>
                        </div>
                      </motion.a>
                    )
                  })}
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
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
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect</h3>

              <div className="space-y-3">
                {profile.links
                  ?.filter(
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
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <SocialMediaIcon platform={link.icon || platform} className="mr-3" />
                        <span className="font-medium text-gray-900">{platform}</span>
                        <ExternalLink size={14} className="ml-auto text-gray-400" />
                      </motion.a>
                    )
                  })}
              </div>

              {(!profile.links || profile.links.length === 0) && (
                <p className="text-gray-500">No social links available.</p>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          ref={experienceRef}
          id="experience"
          className="mb-12 md:mb-16 scroll-mt-24"
          variants={fadeInVariants}
        >
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          {profile.experience && profile.experience.length > 0 ? (
            <IOSTimeline items={experienceTimelineItems} animated />
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
        <motion.section
          ref={educationRef}
          id="education"
          className="mb-12 md:mb-16 scroll-mt-24"
          variants={fadeInVariants}
        >
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          {profile.education && profile.education.length > 0 ? (
            <IOSTimeline items={educationTimelineItems} animated />
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
        <motion.section ref={skillsRef} id="skills" className="mb-12 md:mb-16 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-6" variants={itemVariants}>
            Skills
          </motion.h2>

          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
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
          <p className="text-lg text-gray-300 mt-2 mb-4 font-light" style={{ fontFamily: "'Pacifico', cursive" }}>
            Portfolio by Looqmy
          </p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {profile.name || profile.username}
          </p>
        </div>
      </motion.footer>

      {/* Custom CSS for scrollbar hiding */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Ensure proper spacing on mobile */
        @media (max-width: 640px) {
          .scroll-mt-24 {
            scroll-margin-top: 8rem;
          }
        }

        /* Improve tap targets on mobile */
        @media (max-width: 640px) {
          button,
          a {
            min-height: 44px;
          }
        }
      `}</style>
    </motion.div>
  )
}
