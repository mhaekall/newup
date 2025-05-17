"use client"

import { useState, useEffect } from "react"
import { Heart, Share2, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { clientAnalytics } from "@/lib/analytics-service"
import { useSession } from "next-auth/react"

type SocialInteractionsProps = {
  profileId: string
  initialLikes?: number
  initialViews?: number
  variant?: "ios" | "modern" | "classic"
  className?: string
  onLike?: (liked: boolean) => void
  onShare?: () => void
}

export function SocialInteractions({
  profileId,
  initialLikes = 0,
  initialViews = 0,
  variant = "modern",
  className = "",
  onLike,
  onShare,
}: SocialInteractionsProps) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(initialLikes)
  const [views, setViews] = useState(initialViews)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    // Record view
    const recordView = async () => {
      try {
        await clientAnalytics.recordView(profileId, session?.user?.id)
      } catch (error) {
        console.error("Error recording view:", error)
      }
    }

    // Check if user has liked
    const checkLikeStatus = async () => {
      try {
        const liked = await clientAnalytics.hasLiked(profileId, session?.user?.id)
        setHasLiked(liked)
      } catch (error) {
        console.error("Error checking like status:", error)
      }
    }

    // Get current stats
    const getStats = async () => {
      try {
        const stats = await clientAnalytics.getProfileStats(profileId)
        setLikes(stats.likes)
        setViews(stats.views)
      } catch (error) {
        console.error("Error getting stats:", error)
      }
    }

    recordView()
    checkLikeStatus()
    getStats()
  }, [profileId, session?.user?.id])

  const handleLike = async () => {
    try {
      setIsLikeAnimating(true)
      const liked = await clientAnalytics.toggleLike(profileId, session?.user?.id)
      setHasLiked(liked)

      // Update likes count
      const stats = await clientAnalytics.getProfileStats(profileId)
      setLikes(stats.likes)

      if (onLike) onLike(liked)
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setTimeout(() => setIsLikeAnimating(false), 1000)
    }
  }

  const handleShare = async () => {
    setShareOpen(true)
    if (onShare) onShare()
  }

  // Get styles based on variant
  const getStyles = () => {
    switch (variant) {
      case "ios":
        return {
          container: "flex items-center justify-around py-3 border-t border-b border-gray-200",
          button: "flex flex-col items-center gap-1",
          icon: "w-6 h-6",
          text: "text-sm text-gray-500",
        }
      case "classic":
        return {
          container: "flex items-center gap-6 py-2",
          button: "flex items-center gap-2",
          icon: "w-5 h-5",
          text: "text-sm font-medium",
        }
      case "modern":
      default:
        return {
          container: "flex items-center gap-4 py-2",
          button: "flex items-center gap-2",
          icon: "w-5 h-5",
          text: "text-sm",
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        className={`${styles.button} ${hasLiked ? "text-red-500" : "text-gray-500"}`}
        onClick={handleLike}
        aria-label={hasLiked ? "Unlike" : "Like"}
      >
        <AnimatePresence>
          {isLikeAnimating && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              exit={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <Heart className={`${styles.icon} fill-red-500 text-red-500`} />
            </motion.div>
          )}
        </AnimatePresence>
        <Heart className={`${styles.icon} ${hasLiked ? "fill-red-500" : ""}`} />
        <span className={styles.text}>{likes}</span>
      </button>

      <button className={`${styles.button} text-gray-500`} onClick={handleShare} aria-label="Share">
        <Share2 className={styles.icon} />
        <span className={styles.text}>Share</span>
      </button>

      <div className={`${styles.button} text-gray-500`}>
        <Eye className={styles.icon} />
        <span className={styles.text}>{views} views</span>
      </div>

      {/* Share dialog */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShareOpen(false)}
          >
            <motion.div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium mb-4">Share this profile</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-50 text-blue-600"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          `${window.location.origin}/${window.location.pathname}`,
                        )}&text=Check out this profile!`,
                        "_blank",
                      )
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                  Twitter
                </button>
                <button
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-600 text-white"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `${window.location.origin}/${window.location.pathname}`,
                        )}`,
                        "_blank",
                      )
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                  Facebook
                </button>
                <button
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-50 text-blue-600"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          `${window.location.origin}/${window.location.pathname}`,
                        )}`,
                        "_blank",
                      )
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  LinkedIn
                </button>
                <button
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-green-50 text-green-600"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://api.whatsapp.com/send?text=Check out this profile! ${encodeURIComponent(
                          `${window.location.origin}/${window.location.pathname}`,
                        )}`,
                        "_blank",
                      )
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 0 1 7.022 2.91 9.788 9.788 0 0 1 2.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                  WhatsApp
                </button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : ""}
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium"
                  onClick={() => {
                    if (typeof navigator !== "undefined") {
                      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`)
                    }
                  }}
                >
                  Copy
                </button>
              </div>
              <button
                className="mt-4 w-full py-2 bg-gray-100 rounded-md text-gray-700 font-medium"
                onClick={() => setShareOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
