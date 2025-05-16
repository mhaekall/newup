import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get visitor ID from cookies or create a new one
export const getVisitorId = () => {
  const cookieStore = cookies()
  let visitorId = cookieStore.get("visitor_id")?.value

  if (!visitorId) {
    visitorId = uuidv4()
    // Note: In a server component or server action, we can set cookies
  }

  return visitorId
}

// Record a view for a profile
export async function recordProfileView(profileId: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Check if this visitor has viewed this profile in the last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: existingViews } = await supabase
      .from("profile_views")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .gte("created_at", yesterday.toISOString())

    // If no recent view from this visitor, record a new one
    if (!existingViews || existingViews.length === 0) {
      await supabase.from("profile_views").insert({ profile_id: profileId, visitor_id: visitorId })
    }

    // Get total view count
    const { count } = await supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)

    return { success: true, viewCount: count || 0 }
  } catch (error) {
    console.error("Error recording profile view:", error)
    return { success: false, error, viewCount: 0 }
  }
}

// Get profile stats (views, likes)
export async function getProfileStats(username: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Get the profile ID from username
    const { data: profile } = await supabase.from("profiles").select("id").eq("username", username).single()

    if (!profile) {
      return { success: false, error: "Profile not found", stats: null }
    }

    // Get view count
    const { count: viewCount } = await supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id)

    // Get like count and check if the current visitor has liked
    const { count: likeCount } = await supabase
      .from("profile_likes")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id)

    const { data: userLike } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profile.id)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    return {
      success: true,
      stats: {
        profileId: profile.id,
        views: viewCount || 0,
        likes: likeCount || 0,
        isLiked: !!userLike,
      },
    }
  } catch (error) {
    console.error("Error getting profile stats:", error)
    return { success: false, error, stats: null }
  }
}

// Toggle like status for a profile
export async function toggleProfileLike(profileId: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Check if the user has already liked the profile
    const { data: existingLike } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    // If already liked, remove the like
    if (existingLike) {
      await supabase.from("profile_likes").delete().eq("id", existingLike.id)
    } else {
      // Otherwise, add a new like
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
    console.error("Error toggling profile like:", error)
    return { success: false, error, isLiked: false, likeCount: 0 }
  }
}
