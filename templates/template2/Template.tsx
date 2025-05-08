"use client"

import type { Profile } from "@/types"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons" // Pastikan komponen ini ada dan berfungsi
import { useEffect, useState, useRef } from "react"
import { Moon, Sun, Menu, X, ArrowUpCircle, Briefcase, BookOpen, Code, Star } from "lucide-react" // Menambahkan ikon relevan

interface TemplateProps {
  profile: Profile
}

// Hook Kustom untuk Deteksi Klik di Luar (Penting untuk menu mobile)
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

export default function Template2({ profile }: TemplateProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Inisialisasi mode gelap dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    // Default ke mode terang jika tidak ada preferensi atau sistem preferensi tidak gelap
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark)

    setDarkMode(initialDarkMode)
    if (initialDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode
      if (newMode) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
      return newMode
    })
  }

  useOnClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false))

  const formatDateRange = (startDate: string, endDate: string | undefined) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // Varian Animasi
  const FADE_IN_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const STAGGER_CHILDREN_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    // { href: "#education", label: "Education" }, // Bisa ditambahkan jika perlu
  ]

  // Pengaturan Scroll Header
  const { scrollY } = useScroll()
  const headerShadow = useTransform(
    scrollY,
    [0, 50], // Rentang scroll
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(0,0,0,0.05)"] // Shadow
  )
  const darkHeaderShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(255,255,255,0.03)"]
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans`}>
      {/* === HEADER === */}
      <motion.header
        style={{
          boxShadow: darkMode ? darkHeaderShadow : headerShadow,
        }}
        className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-shadow duration-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.a
              href="#hero"
              className="text-2xl font-bold text-sky-600 dark:text-sky-400"
              whileHover={{ opacity: 0.8 }}
            >
              {profile.name.split(" ")[0]}
              <span className="text-gray-400 dark:text-gray-600">.</span>
            </motion.a>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Tombol Menu Mobile */}
              <div className="md:hidden">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-850 shadow-lg border-t border-gray-200 dark:border-slate-700" // slate-850 custom color
            >
              <nav className="flex flex-col px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={`mobile-${link.label}`}
                    href={link.href}
                    className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 mt-2 border-t border-gray-200 dark:border-slate-700 flex justify-center space-x-4">
                    {profile.links?.slice(0, 4).map(link => (
                         <a
                            key={`mobile-social-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
                            title={link.label}
                          >
                            <SocialMediaIcon platform={link.label || ""} size={22}/>
                          </a>
                    ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* === MAIN CONTENT === */}
      <main className="pt-8 pb-16">
        {/* --- HERO SECTION --- */}
        <motion.section
          id="hero"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center"
          variants={FADE_IN_UP_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {profile.profile_image && (
            <motion.img
              src={profile.profile_image}
              alt={profile.name}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover mx-auto mb-6 shadow-lg border-4 border-white dark:border-slate-800"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            />
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-gray-900 dark:text-white">Hi, I'm {profile.name.split(" ")[0]}</span>
            <span className="text-sky-600 dark:text-sky-400">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {profile.bio || "A passionate individual ready to create amazing things."}
          </p>
          <motion.a
            href="#projects"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ y: -2 }}
          >
            View My Work
          </motion.a>
        </motion.section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
          {/* --- ABOUT SECTION --- */}
          <motion.section
            id="about"
            className="scroll-mt-20 grid md:grid-cols-5 gap-8 md:gap-12 items-center"
            variants={STAGGER_CHILDREN_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="md:col-span-3" variants={FADE_IN_UP_VARIANTS}>
              <h2 className="text-3xl font-bold mb-1">About Me</h2>
              <div className="w-16 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-6"></div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                {/* Anda bisa memformat bio dengan beberapa paragraf jika perlu */}
                <p>{profile.bio_long || profile.bio || "Detailed information about me, my journey, and my aspirations will be displayed here. I focus on creating intuitive and impactful digital experiences."}</p>
                {/* <p>Another paragraph about interests or philosophy...</p> */}
              </div>
            </motion.div>
            <motion.div className="md:col-span-2" variants={FADE_IN_UP_VARIANTS}>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Connect with Me</h3>
                {profile.links && profile.links.length > 0 ? (
                  <div className="space-y-3">
                    {profile.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <SocialMediaIcon platform={link.label || ""} size={22} className="text-sky-500 dark:text-sky-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">{link.label}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Social links are not available yet.</p>
                )}
              </div>
            </motion.div>
          </motion.section>

          {/* --- EXPERIENCE SECTION --- */}
          {profile.experience && profile.experience.length > 0 && (
            <motion.section
              id="experience"
              className="scroll-mt-20"
              variants={STAGGER_CHILDREN_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-1">My Journey</h2>
                <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mx-auto"></div>
              </div>
              <div className="space-y-8">
                {profile.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 sm:gap-6"
                    variants={FADE_IN_UP_VARIANTS}
                  >
                    <div className="flex-shrink-0 sm:w-1/4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">{formatDateRange(exp.startDate, exp.endDate)}</p>
                      {exp.location && <p className="text-xs text-gray-400 dark:text-gray-500">{exp.location}</p>}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">{exp.position}</h3>
                      <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">{exp.company}</p>
                      {exp.description && <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* --- PROJECTS SECTION --- */}
          {profile.projects && profile.projects.length > 0 && (
            <motion.section
              id="projects"
              className="scroll-mt-20"
              variants={STAGGER_CHILDREN_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-1">Featured Works</h2>
                <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {profile.projects.map((project) => (
                  <motion.div
                    key={project.title}
                    className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl dark:hover:border-sky-600"
                    variants={FADE_IN_UP_VARIANTS}
                    whileHover={{ y: -5 }}
                  >
                    {project.image && (
                      <div className="aspect-[16/9] w-full overflow-hidden"> {/* Rasio 16:9 lebih umum untuk proyek */}
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400 mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow mb-4">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 5).map((tech) => ( // Batasi jumlah tag
                            <span
                              key={tech}
                              className="bg-sky-100 dark:bg-sky-900/70 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline group-hover:text-sky-500"
                        >
                          View Project
                          <svg className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* --- SKILLS SECTION --- */}
          {profile.skills && profile.skills.length > 0 && (
             <motion.section
              id="skills"
              className="scroll-mt-20"
              variants={STAGGER_CHILDREN_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-1">My Toolkit</h2>
                <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mx-auto"></div>
              </div>
              {Array.from(new Set(profile.skills.map(s => s.category || "Core Skills"))).map(category => (
                <div key={category} className="mb-10">
                    <h3 className="text-xl font-semibold text-center md:text-left mb-6 text-gray-700 dark:text-gray-300">{category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {profile.skills.filter(s => (s.category || "Core Skills") === category).map(skill => (
                            <motion.div
                                key={skill.name}
                                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl dark:hover:border-sky-600"
                                variants={FADE_IN_UP_VARIANTS}
                                whileHover={{ y: -4, scale:1.03}}
                            >
                                {/* Placeholder ikon bisa diganti dengan ikon SVG spesifik jika ada */}
                                <div className="p-2 mb-2 text-sky-500 dark:text-sky-400">
                                    {/* Coba tampilkan ikon berdasarkan kategori atau nama skill */}
                                    { category.toLowerCase().includes("design") ? <Star size={28}/> : <Code size={28} /> }
                                </div>
                                <p className="font-semibold text-sm text-gray-700 dark:text-gray-100 mb-1">{skill.name}</p>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                    <motion.div
                                    className="bg-sky-500 h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level * 20}%` }}
                                    viewport={{ once: true, amount: 0.8 }}
                                    transition={{ duration: 0.7, ease: "circOut" }}
                                    />
                                </div>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                    {["Beginner", "Intermediate", "Advanced", "Expert", "Master"][skill.level - 1]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
              ))}
            </motion.section>
          )}

        </div>
      </main>

      {/* === FOOTER === */}
      <motion.footer
        className="py-10 border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-850" // slate-850 custom color
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-6 p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            aria-label="Back to Top"
          >
            <ArrowUpCircle size={24} />
          </button>
          <div className="flex justify-center space-x-5 mb-6">
            {profile.links?.map((link) => (
              <a
                key={`footer-social-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                title={link.label}
              >
                <SocialMediaIcon platform={link.label || ""} size={24} />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {profile.name}.
            <span className="mx-1">|</span>
            All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {/* You can add "Crafted with..." or similar here */}
            Powered by looqmy
          </p>
        </div>
      </motion.footer>
      {/* Tailwind Custom Color (jika diperlukan untuk dark mode yang lebih spesifik) */}
      <style jsx global>{`
        .dark .dark\:bg-slate-850 {
            background-color: #172033; // Contoh warna custom untuk slate-850
        }
        .dark .dark\:prose-invert {
            --tw-prose-body: theme(colors.slate.300);
            --tw-prose-headings: theme(colors.white);
            // Tambahkan variabel prose lain jika perlu
        }
      `}</style>
    </div>
  )
}

