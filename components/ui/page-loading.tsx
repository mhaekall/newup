"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function PageLoading() {
  const [isClient, setIsClient] = useState(false)
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
          // Create floating animation
          const yMovement = 10 + Math.random() * 5
          const duration = 1 + Math.random() * 0.5
          const delay = index * 0.1

          // Create continuous looping animation
          el.animate(
            [
              { transform: "translateY(0px)" },
              { transform: `translateY(-${yMovement}px)` },
              { transform: "translateY(0px)" },
            ],
            {
              duration: duration * 1000,
              delay: delay * 1000,
              iterations: Number.POSITIVE_INFINITY,
              easing: "ease-in-out",
            },
          )

          // Pulse animation
          el.animate(
            [
              { opacity: 0.7, scale: 0.95 },
              { opacity: 1, scale: 1.05 },
              { opacity: 0.7, scale: 0.95 },
            ],
            {
              duration: (duration + 0.5) * 1000,
              delay: (delay + 0.2) * 1000,
              iterations: Number.POSITIVE_INFINITY,
              easing: "ease-in-out",
            },
          )
        }
      })
    }

    // Circular animation for the loading indicator
    if (animationContainer.current) {
      const container = animationContainer.current
      const radius = 40
      const totalDots = 12

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div")
        const angle = (i / totalDots) * Math.PI * 2
        const delay = i / totalDots

        // Position dots in a circle
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        dot.className = "absolute rounded-full bg-blue-500"
        dot.style.width = "8px"
        dot.style.height = "8px"
        dot.style.transform = `translate(${x}px, ${y}px)`
        dot.style.opacity = "0"

        // Animate each dot with infinite iterations
        dot.animate(
          [
            { opacity: 0, transform: `translate(${x}px, ${y}px) scale(0.5)` },
            { opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)` },
            { opacity: 0, transform: `translate(${x}px, ${y}px) scale(0.5)` },
          ],
          {
            duration: 1500,
            delay: delay * 1000,
            iterations: Number.POSITIVE_INFINITY,
            easing: "ease-in-out",
          },
        )

        container.appendChild(dot)
      }
    }
  }, [])

  // Simple loading spinner for server-side rendering
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-3xl font-medium text-blue-500 mt-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            looqmy
          </span>
        </div>
      </div>
    )
  }

  // Letter animation variants
  const letterVariants = {
    initial: { y: -20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        repeatDelay: 5,
      },
    }),
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Animated loading circle */}
        <div ref={animationContainer} className="relative w-24 h-24 mb-8"></div>

        {/* Animated looqmy text */}
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
                color: `hsl(${210 + i * 10}, 100%, 50%)`,
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            transition: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          }}
          className="mt-6 text-gray-500 font-medium"
        >
          Loading amazing things...
        </motion.p>
      </div>
    </div>
  )
}
