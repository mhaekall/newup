"use client"

import type { Profile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons"
import { useEffect, useState } from "react"
import { Moon, Sun, Menu, X } from "lucide-react" // Menggunakan ikon dari lucide-react

interface TemplateProps {
  profile: Profile
}

export default function Template2({ profile }: TemplateProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Efek untuk memuat preferensi mode gelap dari local storage
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDark)
  }, [])

  // Efek untuk menerapkan kelas mode gelap ke elemen html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

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

  // Ide Menarik: Animasi latar belakang gradien bergerak untuk banner jika tidak ada gambar
  const gradientBackground = "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 50%, #10B981 100%)"

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Bilah Atas Gaya iOS yang Ditingkatkan */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 shadow-sm sticky top-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60"
        variants={fadeInVariants}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 className="text-xl font-semibold text-gray-900 dark:text-white" variants={itemVariants}>
            {profile.name}
          </motion.h1>
          {/* Navigasi Desktop */}
          <motion.nav className="hidden md:flex items-center space-x-1" variants={containerVariants}>
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMobileMenuOpen(false)} // Tutup menu mobile jika terbuka
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
          <motion.div className="flex items-center space-x-3" variants={containerVariants}>
            {profile.links && profile.links.length > 0 && (
              <div className="hidden sm:flex space-x-2">
                {profile.links.slice(0, 2).map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={link.label}
                  >
                    <SocialMediaIcon platform={link.label || ""} />
                  </motion.a>
                ))}
              </div>
            )}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            {/* Tombol Menu Mobile */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                variants={itemVariants}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </motion.div>
        </div>
        {/* Menu Navigasi Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 dark:bg-gray-800/95 shadow-lg absolute w-full"
            >
              <nav className="flex flex-col px-4 py-2 space-y-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={`mobile-${link.label}`}
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variants={itemVariants}
                  >
                    {link.label}
                  </motion.a>
                ))}
                 {/* Tampilkan ikon sosial di menu mobile jika ada */}
                {profile.links && profile.links.length > 0 && (
                    <div className="flex space-x-3 pt-2 justify-center">
                        {profile.links.map((link, index) => (
                        <motion.a
                            key={`mobile-social-${index}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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

      {/* Banner */}
      <motion.div
        className="w-full h-64 sm:h-72 md:h-80 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : gradientBackground, // Menggunakan gradien jika tidak ada banner
        }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Ide Menarik: Efek Parallax Halus pada Banner (opsional, bisa memerlukan lebih banyak JS) */}
        {/* <motion.div className="absolute inset-0 bg-black opacity-10" style={{ y: yScroll }} /> */}
        {/* Ide Menarik: Pola geometris halus atau animasi partikel di atas banner */}
        <div className="absolute inset-0" style={{
          // contoh pola geometris sederhana (bisa diganti dengan SVG atau animasi yang lebih kompleks)
          // backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          // backgroundSize: '20px 20px'
        }}></div>
      </motion.div>

      {/* Bagian Hero */}
      <motion.div className="bg-white dark:bg-gray-800 transition-colors duration-300" variants={fadeInVariants}>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8">
            {/* Gambar Profil */}
            <motion.div
              className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg relative group" // Tambahkan group untuk hover
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            >
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
              {/* Ide Menarik: Indikator status online "dummy" atau emoji favorit */}
              <motion.div
                className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                title="Online (Visual)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              />
            </motion.div>

            {/* Info Profil */}
            <motion.div className="flex-1" variants={containerVariants}>
              <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white" variants={itemVariants}>
                {profile.name}
              </motion.h1>
              <motion.p className="text-blue-500 dark:text-blue-400 font-medium mt-1 text-lg" variants={itemVariants}>
                @{profile.username}
              </motion.p>
              <motion.p className="text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto md:mx-0" variants={itemVariants}>
                {profile.bio}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tidak lagi memerlukan segmented control karena sudah ada Nav Bar */}

        {/* Bagian Tentang */}
        <motion.section id="about" className="mb-12 scroll-mt-20" variants={fadeInVariants}> {/* scroll-mt untuk offset anchor nav */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.p className="text-gray-700 dark:text-gray-300 leading-relaxed" variants={itemVariants}>
              {profile.bio}
            </motion.p>

            {/* Tautan Sosial */}
            {profile.links && profile.links.length > 0 && (
              <motion.div className="mt-6" variants={containerVariants}>
                <motion.h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3" variants={itemVariants}>
                  Connect with me
                </motion.h3>
                <motion.div className="flex flex-wrap gap-3" variants={containerVariants}>
                  {profile.links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                      variants={itemVariants}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      title={link.label}
                    >
                      <span className="mr-2 text-blue-500 dark:text-blue-400">
                        <SocialMediaIcon platform={link.label || ""} />
                      </span>
                      <span>{link.label}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Bagian Pengalaman */}
        <motion.section id="experience" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Experience
          </motion.h2>

          {profile.experience && profile.experience.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{exp.position}</h3>
                      <p className="text-blue-500 dark:text-blue-400">{exp.company}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateRange(exp.startDate, exp.endDate)}</p>
                      {exp.location && <p className="text-sm text-gray-500 dark:text-gray-400">{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{exp.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
              variants={itemVariants}
            >
              No experience entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Pendidikan */}
        <motion.section id="education" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Education
          </motion.h2>

          {profile.education && profile.education.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {profile.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{edu.institution}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{edu.description}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
              variants={itemVariants}
            >
              No education entries yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Keahlian */}
        <motion.section id="skills" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Skills
          </motion.h2>

          {profile.skills && profile.skills.length > 0 ? (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              {Array.from(new Set(profile.skills.map((skill) => skill.category || "General"))).map((category) => (
                <motion.div key={category} className="mb-8 last:mb-0" variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {profile.skills
                      .filter((skill) => (skill.category || "General") === category)
                      .map((skill, index) => (
                        <motion.div key={index} className="flex flex-col" variants={itemVariants}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-200">{skill.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <motion.div
                              className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level * 20}%` }}
                              transition={{ delay: 0.3 + index * 0.05, duration: 0.8, type: "spring", stiffness:100 }}
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
              variants={itemVariants}
            >
              No skills added yet.
            </motion.div>
          )}
        </motion.section>

        {/* Bagian Proyek */}
        <motion.section id="projects" className="mb-12 scroll-mt-20" variants={fadeInVariants}>
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6" variants={itemVariants}>
            Projects
          </motion.h2>

          {profile.projects && profile.projects.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {profile.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
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
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{project.title}</h3>
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
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
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed flex-grow">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <motion.div className="mt-4 flex flex-wrap gap-2" variants={containerVariants}>
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="inline-block bg-blue-100 dark:bg-blue-900/50 rounded-full px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300"
                            variants={itemVariants}
                            whileHover={{ y: -2, scale:1.05 }}
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
              variants={itemVariants}
            >
              No projects added yet.
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Footer Gaya iOS */}
      <motion.footer
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }} // Kurangi delay sedikit
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
          {/* Ide Menarik: Tautan kembali ke atas yang halus */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-4 text-xs text-blue-500 dark:text-blue-400 hover:underline"
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
