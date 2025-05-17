"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function useProfileInteractions(username: string) {
  const [stats, setStats] = useState({
    views: 0,
    shares: 0,
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch initial stats
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with localStorage
        const storedStats = localStorage.getItem(`profile-stats-${username}`)
        if (storedStats) {
          setStats(JSON.parse(storedStats))
        } else {
          // Default stats
          const defaultStats = {
            views: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 20),
          }
          setStats(defaultStats)
          localStorage.setItem(`profile-stats-${username}`, JSON.stringify(defaultStats))
        }

        // Record a view
        setTimeout(() => {
          handleView()
        }, 5000) // Record view after 5 seconds on page
      } catch (error) {
        console.error("Error fetching profile stats:", error)
      }
    }

    fetchStats()
  }, [username])

  // Handle view
  const handleView = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with localStorage
      const updatedStats = {
        ...stats,
        views: stats.views + 1,
      }
      setStats(updatedStats)
      localStorage.setItem(`profile-stats-${username}`, JSON.stringify(updatedStats))
    } catch (error) {
      console.error("Error recording view:", error)
    }
  }

  // Handle share
  const handleShare = async () => {
    setIsProcessing(true)
    try {
      // Check if navigator.share is available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: `${username}'s Portfolio`,
          text: `Check out ${username}'s portfolio!`,
          url: window.location.href,
        })
      } else {
        // Fallback for desktop
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Portfolio link copied to clipboard",
        })
      }

      // Update share count
      const updatedStats = {
        ...stats,
        shares: stats.shares + 1,
      }
      setStats(updatedStats)
      localStorage.setItem(`profile-stats-${username}`, JSON.stringify(updatedStats))
    } catch (error) {
      console.error("Error sharing profile:", error)
      // Fallback if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Portfolio link copied to clipboard",
        })
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError)
        toast({
          title: "Sharing failed",
          description: "Could not share or copy link",
          variant: "destructive",
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    stats,
    handleShare,
    isProcessing,
  }
}
