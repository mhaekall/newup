import { createClient } from "@/lib/supabase-client"
import { createServerClient } from "@/lib/supabase-server"
import { v4 as uuidv4 } from "uuid"

export type ProfileStats = {
  views: number
  likes: number
  shares: number
}

export type TimeRange = "7d" | "30d" | "90d" | "all"

export type AnalyticsData = {
  viewsByDay: { date: string; count: number }[]
  likesByDay: { date: string; count: number }[]
  totalViews: number
  totalLikes: number
  viewsGrowth: number
  likesGrowth: number
  topReferrers: { source: string; count: number }[]
  deviceTypes: { type: string; count: number }[]
  countries: { country: string; count: number }[]
}

// Client-side analytics service
export const analyticsService = {
  // Record a view for a profile
  async recordView(profileId: string, userId?: string): Promise<void> {
    try {
      const supabase = createClient()
      const clientIp = await getClientIp()

      await supabase.rpc("record_profile_view", {
        profile_id: profileId,
        viewer_id: userId || null,
        viewer_ip: clientIp || null,
      })
    } catch (error) {
      console.error("Error recording view:", error)
    }
  },

  // Toggle like for a profile
  async toggleLike(profileId: string, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient()
      const clientIp = await getClientIp()

      const { data, error } = await supabase.rpc("toggle_profile_like", {
        profile_id: profileId,
        liker_id: userId || null,
        liker_ip: clientIp || null,
      })

      if (error) throw error
      return data as boolean
    } catch (error) {
      console.error("Error toggling like:", error)
      return false
    }
  },

  // Check if user has liked a profile
  async hasLiked(profileId: string, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient()
      const clientIp = await getClientIp()

      const { data, error } = await supabase.rpc("has_liked_profile", {
        profile_id: profileId,
        liker_id: userId || null,
        liker_ip: clientIp || null,
      })

      if (error) throw error
      return data as boolean
    } catch (error) {
      console.error("Error checking like status:", error)
      return false
    }
  },

  // Get profile stats
  async getProfileStats(
    profileId: string,
    period: "day" | "week" | "month" | "year" | "all" = "all",
  ): Promise<{
    views: number
    likes: number
    shares: number
  }> {
    try {
      const supabase = createClient()

      // Get views
      const { data: viewsData, error: viewsError } = await supabase.rpc("get_profile_views_count", {
        profile_id: profileId,
        time_period: period,
      })

      if (viewsError) throw viewsError

      // Get likes
      const { data: likesData, error: likesError } = await supabase.rpc("get_profile_likes_count", {
        profile_id: profileId,
      })

      if (likesError) throw likesError

      // Get shares (if implemented)
      const sharesCount = 0 // Placeholder for future implementation

      return {
        views: viewsData || 0,
        likes: likesData || 0,
        shares: sharesCount,
      }
    } catch (error) {
      console.error("Error getting profile stats:", error)
      return { views: 0, likes: 0, shares: 0 }
    }
  },

  // Record a share for a profile
  async recordShare(profileId: string, platform: string, userId?: string): Promise<void> {
    try {
      const supabase = createClient()
      const clientIp = await getClientIp()

      await supabase.from("profile_shares").insert({
        id: uuidv4(),
        profile_id: profileId,
        sharer_id: userId || null,
        sharer_ip: clientIp || null,
        platform,
      })
    } catch (error) {
      console.error("Error recording share:", error)
    }
  },
}

// Export clientAnalytics as an alias for analyticsService
export const clientAnalytics = analyticsService

// Server-side analytics service
export const serverAnalyticsService = {
  // Get detailed analytics for a profile
  async getDetailedAnalytics(profileId: string, userId: string) {
    try {
      const supabase = createServerClient()

      // Get daily views for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: dailyViews, error: dailyViewsError } = await supabase
        .from("profile_views")
        .select("created_at")
        .eq("profile_id", profileId)
        .gte("created_at", thirtyDaysAgo.toISOString())

      if (dailyViewsError) throw dailyViewsError

      // Get total likes
      const { data: totalLikes, error: likesError } = await supabase
        .from("profile_likes")
        .select("id")
        .eq("profile_id", profileId)

      if (likesError) throw likesError

      // Process daily views into a chart-friendly format
      const viewsByDay = processViewsByDay(dailyViews || [])

      return {
        totalViews: (dailyViews || []).length,
        totalLikes: (totalLikes || []).length,
        viewsByDay,
        // Add more analytics as needed
      }
    } catch (error) {
      console.error("Error getting detailed analytics:", error)
      return {
        totalViews: 0,
        totalLikes: 0,
        viewsByDay: [],
      }
    }
  },
}

// Helper function to get client IP
async function getClientIp(): Promise<string | null> {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("Error getting client IP:", error)
    return null
  }
}

// Helper function to process views by day
function processViewsByDay(views: { created_at: string }[]) {
  const viewsByDay: { date: string; count: number }[] = []
  const dayMap = new Map<string, number>()

  // Group views by day
  views.forEach((view) => {
    const date = new Date(view.created_at).toISOString().split("T")[0]
    dayMap.set(date, (dayMap.get(date) || 0) + 1)
  })

  // Convert map to array
  dayMap.forEach((count, date) => {
    viewsByDay.push({ date, count })
  })

  // Sort by date
  viewsByDay.sort((a, b) => a.date.localeCompare(b.date))

  return viewsByDay
}

// Helper function to get date from time range
function getDateFromRange(range: TimeRange): string {
  const now = new Date()

  switch (range) {
    case "7d":
      now.setDate(now.getDate() - 7)
      break
    case "30d":
      now.setDate(now.getDate() - 30)
      break
    case "90d":
      now.setDate(now.getDate() - 90)
      break
    case "all":
      now.setFullYear(now.getFullYear() - 10) // Arbitrary "all time" date
      break
  }

  return now.toISOString()
}

// Helper function to process time series data
function processTimeSeriesData(data: { created_at: string }[]): { date: string; count: number }[] {
  const counts: Record<string, number> = {}

  // Group by day
  data.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split("T")[0]
    counts[date] = (counts[date] || 0) + 1
  })

  // Fill in missing days
  const result: { date: string; count: number }[] = []
  const startDate = data.length > 0 ? new Date(data[0].created_at) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const endDate = new Date()

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    result.push({
      date: dateStr,
      count: counts[dateStr] || 0,
    })
  }

  return result
}

// Helper function to calculate growth
function calculateGrowth(data: { created_at: string }[], range: TimeRange): number {
  if (data.length === 0) return 0

  const now = new Date()
  let periodDays: number

  switch (range) {
    case "7d":
      periodDays = 7
      break
    case "30d":
      periodDays = 30
      break
    case "90d":
      periodDays = 90
      break
    case "all":
    default:
      return 0 // Can't calculate growth for "all time"
  }

  const currentPeriodStart = new Date(now)
  currentPeriodStart.setDate(currentPeriodStart.getDate() - periodDays)

  const previousPeriodStart = new Date(currentPeriodStart)
  previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays)

  const currentPeriodCount = data.filter((item) => new Date(item.created_at) >= currentPeriodStart).length

  const previousPeriodCount = data.filter(
    (item) => new Date(item.created_at) >= previousPeriodStart && new Date(item.created_at) < currentPeriodStart,
  ).length

  if (previousPeriodCount === 0) {
    return currentPeriodCount > 0 ? 100 : 0
  }

  return Math.round(((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100)
}
