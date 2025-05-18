"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import {
  Star,
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
  Heart,
  Share2,
  Download,
  Search,
  Bell,
  Sun,
  Moon,
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
import { IOSProgress } from "@/components/ui/ios-progress"
import { IOSSwitch } from "@/components/ui/ios-switch"
import { IOSTabBar } from "@/components/ui/ios-tab-bar"
import { IOSTooltip } from "@/components/ui/ios-tooltip"
import { IOSTimeline } from "@/components/ui/ios-timeline"

interface TemplateProps {
  profile: Profile
}

export default function Template3({ profile }: TemplateProps) {
  // State
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(3)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 10)
  const [isLiked, setIsLiked] = useState(false)
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 1000) + 100)
  const [showTooltip, setShowTooltip] = useState(false)

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
  const headerHeight = useTransform(scrollY, [0, 100], [80, 60])
  const headerPadding = useTransform(scrollY, [0, 100], [20, 10])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1])
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

    // Simulate view count increase
    const viewTimer = setInterval(() => {
      setViewCount((prev) => prev + 1)
    }, 60000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(viewTimer)
    }
  }, [])

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

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
      const yOffset = -80 // Header height offset
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Handle like toggle
  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  // Handle share
  const handleShare = () => {
    setShowShareOptions((prev) => !prev)
    setShowDownloadOptions(false)
  }

  // Handle download
  const handleDownload = () => {
    setShowDownloadOptions((prev) => !prev)
    setShowShareOptions(false)
  }

  // Handle search toggle
  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  // Handle notification clear
  const handleClearNotifications = () => {
    setNotifications(0)
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
      icon: <Briefcase size={16} />,
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
      icon: <GraduationCap size={16} />,
      color: "green",
    })) || []

  return (
    <motion.div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* iOS-style top bar */}
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: springHeaderHeight,
          padding: springHeaderPadding,
        }}
      >
        <IOSBlurBackground
          intensity={10}
          className="absolute inset-0 border-b border-gray-200 dark:border-gray-800"
          color={darkMode ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)"}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo/Name */}
            <div className="flex items-center">
              <motion.div className="flex items-center" style={{ opacity: springHeaderNameOpacity }}>
                <IOSAvatar
                  src={profile.profile_image || undefined}
                  alt={profile.name || ""}
                  size="sm"
                  className="mr-2"
                />
                <span className="font-semibold text-lg">{profile.name || profile.username}</span>
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
                  className={activeSection === step.id ? "text-blue-600" : "text-gray-600 dark:text-gray-300"}
                  icon={step.icon}
                >
                  {step.label}
                </IOSButton>
              ))}

              <IOSDivider orientation="vertical" className="h-6 mx-2" />

              {/* Action buttons */}
              <IOSTooltip content="Search" position="bottom">
                <IOSButton
                  variant="text"
                  size="sm"
                  icon={<Search size={18} />}
                  onClick={handleSearchToggle}
                  className="text-gray-600 dark:text-gray-300"
                />
              </IOSTooltip>

              <IOSTooltip content="Notifications" position="bottom">
                <div className="relative">
                  <IOSButton
                    variant="text"
                    size="sm"
                    icon={<Bell size={18} />}
                    onClick={handleClearNotifications}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  {notifications > 0 && (
                    <IOSBadge color="danger" size="sm" rounded className="absolute -top-1 -right-1" animated>
                      {notifications}
                    </IOSBadge>
                  )}
                </div>
              </IOSTooltip>

              <IOSTooltip content={darkMode ? "Light Mode" : "Dark Mode"} position="bottom">
                <IOSButton
                  variant="text"
                  size="sm"
                  icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-600 dark:text-gray-300"
                />
              </IOSTooltip>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <IOSButton
                variant="text"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 dark:text-gray-300"
                icon={menuOpen ? <X size={20} /> : <Menu size={20} />}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-20 px-4 pb-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {steps.map((step, index) => (
                  <motion.a
                    key={step.id}
                    href={`#${step.id}`}
                    className={`flex items-center py-4 border-b border-gray-100 dark:border-gray-800 ${
                      activeSection === step.id ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
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
                  </motion.a>
                ))}

                <IOSDivider label="Settings" labelPosition="center" className="my-6" />

                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center">
                      <Bell size={18} className="mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                    </div>
                    <IOSSwitch checked={notifications > 0} onChange={(checked) => setNotifications(checked ? 3 : 0)} />
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center">
                      <Moon size={18} className="mr-3 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    </div>
                    <IOSSwitch checked={darkMode} onChange={setDarkMode} />
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center mt-auto">
                <Logo animate={false} className="text-3xl inline-block text-blue-500" />
                <p
                  className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-light"
                  style={{ fontFamily: "'Pacifico', cursive" }}
                >
                  Portfolio by Looqmy
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-3xl mx-auto px-4 py-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={handleSearchToggle}
                >
                  <X size={18} />
                </button>
              </div>

              {searchQuery && (
                <div className="mt-6">
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {steps.map((step) => (
                      <IOSButton
                        key={step.id}
                        variant="outline"
                        onClick={() => {
                          handleTabChange(step.id)
                          setShowSearch(false)
                        }}
                        icon={step.icon}
                        fullWidth
                      >
                        {step.label}
                      </IOSButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner and Profile Image */}
      <div className="w-full relative pt-16">
        {/* Banner */}
        <motion.div
          className="w-full h-64 md:h-80 overflow-hidden"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <p className="text-blue-500 dark:text-blue-400 font-medium mt-1">@{profile.username}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <IOSButton
                  variant="text"
                  size="sm"
                  icon={isLiked ? <Heart className="fill-red-500 text-red-500" size={18} /> : <Heart size={18} />}
                  onClick={handleLikeToggle}
                  className={isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-300"}
                >
                  {likeCount}
                </IOSButton>
              </div>

              <div className="flex items-center">
                <IOSTooltip content="Share Profile" position="bottom">
                  <IOSButton
                    variant="text"
                    size="sm"
                    icon={<Share2 size={18} />}
                    onClick={handleShare}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    Share
                  </IOSButton>
                </IOSTooltip>
              </div>

              <div className="hidden sm:flex items-center">
                <IOSTooltip content="Download Resume" position="bottom">
                  <IOSButton
                    variant="text"
                    size="sm"
                    icon={<Download size={18} />}
                    onClick={handleDownload}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    Download
                  </IOSButton>
                </IOSTooltip>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Eye size={16} className="mr-1" />
              <span>{viewCount} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Profile</h3>
                <IOSButton
                  variant="text"
                  size="sm"
                  icon={<X size={18} />}
                  onClick={() => setShowShareOptions(false)}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {["Twitter", "Facebook", "LinkedIn", "Email", "WhatsApp", "Telegram", "Copy Link", "More"].map(
                  (platform) => (
                    <div key={platform} className="flex flex-col items-center">
                      <IOSButton
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full mb-2"
                        icon={<SocialMediaIcon platform={platform} />}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-300">{platform}</span>
                    </div>
                  ),
                )}
              </div>

              <IOSButton variant="filled" color="primary" fullWidth onClick={() => setShowShareOptions(false)}>
                Done
              </IOSButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Options */}
      <AnimatePresence>
        {showDownloadOptions && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download Options</h3>
                <IOSButton
                  variant="text"
                  size="sm"
                  icon={<X size={18} />}
                  onClick={() => setShowDownloadOptions(false)}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>

              <div className="space-y-3 mb-6">
                <IOSButton variant="outline" fullWidth className="justify-between" icon={<Download size={18} />}>
                  <span className="flex-1 text-left">Download as PDF</span>
                  <IOSBadge color="primary" variant="subtle" size="sm">
                    Recommended
                  </IOSBadge>
                </IOSButton>

                <IOSButton variant="outline" fullWidth className="justify-start" icon={<Download size={18} />}>
                  Download as Word Document
                </IOSButton>

                <IOSButton variant="outline" fullWidth className="justify-start" icon={<Download size={18} />}>
                  Download as Plain Text
                </IOSButton>
              </div>

              <IOSButton variant="filled" color="primary" fullWidth onClick={() => setShowDownloadOptions(false)}>
                Done
              </IOSButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tab Bar */}
      <div className="md:hidden sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <IOSTabBar tabs={tabItems} activeTab={activeSection} onChange={handleTabChange} variant="filled" fullWidth />
      </div>

      {/* Main Content */}
      <div ref={mainRef} className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        {/* About Section */}
        <motion.section ref={aboutRef} id="about" className="mb-12 md:mb-24 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            About Me
          </motion.h2>

          <IOSCard className="p-6 md:p-8">
            <motion.div className="prose dark:prose-invert max-w-none" variants={itemVariants}>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {profile.bio || "No bio information available."}
              </p>

              {profile.bio && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {["Passionate", "Creative", "Detail-oriented", "Team player", "Problem solver"].map((tag) => (
                    <IOSBadge key={tag} color="primary" variant="subtle" size="md">
                      {tag}
                    </IOSBadge>
                  ))}
                </div>
              )}
            </motion.div>
          </IOSCard>
        </motion.section>

        {/* Contact & Connect Section */}
        <motion.section ref={contactRef} id="contact" className="mb-12 md:mb-24 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Contact & Connect
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info */}
            <IOSCard className="md:col-span-2 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h3>

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
                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                          {icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{platform}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {link.url?.replace("mailto:", "").replace("tel:", "")}
                          </p>
                        </div>
                      </motion.a>
                    )
                  })}
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
                <IOSButton variant="filled" color="primary" fullWidth>
                  Send Message
                </IOSButton>
              </div>
            </IOSCard>

            {/* Social Links */}
            <IOSCard className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>

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
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <SocialMediaIcon platform={link.icon || platform} className="mr-3" />
                        <span className="font-medium text-gray-900 dark:text-white">{platform}</span>
                        <ExternalLink size={14} className="ml-auto text-gray-400" />
                      </motion.a>
                    )
                  })}
              </div>

              {(!profile.links || profile.links.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400">No social links available.</p>
              )}
            </IOSCard>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          ref={experienceRef}
          id="experience"
          className="mb-12 md:mb-24 scroll-mt-24"
          variants={fadeInVariants}
        >
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          <IOSCard className="p-6 md:p-8">
            {profile.experience && profile.experience.length > 0 ? (
              <IOSTimeline items={experienceTimelineItems} animated />
            ) : (
              <div className="text-center py-8">
                <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No experience entries yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Education Section */}
        <motion.section
          ref={educationRef}
          id="education"
          className="mb-12 md:mb-24 scroll-mt-24"
          variants={fadeInVariants}
        >
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          <IOSCard className="p-6 md:p-8">
            {profile.education && profile.education.length > 0 ? (
              <IOSTimeline items={educationTimelineItems} animated />
            ) : (
              <div className="text-center py-8">
                <GraduationCap size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No education entries yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Skills Section */}
        <motion.section ref={skillsRef} id="skills" className="mb-12 md:mb-24 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Skills
          </motion.h2>

          <IOSCard className="p-6 md:p-8">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="space-y-8">
                {/* Group skills by category */}
                {Array.from(new Set(profile.skills.map((skill) => skill.category))).map((category) => (
                  <motion.div key={category} className="space-y-4" variants={itemVariants}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Award size={18} className="mr-2 text-blue-500" />
                      {category}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.skills
                        .filter((skill) => skill.category === category)
                        .map((skill, index) => {
                          const skillLevel =
                            skill.level === "Beginner"
                              ? 20
                              : skill.level === "Elementary"
                                ? 40
                                : skill.level === "Intermediate"
                                  ? 60
                                  : skill.level === "Advanced"
                                    ? 80
                                    : 100

                          return (
                            <motion.div
                              key={index}
                              className="space-y-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
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
                                  {skill.level}
                                </IOSBadge>
                              </div>
                              <IOSProgress
                                value={skillLevel}
                                max={100}
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
                                size="md"
                                animated
                              />
                            </motion.div>
                          )
                        })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
              </div>
            )}
          </IOSCard>
        </motion.section>

        {/* Projects Section */}
        <motion.section ref={projectsRef} id="projects" className="mb-12 scroll-mt-24" variants={fadeInVariants}>
          <motion.h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Projects
          </motion.h2>

          {profile.projects && profile.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project, index) => (
                <IOSCard key={index} className="overflow-hidden" hoverEffect pressEffect={false}>
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
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
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
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
            <IOSCard className="p-6 md:p-8 text-center">
              <Code size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
            </IOSCard>
          )}
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Logo animate={false} className="text-4xl text-white mb-4" style={{ fontFamily: "'Pacifico', cursive" }} />
          <p className="text-xl text-gray-300 font-light mb-8" style={{ fontFamily: "'Pacifico', cursive" }}>
            Portfolio by Looqmy
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
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

          <IOSDivider color="gray-700" className="w-full max-w-md mb-8" />

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {["Twitter", "Facebook", "LinkedIn", "GitHub", "Instagram"].map((platform) => (
              <IOSButton
                key={platform}
                variant="text"
                size="sm"
                className="text-gray-300 hover:text-white"
                icon={<SocialMediaIcon platform={platform} />}
              />
            ))}
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {profile.name || profile.username} • Portfolio by Looqmy
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
