"use client"

import { useEffect, useRef, useState } from "react"

export default function PageLoading() {
  const [isClient, setIsClient] = useState(false)
  const animationContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)

    // Only import and use lottie on the client side
    const loadLottie = async () => {
      if (animationContainer.current) {
        const lottieModule = await import("lottie-web")
        const lottie = lottieModule.default

        try {
          const animationModule = await import("@/public/animations/loading-animation.json")
          const animationData = animationModule.default

          const anim = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
          })

          return () => {
            anim.destroy()
          }
        } catch (error) {
          console.error("Failed to load animation:", error)
        }
      }
    }

    loadLottie()
  }, [])

  // Simple loading spinner for server-side rendering
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-medium text-blue-500 mt-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            looqmy
          </span>
        </div>
      </div>
    )
  }

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
