"use client"

import { useEffect, useRef } from "react"
import lottie from "lottie-web"
import loadingAnimation from "@/public/animations/loading-animation.json"

export default function PageLoading() {
  const animationContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
      })

      return () => {
        anim.destroy()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div ref={animationContainer} className="w-40 h-40"></div>
        <span className="text-2xl font-medium text-blue-500 mt-4" style={{ fontFamily: "'Pacifico', cursive" }}>
          looqmy
        </span>
      </div>
    </div>
  )
}
