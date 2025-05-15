"use client"

import { useEffect, useState } from "react"
import { recordProfileView, toggleProfileLike, checkProfileLikeStatus } from "@/actions/analytics"

type ProfileStats = {
  views: number
  likes: number
  liked: boolean
  isLoading: boolean
}

export function useProfileStats(username: string) {
  const [stats, setStats] = useState<ProfileStats>({
    views: 0,
    likes: 0,
    liked: false,
    isLoading: true,
  })

  // Record view and get initial stats
  useEffect(() => {
    const initStats = async () => {
      try {
        // Record the view
        const viewResult = await recordProfileView(username)

        // Check if user has liked the profile
        const likeResult = await checkProfileLikeStatus(username)

        if (viewResult.success && likeResult.success) {
          setStats({
            views: viewResult.stats?.views || 0,
            likes: likeResult.stats?.likes || 0,
            liked: likeResult.liked || false,
            isLoading: false,
          })
        } else {
          setStats((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Error initializing stats:", error)
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initStats()
  }, [username])

  // Function to toggle like
  const toggleLike = async () => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true }))
      const result = await toggleProfileLike(username)

      if (result.success) {
        setStats({
          views: result.stats?.views || stats.views,
          likes: result.stats?.likes || stats.likes,
          liked: result.liked,
          isLoading: false,
        })
      } else {
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      setStats((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return {
    stats,
    toggleLike,
  }
}
