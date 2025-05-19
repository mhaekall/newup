"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Share2,
  Award,
  Eye,
} from "lucide-react"
import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"
import { Logo } from "@/components/ui/logo"
import { ProfileBanner } from "@/components/ui/profile-banner"
import { IOSBlurBackground } from "@/components/ui/ios-blur-background"
import { IOSCard } from "@/components/ui/ios-card"
import { IOSButton } from "@/components/ui/ios-button"
import { IOSAvatar } from "@/components/ui/ios-avatar"
import { IOSBadge } from "@/components/ui/ios-badge"
import { IOSDivider } from "@/components/ui/ios-divider"
import { IOSTimeline } from "@/components/ui/ios-timeline"
import { generateVisitorId } from "@/lib/visitor-id"
import { recordProfileView, getProfileViewCount } from "@/lib/supabase"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
  // State
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [visitorId, setVisitorId] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  // Refs
  const headerRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll animations
  const { scrollY } = useScroll()
  const headerHeight = useTransform(scrollY, [0, 100], [60, 50])
  const headerPadding = useTransform(scrollY, [0, 100], [16, 8])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0.8, 1])
  const bannerScale = useTransform(scrollY, [0, 300], [1, 1.1])
  const bannerOpacity = useTransform(scrollY, [0, 300], [1, 0.6])
  const avatarScale = useTransform(scrollY, [0, 100], [1, 0.8])
  const avatarY = useTransform(scrollY, [0, 100], [0, -10])
  const nameOpacity = useTransform(scrollY, [0, 50], [1, 0])
  const headerNameOpacity = useTransform(scrollY, [50, 100], [0, 1])

  // Spring animations for smoother transitions
  const springHeaderHeight = useSpring(headerHeight, { stiffness: 100, damping: 30 })
  const springHeaderPadding = useSpring(headerPadding, { stiffness: 100, damping: 30 })
  const springHeaderBgOpacity = useSpring(headerBgOpacity, { stiffness: 100, damping: 30 })
  const springBannerScale = useSpring(bannerScale, { stiffness: 100, damping: 30 })
  const springBannerOpacity = useSpring(bannerOpacity, { stiffness: 100, damping: 30 })
  const springAvatarScale = useSpring(avatarScale, { stiffness: 100, damping: 30 })
  const springAvatarY = useSpring(avatarY, { stiffness: 100, damping: 30 })
  const springNameOpacity = useSpring(nameOpacity, { stiffness: 100, damping: 30 })
  const springHeaderNameOpacity = useSpring(headerNameOpacity, { stiffness: 100, damping: 30 })

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // Handle scroll
  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      // Update isScrolled state
      setIsScrolled(window.scrollY > 50)

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

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
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

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)

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
      const yOffset = -70 // Header height offset
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

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
    { id: "about", label: "About", icon: <User size={16} /> },
    { id: "contact", label: "Contact", icon: <Mail size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
    { id: "skills", label: "Skills", icon: <Award size={16} /> },
    { id: "projects", label: "Projects", icon: <Code size={16} /> },
  ]

  // Tab items for iOS-style tab bar
  const tabItems = steps.map((step) => ({
    id: step.id,
    label: step.label,
    icon: step.icon,
  }))

  // Experience timeline items
  const experienceTimelineItems =
    profile.experience?.map((exp) => ({
      id: exp.company + exp.startDate,
      title: exp.position,
      subtitle: exp.company,
      date: formatDateRange(exp.startDate || "", exp.endDate || ""),
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
      icon: <Briefcase size={16} />,
      color: "blue",
    })) || []

  // Education timeline items
  const educationTimelineItems =
    profile.education?.map((edu) => ({
      id: edu.institution + edu.startDate,
      title: edu.institution,
      subtitle: `${edu.degree} ${edu.field ? `in ${edu.field}` : ""}`,
      date: formatDateRange(edu.startDate || "", edu.endDate || ""),
      content: edu.description && <p>{edu.description}</p>,
      icon: <GraduationCap size={16} />,
      color: "green",
    })) || []

  return (
    <motion.div
      className="min-h-screen bg-gray-50 text-gray-900 w-full overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* iOS-style top bar */}
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full"
        style={{
          height: springHeaderHeight,
        }}
      >
        <IOSBlurBackground
          intensity={15}
          className="absolute inset-0 border-b border-gray-200"
          color="rgba(255, 255, 255, 0.95)"
        />

        <div className="relative z-10 w-full h-full px-4">
          <div className="flex items-center justify-between h-full max-w-screen-xl mx-auto">
            {/* Logo/Name */}
            <div className="flex items-center">
              <motion.div className="flex items-center" style={{ opacity: springHeaderNameOpacity }}>
                <IOSAvatar
                  src={profile.profile_image || undefined}
                  alt={profile.name || ""}
                  size="sm"
                  className="mr-2"
                />
                <span className="font-semibold text-base truncate max-w-[120px]">
                  {profile.name || profile.username}
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {steps.map((step) => (
                <IOSButton
                  key={step.id}
                  variant="text"
                  size="sm"
                  onClick={() => handleTabChange(step.id)}
                  className={activeSection === step.id ? "text-blue-600" : "text-gray-600"}
                  icon={step.icon}
                >
                  {step.label}
                </IOSButton>
              ))}

              <IOSDivider orientation="vertical" className="h-6 mx-2" />

              {/* Share button */}
              <IOSButton
                variant="text"
                size="sm"
                icon={<Share2 size={16} />}
                onClick={handleShare}
                className="text-gray-600"
              >
                Share
              </IOSButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <IOSButton
                variant="text"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 p-1"
                icon={menuOpen ? <X size={20} /> : <Menu size={20} />}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-16 px-4 pb-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    className={`flex items-center w-full py-4 border-b border-gray-100 ${
                      activeSection === step.id ? "text-blue-600" : "text-gray-700"
                    }`}
                    onClick={() => {
                      setMenuOpen(false)
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
                  </motion.button>
                ))}

                <IOSDivider label="Actions" labelPosition="center" className="my-6" />

                <div className="space-y-4 py-2">
                  <button
                    className="flex items-center w-full py-4 border-b border-gray-100 text-gray-700"
                    onClick={() => {
                      setMenuOpen(false)
                      handleShare()
                    }}
                  >
                    <Share2 size={18} className="mr-3 text-gray-600" />
                    <span className="text-lg font-medium">Share Profile</span>
                  </button>
                </div>
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

      {/* Banner and Profile Image */}
      <div className="w-full relative pt-14">
        {/* Banner */}
        <motion.div
          className="w-full h-40 sm:h-48 md:h-64 overflow-hidden"
          style={{
            scale: springBannerScale,
            opacity: springBannerOpacity,
          }}
        >
          {profile.banner_image ? (
            <ProfileBanner bannerUrl={profile.banner_image} height={320} className="w-full" />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{
                backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
              }}
            />
          )}
        </motion.div>

        {/* Profile Info - Positioned below banner */}
        <div className="w-full px-4 relative">
          <div className="flex flex-col items-center -mt-16 md:-mt-20">
            {/* Profile Image */}
            <motion.div
              className="relative z-10"
              style={{
                scale: springAvatarScale,
                y: springAvatarY,
              }}
            >
              <IOSAvatar
                src={profile.profile_image || undefined}
                alt={profile.name || ""}
                size="2xl"
                border
                borderColor="white"
                className="shadow-lg"
              />
            </motion.div>

            {/* Name and Username */}
            <motion.div className="text-center mt-4" style={{ opacity: springNameOpacity }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-blue-500 font-medium mt-1">@{profile.username}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 py-3 mt-4">
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <IOSButton
              variant="text"
              size="sm"
              icon={<Share2 size={16} />}
              onClick={handleShare}
              className="text-gray-600"
            >
              Share
            </IOSButton>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Eye size={16} className="mr-1" />
            <span>{viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="sticky top-[50px] z-30 bg-white border-b border-gray-200 w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex w-full min-w-max">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[80px] py-3 px-2 text-xs font-medium flex flex-col items-center justify-center ${
                  activeSection === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 border-b-2 border-transparent"
                }`}
              >
                <span className="mb-1">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={mainRef} className="w-full px-4 py-6">
        {/* About Section */}
        <motion.section ref={aboutRef} id="about" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            About Me
          </motion.h2>

          <IOSCard className="p-4 sm:p-6">
            <motion.div className="prose max-w-none" variants={itemVariants}>
              <p className="text-gray-700 text-base leading-relaxed">
                {profile.bio || "No bio information available."}
              </p>

              {profile.bio && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Passionate", "Creative", "Detail-oriented", "Team player", "Problem solver"].map((tag) => (
                    <IOSBadge key={tag} color="primary" variant="subtle" size="sm">
                      {tag}
                    </IOSBadge>
                  ))}
                </div>
              )}
            </motion.div>
          </IOSCard>
        </motion.section>

        {/* Contact & Connect Section */}
        <motion.section ref={contactRef} id="contact" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Contact & Connect
          </motion.h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Contact Info */}
            <IOSCard className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Get in Touch</h3>

              <div className="grid grid-cols-1 gap-3">
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
                    const icon = platform === "Email" ? <Mail size={18} /> : <Phone size={18} />

                    return (
                      <motion.a
                        key={index}
                        href={link.url}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          {icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{platform}</p>
                          <p className="text-xs text-gray-600">
                            {link.url?.replace("mailto:", "").replace("tel:", "")}
                          </p>
                        </div>
                      </motion.a>
                    )
                  })}
              </div>

              {/* Social Links */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Connect</h3>

              <div className="grid grid-cols-1 gap-3">
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
            </IOSCard>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section ref={experienceRef} id="experience" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Experience
          </motion.h2>

          <IOSCard className="p-4 sm:p-6">
            {profile.experience && profile.experience.length > 0 ? (
              <IOSTimeline items={experienceTimelineItems} animated />
            ) : (
              <div className="text-center py-6">
                <Briefcase size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No experience entries yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Education Section */}
        <motion.section ref={educationRef} id="education" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Education
          </motion.h2>

          <IOSCard className="p-4 sm:p-6">
            {profile.education && profile.education.length > 0 ? (
              <IOSTimeline items={educationTimelineItems} animated />
            ) : (
              <div className="text-center py-6">
                <GraduationCap size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No education entries yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Skills Section */}
        <motion.section ref={skillsRef} id="skills" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Skills
          </motion.h2>

          <IOSCard className="p-4 sm:p-6">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="space-y-6">
                {/* Group skills by category */}
                {Array.from(new Set(profile.skills.map((skill) => skill.category || "Other"))).map((category) => (
                  <motion.div key={category} className="space-y-3" variants={itemVariants}>
                    <h3 className="text-base font-semibold text-gray-900 flex items-center">
                      <Award size={16} className="mr-2 text-blue-500" />
                      {category}
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {profile.skills
                        .filter((skill) => (skill.category || "Other") === category)
                        .map((skill, index) => {
                          // Convert string level to number if needed
                          let skillLevel = typeof skill.level === "number" ? skill.level : 0

                          // If level is a string, convert it
                          if (typeof skill.level === "string") {
                            skillLevel =
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

                          return (
                            <motion.div
                              key={index}
                              className="space-y-1"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">{skill.name}</span>
                                <IOSBadge
                                  color={
                                    skillLevel <= 20
                                      ? "secondary"
                                      : skillLevel <= 40
                                        ? "info"
                                        : skillLevel <= 60
                                          ? "primary"
                                          : skillLevel <= 80
                                            ? "success"
                                            : "warning"
                                  }
                                  variant="subtle"
                                  size="sm"
                                >
                                  {typeof skill.level === "string" ? skill.level : `${skillLevel}%`}
                                </IOSBadge>
                              </div>
                            </motion.div>
                          )
                        })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No skills added yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Projects Section */}
        <motion.section ref={projectsRef} id="projects" className="mb-10 scroll-mt-32" variants={fadeInVariants}>
          <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            Projects
          </motion.h2>

          {profile.projects && profile.projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {profile.projects.map((project, index) => (
                <IOSCard key={index} className="overflow-hidden" hoverEffect pressEffect={false}>
                  {project.image && (
                    <div className="w-full aspect-video overflow-hidden">
                      <motion.img
                        src={project.image || "/placeholder.svg?height=200&width=400"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      {project.url && (
                        <IOSButton
                          variant="text"
                          size="sm"
                          icon={<ExternalLink size={16} />}
                          onClick={() => window.open(project.url, "_blank")}
                          className="text-blue-500"
                        />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <IOSBadge key={techIndex} color="primary" variant="subtle" size="sm">
                            {tech}
                          </IOSBadge>
                        ))}
                      </div>
                    )}
                  </div>
                </IOSCard>
              ))}
            </div>
          ) : (
            <IOSCard className="p-4 sm:p-6 text-center">
              <Code size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No projects added yet.</p>
            </IOSCard>
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
        <div className="w-full px-4 flex flex-col items-center justify-center text-center">
          <Logo animate={false} className="text-3xl text-white mb-3" style={{ fontFamily: "'Pacifico', cursive" }} />
          <p className="text-lg text-gray-300 font-light mb-6" style={{ fontFamily: "'Pacifico', cursive" }}>
            Portfolio by Looqmy
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {steps.map((step) => (
              <IOSButton
                key={step.id}
                variant="text"
                size="sm"
                onClick={() => handleTabChange(step.id)}
                className="text-gray-300 hover:text-white"
              >
                {step.label}
              </IOSButton>
            ))}
          </div>

          <IOSDivider color="gray-700" className="w-full max-w-md mb-6" />

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {profile.name || profile.username} • Portfolio by Looqmy
          </p>
        </div>
      </motion.footer>

      {/* Add custom styles for scrollbar hiding */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  )
}
