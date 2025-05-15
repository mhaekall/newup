"use client"

import { useState, useEffect } from "react"
import { trackProfileView, toggleProfileLike, getProfileStats } from "@/actions/analytics"

export function useProfileStats(username: string) {
  const [viewCount, setViewCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial stats
  useEffect(() => {
    async function loadStats() {
      try {
        // Track view
        const viewResult = await trackProfileView(username)

        // Get stats
        const statsResult = await getProfileStats(username)

        if (statsResult.success) {
          setViewCount(statsResult.viewCount)
          setLikeCount(statsResult.likeCount)
          setIsLiked(statsResult.isLiked)
        }
      } catch (error) {
        console.error("Error loading profile stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      loadStats()
    }
  }, [username])

  // Toggle like
  const toggleLike = async () => {
    try {
      const result = await toggleProfileLike(username)

      if (result.success) {
        setLikeCount(result.likeCount)
        setIsLiked(result.isLiked)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return {
    viewCount,
    likeCount,
    isLiked,
    isLoading,
    toggleLike,
  }
}
