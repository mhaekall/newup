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
  ensureVisitorId()

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
    const visitorId = ensureVisitorId()
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
      await supabase.from("profile_views").insert({ profile_id: profileId, visitor_id: visitorId })
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
      await supabase.from("profile_likes").delete().eq("id", existingLike.id)
    } else {
      await supabase.from("profile_likes").insert({ profile_id: profileId, visitor_id: visitorId })
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
