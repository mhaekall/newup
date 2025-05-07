"use client"

import { useCallback, useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface ConfettiProps {
  active?: boolean
  config?: confetti.Options
}

export function Confetti({ active = false, config = {} }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<confetti.CreateTypes | null>(null)

  const fireConfetti = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        ...config,
      })
    }
  }, [config])

  useEffect(() => {
    if (canvasRef.current && !confettiRef.current) {
      canvasRef.current.style.position = "fixed"
      canvasRef.current.style.top = "0"
      canvasRef.current.style.left = "0"
      canvasRef.current.style.width = "100%"
      canvasRef.current.style.height = "100%"
      canvasRef.current.style.pointerEvents = "none"
      canvasRef.current.style.zIndex = "9999"

      confettiRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      })
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current.reset()
      }
    }
  }, [])

  useEffect(() => {
    if (active && confettiRef.current) {
      fireConfetti()
    }
  }, [active, fireConfetti])

  return <canvas ref={canvasRef} className="confetti-canvas" />
}
