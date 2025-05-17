"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { SocialInteractions } from "@/components/ui/social-interactions"
import { clientAnalytics } from "@/lib/analytics-service"
import { User, Mail, MapPin, Calendar, Briefcase, ExternalLink, Menu, X, ChevronRight, Download } from "lucide-react"

// Define the props interface
interface TemplateProps {
  profile: any
  projects: any[]
  skills: any[]
  experiences: any[]
  education: any[]
  links: any[]
}

export default function Template1({ profile, projects, skills, experiences, education, links }: TemplateProps) {
  const [activeSection, setActiveSection] = useState("about")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Record view on mount
  useEffect(() => {
    if (profile?.id) {
      const hasViewed = sessionStorage.getItem(`viewed-${profile.id}`)
      if (!hasViewed) {
        clientAnalytics.recordView(profile.id)
        sessionStorage.setItem(`viewed-${profile.id}`, "true")
      }
    }
  }, [profile?.id])

  // Set up intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActiveSection(id)
          }
        })
      },
      { threshold: 0.3 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)

    const section = sectionRefs.current[sectionId]
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      {/* Classic Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{profile?.name || "Portfolio"}</h1>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection("about")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "about"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("experience")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "experience"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection("education")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "education"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection("skills")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "skills"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "projects"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "contact"
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Contact
              </button>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-2 flex flex-col">
                <button
                  onClick={() => scrollToSection("about")}
                  className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-100 flex justify-between items-center ${
                    activeSection === "about" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>About</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("experience")}
                  className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-100 flex justify-between items-center ${
                    activeSection === "experience" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>Experience</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("education")}
                  className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-100 flex justify-between items-center ${
                    activeSection === "education" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>Education</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("skills")}
                  className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-100 flex justify-between items-center ${
                    activeSection === "skills" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>Skills</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("projects")}
                  className={`px-4 py-3 text-left text-sm font-medium border-b border-gray-100 flex justify-between items-center ${
                    activeSection === "projects" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>Projects</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-4 py-3 text-left text-sm font-medium flex justify-between items-center ${
                    activeSection === "contact" ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  <span>Contact</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
              <motion.div
                variants={itemVariants}
                className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                {profile?.image ? (
                  <Image
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name || "Profile"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <User className="h-24 w-24 text-blue-300" />
                  </div>
                )}
              </motion.div>
            </div>

            <div className="md:w-2/3 p-8">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile?.name || "Your Name"}</h1>
                <h2 className="text-xl text-blue-600 mb-4">{profile?.title || "Your Title"}</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                  {profile?.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile?.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${profile.email}`} className="hover:text-blue-600">
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="prose prose-blue max-w-none mb-6">
                  <p>{profile?.bio || "Your professional bio goes here."}</p>
                </div>

                {profile?.cv && (
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </a>
                )}
              </motion.div>
            </div>
          </div>

          {/* Social Interactions */}
          {profile?.id && (
            <div className="border-t border-gray-100 px-8 py-4">
              <SocialInteractions profileId={profile.id} variant="classic" />
            </div>
          )}
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          ref={(el) => (sectionRefs.current.about = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">About Me</h2>
            <div className="prose prose-blue max-w-none">
              <p>{profile?.bio || "Your detailed bio goes here."}</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          ref={(el) => (sectionRefs.current.experience = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Professional Experience
            </h2>

            <div className="space-y-8">
              {experiences && experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 pb-8 border-l-2 border-blue-100">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                    <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                    <h4 className="text-lg text-blue-600 mb-2">{exp.company}</h4>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                      {exp.location && (
                        <>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="prose prose-blue max-w-none">
                      <p>{exp.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No experience listed yet.</p>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          id="education"
          ref={(el) => (sectionRefs.current.education = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Education</h2>

            <div className="space-y-8">
              {education && education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className="relative pl-8 pb-8 border-l-2 border-green-100">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                    <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                    <h4 className="text-lg text-green-600 mb-2">{edu.institution}</h4>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </span>
                    </div>
                    <div className="prose prose-green max-w-none">
                      <p>{edu.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No education listed yet.</p>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          ref={(el) => (sectionRefs.current.skills = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{skill.name}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                    <div className="mt-2 text-right text-sm text-gray-600">{skill.level}%</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-2">No skills listed yet.</p>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          ref={(el) => (sectionRefs.current.projects = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="aspect-[16/9] relative bg-gray-100">
                      {project.image ? (
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Project <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-3">No projects listed yet.</p>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          ref={(el) => (sectionRefs.current.contact = el)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Contact Me</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-6">
                  Feel free to reach out if you have any questions or would like to work together.
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Email</h4>
                        <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Location</h4>
                        <p className="text-gray-600">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect</h3>
                  <div className="flex space-x-4">
                    {links &&
                      links.length > 0 &&
                      links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 hover:bg-blue-100 p-3 rounded-full transition-colors"
                          aria-label={link.name}
                        >
                          {/* Simplified icon rendering */}
                          {link.icon}
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}
