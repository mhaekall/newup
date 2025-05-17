"use client"

import { useEffect, useState, useCallback } from "react"
import { fetchProfileStats, viewProfile, toggleLike } from "@/actions/profile-stats"
import { useToast } from "@/components/ui/use-toast"

export function useProfileAnalytics(username: string) {
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    isLiked: false,
    profileId: "",
    visitorId: "",
    loading: true,
    error: null as string | null,
  })
  const [isLikeProcessing, setIsLikeProcessing] = useState(false)
  const { toast } = useToast()

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
            visitorId: result.stats.visitorId,
            loading: false,
            error: null,
          })
        } else {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load profile stats",
          }))
          toast({
            title: "Error",
            description: "Failed to load profile statistics",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error initializing analytics:", error)
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "An unexpected error occurred",
        }))
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading statistics",
          variant: "destructive",
        })
      }
    }

    if (username) {
      initStats()
    }
  }, [username, toast])

  // Handle like toggle
  const handleLike = useCallback(async () => {
    if (isLikeProcessing) return

    try {
      setIsLikeProcessing(true)

      const result = await toggleLike(username)

      if (result.success) {
        setStats((prev) => ({
          ...prev,
          likes: result.likeCount,
          isLiked: result.isLiked,
          error: null,
        }))

        toast({
          title: result.isLiked ? "Liked!" : "Unliked",
          description: result.isLiked ? "You liked this profile" : "You removed your like",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update like status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLikeProcessing(false)
    }
  }, [username, isLikeProcessing, toast])

  // Handle share
  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = `Check out ${username}'s portfolio!`

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: "Check out this awesome portfolio!",
          url,
        })
        toast({
          title: "Shared!",
          description: "Portfolio shared successfully",
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link Copied!",
          description: "Portfolio link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // If sharing failed, try clipboard as fallback
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link Copied!",
          description: "Portfolio link copied to clipboard",
        })
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Failed to share or copy link",
          variant: "destructive",
        })
      }
    }
  }, [username, toast])

  return {
    stats,
    isLikeProcessing,
    handleLike,
    handleShare,
  }
}
