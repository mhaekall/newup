"use client"

import { useEffect, useState } from "react"
import { fetchProfileStats, viewProfile, toggleLike } from "@/actions/profile-stats"

export function useProfileAnalytics(username: string) {
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    isLiked: false,
    profileId: "",
    loading: true,
    error: null as string | null,
  })

  // Load initial stats and record a view
  useEffect(() => {
    const initStats = async () => {
      try {
        // Record view first
        await viewProfile(username)

        // Then fetch updated stats
        const result = await fetchProfileStats(username)

        if (result.success && result.stats) {
          setStats({
            views: result.stats.views,
            likes: result.stats.likes,
            isLiked: result.stats.isLiked,
            profileId: result.stats.profileId,
            loading: false,
            error: null,
          })
        } else {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load profile stats",
          }))
        }
      } catch (error) {
        console.error("Error initializing analytics:", error)
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "An unexpected error occurred",
        }))
      }
    }

    if (username) {
      initStats()
    }
  }, [username])

  // Handle like toggle
  const handleLike = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true }))

      const result = await toggleLike(username)

      if (result.success) {
        setStats((prev) => ({
          ...prev,
          likes: result.likeCount,
          isLiked: result.isLiked,
          loading: false,
          error: null,
        }))
      } else {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to update like status",
        }))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: "An unexpected error occurred",
      }))
    }
  }

  return {
    stats,
    handleLike,
  }
}
