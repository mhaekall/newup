"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { clientAnalytics } from "@/lib/analytics-service"

export function useProfileInteractions(profileId: string) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(0)
  const [views, setViews] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!profileId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Record view
        await clientAnalytics.recordView(profileId, session?.user?.id)

        // Check if user has liked
        const liked = await clientAnalytics.hasLiked(profileId, session?.user?.id)
        setHasLiked(liked)

        // Get current stats
        const stats = await clientAnalytics.getProfileStats(profileId)
        setLikes(stats.likes)
        setViews(stats.views)
      } catch (error) {
        console.error("Error in profile interactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profileId, session?.user?.id])

  const toggleLike = async () => {
    if (!profileId) return

    try {
      const liked = await clientAnalytics.toggleLike(profileId, session?.user?.id)
      setHasLiked(liked)

      // Update likes count
      const stats = await clientAnalytics.getProfileStats(profileId)
      setLikes(stats.likes)

      return liked
    } catch (error) {
      console.error("Error toggling like:", error)
      return hasLiked
    }
  }

  const shareProfile = async (platform: string) => {
    if (!profileId) return

    try {
      await clientAnalytics.recordShare(profileId, platform, session?.user?.id)
    } catch (error) {
      console.error("Error recording share:", error)
    }
  }

  return {
    likes,
    views,
    hasLiked,
    isLoading,
    toggleLike,
    shareProfile,
  }
}
