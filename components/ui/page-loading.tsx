"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export default function PageLoading() {
  const [isClient, setIsClient] = useState(false)
  const [rotation, setRotation] = useState(0)
  const animationContainer = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    setIsClient(true)

    // Set up letter animation
    const letters = ["l", "o", "o", "q", "m", "y"]
    const letterElements = letterRefs.current.filter(Boolean)

    if (letterElements.length === letters.length) {
      letterElements.forEach((el, index) => {
        if (el) {
          // Create more dynamic and faster animations
          const yMovement = 12 + Math.random() * 8
          const duration = 0.6 + Math.random() * 0.3 // Faster animation
          const delay = index * 0.05 // Shorter delay between letters

          // Create continuous looping animation
          el.animate(
            [
              { transform: "translateY(0px) rotate(0deg)" },
              { transform: `translateY(-${yMovement}px) rotate(${index % 2 ? 5 : -5}deg)` },
              { transform: "translateY(0px) rotate(0deg)" },
            ],
            {
              duration: duration * 1000,
              delay: delay * 1000,
              iterations: Number.POSITIVE_INFINITY,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy easing
            },
          )

          // More dynamic pulse animation
          el.animate(
            [
              { opacity: 0.8, scale: 0.9, filter: "blur(0px)" },
              { opacity: 1, scale: 1.1, filter: "blur(0.5px)" },
              { opacity: 0.8, scale: 0.9, filter: "blur(0px)" },
            ],
            {
              duration: (duration + 0.2) * 1000,
              delay: (delay + 0.1) * 1000,
              iterations: Number.POSITIVE_INFINITY,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy easing
            },
          )
        }
      })
    }

    // More creative circular animation for the loading indicator
    if (animationContainer.current) {
      const container = animationContainer.current
      const radius = 40
      const totalDots = 12

      // Clear previous dots
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div")
        const angle = (i / totalDots) * Math.PI * 2
        const delay = (i / totalDots) * 0.5 // Faster animation

        // Position dots in a circle
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        // Random colors for dots
        const hue = 210 + ((i * 30) % 150)
        dot.className = "absolute rounded-full"
        dot.style.width = "8px"
        dot.style.height = "8px"
        dot.style.transform = `translate(${x}px, ${y}px)`
        dot.style.opacity = "0"
        dot.style.backgroundColor = `hsl(${hue}, 100%, 60%)`

        // More dynamic animation
        dot.animate(
          [
            { opacity: 0, transform: `translate(${x}px, ${y}px) scale(0.5)` },
            { opacity: 1, transform: `translate(${x * 1.2}px, ${y * 1.2}px) scale(1.2)` },
            { opacity: 0, transform: `translate(${x}px, ${y}px) scale(0.5)` },
          ],
          {
            duration: 1000, // Faster animation
            delay: delay * 1000,
            iterations: Number.POSITIVE_INFINITY,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy easing
          },
        )

        container.appendChild(dot)
      }

      // Add spinning container animation
      container.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
        duration: 6000,
        iterations: Number.POSITIVE_INFINITY,
        easing: "linear",
      })
    }

    // Rotation effect for the loading spinner
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 10) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Simple loading spinner for server-side rendering
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <Logo className="text-4xl mt-4" />
        </div>
      </div>
    )
  }

  // Letter animation variants - faster and more creative
  const letterVariants = {
    initial: { y: -20, opacity: 0, scale: 0.8 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05, // Faster delay
        duration: 0.3, // Faster animation
        ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        repeatDelay: 2,
      },
    }),
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center min-h-screen z-50">
      <div className="relative mb-8">
        <div
          className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <Logo className="text-4xl" />
      <div className="flex items-center justify-center">
        {["l", "o", "o", "q", "m", "y"].map((letter, i) => (
          <motion.span
            key={i}
            ref={(el) => (letterRefs.current[i] = el)}
            custom={i}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            className="text-5xl font-medium inline-block"
            style={{
              fontFamily: "'Pacifico', cursive",
              color: `hsl(${210 + i * 15}, 100%, 50%)`,
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          transition: {
            duration: 1, // Faster animation
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          },
        }}
        className="mt-6 text-gray-500 font-medium"
      >
        Loading amazing things...
      </motion.p>
    </div>
  )
}
