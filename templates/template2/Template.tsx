"use client"

import type { Profile } from "@/types" // Asumsi path alias sudah benar
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import SocialMediaIcon from "@/components/social-media-icons" // Asumsi path alias
import { useEffect, useState, useRef } from "react"
import { Moon, Sun, Menu, X, ArrowUpCircle, ChevronsDown } from "lucide-react"
// Untuk Lottie (contoh):
// import { Player } from '@lottiefiles/react-lottie-player';
// import darkModeToggleLottie from '@/assets/lottie/dark-mode-toggle.json'; // Simpan file Lottie Anda

interface TemplateProps {
  profile: Profile
}

// --- Hook Kustom untuk Deteksi Klik di Luar ---
function useOnClickOutside(ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}


export default function Template2({ profile }: TemplateProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));


  // Efek untuk memuat preferensi mode gelap & menerapkan kelas
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark"
    setDarkMode(isDark)
    if (isDark) {
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const formatDateRange = (startDate: string, endDate: string | undefined) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  // --- Varian Animasi Framer Motion ---
  const globalContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
  }

  const cardHoverEffect = {
    scale: 1.03,
    boxShadow: darkMode
      ? "0px 10px 30px -5px rgba(0, 183, 255, 0.3), 0px 8px 15px -7px rgba(0, 183, 255, 0.2)"
      : "0px 10px 30px -5px rgba(59, 130, 246, 0.3), 0px 8px 15px -7px rgba(59, 130, 246, 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
  ]

  // --- Untuk animasi header saat scroll ---
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.85])
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0.6, 0.9]) // Untuk backdrop blur
  const headerBorder = useTransform(scrollY, [0, 50], [0, 1])


  // --- Ide Kreatif: Animated Gradient Background untuk Banner ---
  const animatedGradient = `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-sky-100 dark:from-slate-900 dark:via-gray-900 dark:to-sky-900/30 transition-colors duration-500 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={globalContainerVariants}
    >
      {/* === HEADER KREATIF === */}
      <motion.header
        style={{
          // @ts-ignore
          "--tw-bg-opacity": headerBgOpacity,
          opacity: headerOpacity,
          borderBottomWidth: useTransform(headerBorder, v => `${v}px`),
        }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-gray-200/50 dark:border-slate-700/50 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Nama */}
            <motion.a href="#hero" className="text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400" variants={itemVariants} whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(56, 189, 248, 0.7)"}}>
              {profile.name.split(" ")[0]}<span className="text-gray-400 dark:text-gray-600">.</span>
            </motion.a>

            {/* Navigasi Desktop */}
            <motion.nav className="hidden md:flex items-center space-x-2 lg:space-x-3" variants={globalContainerVariants}>
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800/50 hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-200"
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>

            {/* Aksi Header: Tombol Dark Mode & Sosial (Desktop) & Menu Mobile */}
            <motion.div className="flex items-center space-x-2 sm:space-x-3" variants={itemVariants}>
              <div className="hidden sm:flex items-center space-x-2">
                {profile.links?.slice(0, 2).map((link) => (
                   <motion.a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    whileHover={{ y: -2, scale: 1.1 }}
                    title={link.label}
                  >
                    <SocialMediaIcon platform={link.label || ""} size={20} />
                  </motion.a>
                ))}
              </div>

              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                whileHover={{ scale: 1.15, rotate: darkMode ? -15 : 15 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle Dark Mode"
              >
                {/* Ganti dengan Lottie jika mau:
                <Player autoplay loop src={darkModeToggleLottie} style={{ height: '24px', width: '24px' }} />
                */}
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <div className="md:hidden">
                <motion.button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                  aria-label="Toggle Menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={isMobileMenuOpen ? "x" : "menu"}
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Menu Navigasi Mobile dengan Animasi */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef} // Untuk useOnClickOutside
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-800/95 shadow-xl border-t border-gray-200 dark:border-slate-700/50 py-3"
            >
              <nav className="flex flex-col px-4 space-y-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={`mobile-${link.label}`}
                    href={link.href}
                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-sky-100 dark:hover:bg-sky-700/60 hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.indexOf(link) * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="pt-4 pb-2 border-t border-gray-200 dark:border-slate-700/50">
                    <p className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Connect</p>
                    <div className="flex flex-wrap gap-2 px-3">
                        {profile.links?.map((link) => (
                            <motion.a
                                key={`mobile-social-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-600/50 hover:text-sky-600 dark:hover:text-sky-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (navLinks.length + profile.links.indexOf(link)) * 0.05 }}
                            >
                                <SocialMediaIcon platform={link.label || ""} size={18}/>
                                {link.label}
                            </motion.a>
                        ))}
                    </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* === BAGIAN UTAMA === */}
      <main className="pt-8"> {/* Beri sedikit padding atas agar tidak terlalu mepet header */}

        {/* === HERO SECTION KREATIF === */}
        <motion.section
          id="hero"
          className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center text-center overflow-hidden px-4 py-16 md:py-24"
          style={{
            backgroundImage: profile.banner_image
              ? `url(${profile.banner_image})`
              : animatedGradient,
            backgroundSize: profile.banner_image ? 'cover' : '400% 400%',
            animation: profile.banner_image ? 'none' : 'gradientBG 15s ease infinite',
          }}
          initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          transition={{duration: 0.8 }}
        >
          {/* Overlay untuk readability jika ada banner image */}
          {profile.banner_image && <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0"></div>}
          
          {/* Lottie animasi di background? */}
          {/* <Player autoplay loop src="path/to/background_lottie.json" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" /> */}

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              className="mb-8"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {profile.profile_image ? (
                <motion.img
                  src={profile.profile_image}
                  alt={profile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-4 border-white/50 dark:border-slate-700/50 shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              ) : (
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 dark:from-sky-600 dark:to-blue-800 flex items-center justify-center text-white text-5xl md:text-6xl font-bold mx-auto border-4 border-white/50 dark:border-slate-700/50 shadow-2xl"
                  whileHover={{ scale: 1.1, y:-5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </motion.div>
              )}
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <span className="text-white dark:text-gray-100">{profile.name.split(" ")[0]} </span>
              <span className="text-sky-300 dark:text-sky-400">{profile.name.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            <motion.p
              className="text-sky-100 dark:text-sky-300 font-medium text-lg md:text-xl mb-6"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              @{profile.username}
            </motion.p>

            <motion.p
              className="max-w-xl mx-auto text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-10 leading-relaxed"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {profile.bio} {/* Bio singkat di hero */}
            </motion.p>

            <motion.a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-sky-700 bg-white hover:bg-gray-100 dark:text-slate-900 dark:bg-sky-400 dark:hover:bg-sky-300 transition-transform transform hover:scale-105 shadow-lg"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{boxShadow: "0px 0px 20px rgba(255,255,255,0.5)"}}
            >
              Discover More <ChevronsDown size={20} className="ml-2 animate-bounce" />
            </motion.a>
          </div>
        </motion.section>


        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
          {/* === BAGIAN ABOUT ME & CONNECT === */}
          <motion.section id="about" className="scroll-mt-20" variants={globalContainerVariants}>
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-start">
              <motion.div
                className="md:col-span-3 bg-white dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 ring-1 ring-slate-900/5 dark:ring-white/10"
                variants={itemVariants}
                whileHover={cardHoverEffect}
              >
                <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  About Me
                </motion.h2>
                <div className="w-16 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-6"></div>
                <motion.p className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4" variants={itemVariants}>
                  {/* Menggunakan profile.bio yang lebih panjang di sini, atau field lain jika ada */}
                  {profile.bio_long || profile.bio}
                </motion.p>
              </motion.div>

              <motion.div
                className="md:col-span-2 bg-white dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 ring-1 ring-slate-900/5 dark:ring-white/10"
                variants={itemVariants}
                whileHover={cardHoverEffect}
              >
                <motion.h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Connect with Me
                </motion.h2>
                 <div className="w-12 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-6"></div>
                {profile.links && profile.links.length > 0 ? (
                  <motion.div className="flex flex-wrap gap-3" variants={globalContainerVariants}>
                    {profile.links.map((link) => (
                      <motion.a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-700/70 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-200 transform hover:scale-105"
                        variants={itemVariants}
                        title={link.label}
                      >
                        <SocialMediaIcon platform={link.label || ""} size={18}/>
                        <span>{link.label}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No social links yet.</p>
                )}
              </motion.div>
            </div>
          </motion.section>

          {/* === BAGIAN EXPERIENCE === */}
          <motion.section id="experience" className="scroll-mt-20" variants={globalContainerVariants}>
            <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center" variants={itemVariants}>
              My Journey
            </motion.h2>
            <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-10 mx-auto"></div>
            {profile.experience && profile.experience.length > 0 ? (
              <div className="relative space-y-10">
                {/* Timeline Line */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-sky-200 dark:bg-sky-700/50 transform -translate-x-1/2"></div>
                {profile.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    className="md:flex items-start relative"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:flex absolute top-1 left-1/2 w-4 h-4 bg-sky-500 dark:bg-sky-400 rounded-full border-4 border-white dark:border-slate-800 transform -translate-x-1/2 -translate-y-0 items-center justify-center">
                        {/* Ganti dengan ikon kecil jika mau */}
                    </div>
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:text-right md:ml-auto'}`}>
                        <motion.div
                          className="bg-white dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 ring-1 ring-slate-900/5 dark:ring-white/10"
                          whileHover={cardHoverEffect}
                        >
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formatDateRange(exp.startDate, exp.endDate)}</p>
                          <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">{exp.position}</h3>
                          <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">{exp.company}</p>
                          {exp.location && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{exp.location}</p>}
                          {exp.description && <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{exp.description}</p>}
                        </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p className="text-center text-gray-500 dark:text-gray-400" variants={itemVariants}>No experience entries yet.</motion.p>
            )}
          </motion.section>


          {/* === BAGIAN EDUCATION (Mirip Experience) === */}
          <motion.section id="education" className="scroll-mt-20" variants={globalContainerVariants}>
             <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center" variants={itemVariants}>
              Education
            </motion.h2>
            <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-10 mx-auto"></div>
            {profile.education && profile.education.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {profile.education.map((edu, index) => (
                    <motion.div
                        key={index}
                        className="bg-white dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 ring-1 ring-slate-900/5 dark:ring-white/10"
                        variants={itemVariants}
                        whileHover={cardHoverEffect}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formatDateRange(edu.startDate, edu.endDate)}</p>
                        <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">{edu.institution}</h3>
                        <p className="text-gray-700 dark:text-gray-200 font-medium">{edu.degree} in {edu.field}</p>
                        {edu.description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">{edu.description}</p>}
                    </motion.div>
                ))}
              </div>
            ) : (
               <motion.p className="text-center text-gray-500 dark:text-gray-400" variants={itemVariants}>No education entries yet.</motion.p>
            )}
          </motion.section>


          {/* === BAGIAN SKILLS KREATIF === */}
          <motion.section id="skills" className="scroll-mt-20" variants={globalContainerVariants}>
            <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center" variants={itemVariants}>
              My Arsenal
            </motion.h2>
            <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-10 mx-auto"></div>
            {profile.skills && profile.skills.length > 0 ? (
                Array.from(new Set(profile.skills.map((skill) => skill.category || "General Skills"))).map((category) => (
                    <motion.div key={category} className="mb-10" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center md:text-left">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {profile.skills
                            .filter((skill) => (skill.category || "General Skills") === category)
                            .map((skill, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-slate-900/5 dark:ring-white/10 hover:shadow-sky-500/30 dark:hover:shadow-sky-400/30 transition-shadow"
                                variants={itemVariants}
                                whileHover={{ y: -5, scale:1.05, transition: {type: "spring", stiffness:200}}}
                            >
                                {/* Ganti dengan ikon skill jika ada, atau Lottie kecil */}
                                <div className="w-12 h-12 mb-3 bg-gradient-to-br from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                                 {skill.name.substring(0,2).toUpperCase()} {/* Placeholder ikon */}
                                </div>
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-1">{skill.name}</span>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                                <motion.div
                                    className="bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level * 20}%` }}
                                    viewport={{ once: true, amount: 0.8 }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + index * 0.05 }}
                                />
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                    {["Novice", "Learner", "Proficient", "Expert", "Master"][skill.level - 1]}
                                </span>
                            </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))
            ) : (
              <motion.p className="text-center text-gray-500 dark:text-gray-400" variants={itemVariants}>No skills added yet.</motion.p>
            )}
          </motion.section>

          {/* === BAGIAN PROJECTS KREATIF === */}
          <motion.section id="projects" className="scroll-mt-20" variants={globalContainerVariants}>
             <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center" variants={itemVariants}>
              Featured Works
            </motion.h2>
            <div className="w-20 h-1 bg-sky-500 dark:bg-sky-400 rounded-full mb-10 mx-auto"></div>
            {profile.projects && profile.projects.length > 0 ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" variants={globalContainerVariants}>
                {profile.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="group bg-white dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden flex flex-col ring-1 ring-slate-900/5 dark:ring-white/10"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={cardHoverEffect}
                  >
                    {project.image && (
                      // Paksa rasio aspek 4:3
                      <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden">
                        <motion.img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">{project.title}</h3>
                        {project.url && (
                          <motion.a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            title="View Project"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                          </motion.a>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow mb-4">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-block bg-sky-100 dark:bg-sky-800/70 rounded-full px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p className="text-center text-gray-500 dark:text-gray-400" variants={itemVariants}>No projects added yet.</motion.p>
            )}
          </motion.section>
        </div>
      </main>

      {/* === FOOTER KREATIF === */}
      <motion.footer
        className="mt-24 py-10 bg-gradient-to-t from-gray-200/70 to-transparent dark:from-slate-800/70 dark:to-transparent border-t border-gray-200/70 dark:border-slate-700/70"
        initial={{ opacity:0, y: 20}}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Lottie untuk logo kecil atau animasi? */}
          {/* <Player autoplay loop src="path/to/footer_lottie.json" style={{ height: '50px', width: '50px', margin: '0 auto 1rem' }} /> */}
          
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-6 p-3 rounded-full text-sky-600 dark:text-sky-400 bg-white/70 dark:bg-slate-700/70 shadow-md hover:shadow-xl hover:bg-sky-50 dark:hover:bg-slate-600 transition-all transform hover:scale-110"
            aria-label="Back to Top"
            whileHover={{ y: -3 }}
          >
            <ArrowUpCircle size={24} />
          </motion.button>

          <div className="flex justify-center space-x-5 mb-6">
             {profile.links?.map((link) => (
                <motion.a
                key={`footer-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                whileHover={{ y: -2, scale: 1.15 }}
                title={link.label}
                >
                <SocialMediaIcon platform={link.label || ""} size={22} />
                </motion.a>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Crafted with <span className="text-red-500 animate-pulse">❤️</span> using looqmy.
            {/* Tambahkan jika Anda menggunakan nama builder spesifik */}
            {/* Built with Next.js Portfolio Builder */}
          </p>
        </div>
      </motion.footer>
      
      {/* CSS untuk animasi gradien banner (jika tidak menggunakan gambar) */}
      <style jsx global>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        // Untuk memastikan rasio aspek gambar proyek berfungsi:
        .aspect-w-4 { position: relative; padding-bottom: calc(3 / 4 * 100%); }
        .aspect-w-4 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
        .aspect-h-3 { /* tidak perlu jika aspect-w-X sudah ada */ }

      `}</style>
    </motion.div>
  )
}

