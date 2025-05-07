"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface ConfettiProps {
  active: boolean
}

export function Confetti({ active }: ConfettiProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true)
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          setIsActive(false)
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [active, isActive])

  return null
}
