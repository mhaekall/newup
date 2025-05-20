"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { HorizontalProgressBar } from "@/components/ui/progress-timeline"
import { ProfileBanner } from "@/components/ui/profile-banner"
import { User, Briefcase, GraduationCap, Star, Code, Eye, Share2, X } from "lucide-react"
import { generateVisitorId } from "@/lib/visitor-id"
import { recordProfileView, getProfileViewCount } from "@/lib/supabase"

interface TemplateProps {
  profile: Profile
}

export default function Template1({ profile }: TemplateProps) {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [visitorId, setVisitorId] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setMounted(true)

    // Add scroll event listener to update active section
    const handleScroll = () => {
      const sections = ["about", "skills", "experience", "education", "projects"]

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

  // Initialize visitor ID and record view
  useEffect(() => {
    if (!mounted) return

    // Generate visitor ID
    const vid = generateVisitorId()
    setVisitorId(vid)

    // Set share URL
    setShareUrl(window.location.href)

    // Record profile view if we have a profile ID
    if (profile.id) {
      recordProfileView(profile.id, vid)

      // Get view count
      const fetchViewCount = async () => {
        const count = await getProfileViewCount(profile.id!)
        setViewCount(count)
      }

      fetchViewCount()
    }
  }, [mounted, profile.id])

  if (!mounted) {
    return null
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

  // Step navigation items
  const steps = [
    { id: "about", label: "About", icon: <User size={18} /> },
    { id: "skills", label: "Skills", icon: <Star size={18} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
  ]

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile.name || profile.username}'s Portfolio`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing:", error)
          setShowShareOptions(true)
        })
    } else {
      setShowShareOptions(true)
    }
  }

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
          <span className="text-xl font-bold text-blue-600">{profile.name || profile.username}</span>
        </div>

        {/* Share and View Count */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleShare}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Share profile"
          >
            <Share2 size={20} />
            <span className="ml-1 text-sm hidden sm:inline">Share</span>
          </button>
          <div className="flex items-center text-gray-600">
            <Eye size={20} />
            <span className="ml-1 text-sm">{viewCount}</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {steps.map((step) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className={`text-sm font-medium transition-colors ${
                activeSection === step.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {step.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* Banner */}
      <div className="w-full relative">
        {profile.banner_image ? (
          <ProfileBanner bannerUrl={profile.banner_image} height={300} className="w-full" />
        ) : (
          <motion.div
            className="w-full h-64 sm:h-72 md:h-80 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg -mt-32 relative z-10">
        <motion.div className="flex flex-col items-center mb-8" variants={containerVariants}>
          {profile.profile_image && (
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md"
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
        </motion.div>

        {/* About Section */}
        <motion.section id="about" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" variants={itemVariants}>
            About Me
          </motion.h2>
          {profile.bio && (
            <motion.p className="text-gray-600 mb-8" variants={itemVariants}>
              {profile.bio}
            </motion.p>
          )}

          {/* Contact Section (merged with Connect with me) */}
          <motion.div className="mt-6" variants={fadeInVariants}>
            <motion.h3 className="text-xl font-semibold text-gray-800 mb-4" variants={itemVariants}>
              Contact & Connect
            </motion.h3>

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
                  const platform = link.label || getPlatformName(link.url)
                  const displayText = getDisplayText(link.url, platform)

                  return (
                    <motion.a
                      key={index}
                      href={link.url}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                    >
                      <SocialMediaIcon platform={link.icon || platform} />
                      <span className="ml-3">{displayText}</span>
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
                        <SocialMediaIcon platform={link.icon || platform} />
                        <span>{displayText}</span>
                      </motion.a>
                    )
                  })}
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Skills Section with Progress Bars */}
        {profile.skills && profile.skills.length > 0 && (
          <motion.section id="skills" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" variants={itemVariants}>
              Skills
            </motion.h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.skills.map((skill, index) => (
                <HorizontalProgressBar
                  key={index}
                  label={skill.name}
                  percentage={
                    skill.level === "Beginner"
                      ? 20
                      : skill.level === "Elementary"
                        ? 40
                        : skill.level === "Intermediate"
                          ? 60
                          : skill.level === "Advanced"
                            ? 80
                            : 100
                  }
                  variant="primary"
                  height={6}
                />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Experience Section - Removed dots */}
        {profile.experience && profile.experience.length > 0 && (
          <motion.section id="experience" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" variants={itemVariants}>
              Experience
            </motion.h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
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
          </motion.section>
        )}

        {/* Education Section - Removed dots */}
        {profile.education && profile.education.length > 0 && (
          <motion.section id="education" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" variants={itemVariants}>
              Education
            </motion.h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
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
          </motion.section>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <motion.section id="projects" className="scroll-mt-24" variants={fadeInVariants}>
            <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" variants={itemVariants}>
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
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg?height=200&width=400"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
          </motion.section>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Share Profile</h3>
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { name: "Twitter", icon: "Twitter" },
                    { name: "Facebook", icon: "Facebook" },
                    { name: "WhatsApp", icon: "WhatsApp" },
                    { name: "LinkedIn", icon: "LinkedIn" },
                    { name: "Telegram", icon: "Telegram" },
                    { name: "Email", icon: "Email" },
                    { name: "Copy Link", icon: "Link" },
                    { name: "More", icon: "More" },
                  ].map((platform) => (
                    <div key={platform.name} className="flex flex-col items-center">
                      <button
                        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 hover:bg-gray-200"
                        onClick={() => {
                          if (platform.name === "Copy Link") {
                            navigator.clipboard.writeText(shareUrl)
                            // Show toast or feedback
                          } else if (platform.name === "Email") {
                            window.location.href = `mailto:?subject=${encodeURIComponent(
                              `${profile.name || profile.username}'s Portfolio`,
                            )}&body=${encodeURIComponent(`Check out this portfolio: ${shareUrl}`)}`
                          }
                          // Handle other platforms
                        }}
                      >
                        <SocialMediaIcon platform={platform.icon} />
                      </button>
                      <span className="text-xs text-gray-600">{platform.name}</span>
                    </div>
                  ))}
                </div>

                <div className="relative flex items-center mb-6">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    className="absolute right-2 text-blue-500 font-medium text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      // Show toast or feedback
                    }}
                  >
                    Copy
                  </button>
                </div>

                <button
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
                  onClick={() => setShowShareOptions(false)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with looqmy logo */}
      <motion.footer
        className="bg-gray-900 text-white py-8 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo animate={false} className="text-2xl text-white" />
            <span className="ml-2 font-medium">Portfolio</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} {profile.name} • All rights reserved
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
