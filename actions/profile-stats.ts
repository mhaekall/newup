"use server"

import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Function to get or create a visitor ID
function ensureVisitorId() {
  const cookieStore = cookies()
  let visitorId = cookieStore.get("visitor_id")?.value

  if (!visitorId) {
    visitorId = uuidv4()
    cookieStore.set("visitor_id", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    })
  }

  return visitorId
}

// Get profile ID from username
async function getProfileIdByUsername(username: string) {
  const supabase = createClient()

  const { data: profile, error } = await supabase.from("profiles").select("id").eq("username", username).single()

  if (error || !profile) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile.id
}

// Fetch analytics for a profile
export async function fetchProfileStats(username: string) {
  const visitorId = ensureVisitorId()

  try {
    const profileId = await getProfileIdByUsername(username)
    if (!profileId) {
      return { success: false, error: "Profile not found", stats: null }
    }

    const supabase = createClient()

    // Get view count
    const { count: viewCount } = await supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    // Get like count
    const { count: likeCount } = await supabase
      .from("profile_likes")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    // Check if current visitor has liked
    const { data: userLike } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    return {
      success: true,
      stats: {
        profileId,
        views: viewCount || 0,
        likes: likeCount || 0,
        isLiked: !!userLike,
        visitorId,
      },
    }
  } catch (error) {
    console.error("Error in fetchProfileStats:", error)
    return { success: false, error, stats: null }
  }
}

// Record a view for a profile
export async function viewProfile(username: string) {
  const visitorId = ensureVisitorId()

  try {
    const profileId = await getProfileIdByUsername(username)
    if (!profileId) {
      return { success: false, error: "Profile not found" }
    }

    const supabase = createClient()

    // Check if visitor has viewed in the last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: existingViews } = await supabase
      .from("profile_views")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .gte("created_at", yesterday.toISOString())

    // If no recent view, insert a new one
    if (!existingViews || existingViews.length === 0) {
      const { error } = await supabase.from("profile_views").insert({ profile_id: profileId, visitor_id: visitorId })
      if (error) {
        console.error("Error inserting view:", error)
      }
    }

    // Get updated view count
    const { count: viewCount } = await supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    return { success: true, viewCount: viewCount || 0 }
  } catch (error) {
    console.error("Error in viewProfile:", error)
    return { success: false, error }
  }
}

// Toggle like status for a profile
export async function toggleLike(username: string) {
  const visitorId = ensureVisitorId()

  try {
    const profileId = await getProfileIdByUsername(username)
    if (!profileId) {
      return { success: false, error: "Profile not found" }
    }

    const supabase = createClient()

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    // Toggle like status
    if (existingLike) {
      const { error } = await supabase.from("profile_likes").delete().eq("id", existingLike.id)
      if (error) {
        console.error("Error removing like:", error)
        return { success: false, error: "Failed to unlike profile" }
      }
    } else {
      const { error } = await supabase.from("profile_likes").insert({ profile_id: profileId, visitor_id: visitorId })
      if (error) {
        console.error("Error adding like:", error)
        return { success: false, error: "Failed to like profile" }
      }
    }

    // Get updated like count
    const { count: likeCount } = await supabase
      .from("profile_likes")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    return {
      success: true,
      isLiked: !existingLike,
      likeCount: likeCount || 0,
    }
  } catch (error) {
    console.error("Error in toggleLike:", error)
    return { success: false, error }
  }
}

// Get profile analytics data for dashboard
export async function getProfileAnalytics(profileId: string, timeRange: "7d" | "30d" | "90d" = "30d") {
  try {
    const supabase = createClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    if (timeRange === "7d") {
      startDate.setDate(endDate.getDate() - 7)
    } else if (timeRange === "30d") {
      startDate.setDate(endDate.getDate() - 30)
    } else {
      startDate.setDate(endDate.getDate() - 90)
    }

    // Get total views
    const { count: totalViews } = await supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    // Get total likes
    const { count: totalLikes } = await supabase
      .from("profile_likes")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    // Get views by day
    const { data: viewsData } = await supabase
      .from("profile_views")
      .select("created_at")
      .eq("profile_id", profileId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Get likes by day
    const { data: likesData } = await supabase
      .from("profile_likes")
      .select("created_at")
      .eq("profile_id", profileId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Process data by day
    const viewsByDay = groupByDay(viewsData || [], startDate, endDate, "views")
    const likesByDay = groupByDay(likesData || [], startDate, endDate, "likes")

    // Get recent visitors (unique visitor_ids)
    const { data: recentVisitors } = await supabase
      .from("profile_views")
      .select("visitor_id, created_at")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Count unique visitors
    const uniqueVisitors = new Set(viewsData?.map((item) => item.visitor_id)).size || 0

    return {
      success: true,
      analytics: {
        totalViews: totalViews || 0,
        totalLikes: totalLikes || 0,
        viewsByDay,
        likesByDay,
        uniqueVisitors,
        recentVisitors: recentVisitors || [],
        engagementRate: totalViews > 0 ? (totalLikes / totalViews) * 100 : 0,
      },
    }
  } catch (error) {
    console.error("Error in getProfileAnalytics:", error)
    return { success: false, error, analytics: null }
  }
}

// Helper to group data by day
function groupByDay(data: any[], startDate: Date, endDate: Date, valueKey: string) {
  const result: any[] = []
  const countsByDate: Record<string, number> = {}

  // Count occurrences by date
  data.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split("T")[0]
    countsByDate[date] = (countsByDate[date] || 0) + 1
  })

  // Fill in all dates in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]
    const dateObj: any = { date: dateStr }
    dateObj[valueKey] = countsByDate[dateStr] || 0
    result.push(dateObj)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}
