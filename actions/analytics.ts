"use server"

import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Function to get or create visitor ID
function getVisitorId() {
  const cookieStore = cookies()
  let visitorId = cookieStore.get("visitor_id")?.value

  if (!visitorId) {
    visitorId = uuidv4()
    // In a real implementation, you would set a cookie here
    // cookieStore.set('visitor_id', visitorId, { maxAge: 60 * 60 * 24 * 365 }) // 1 year
  }

  return visitorId
}

// Track profile view
export async function trackProfileView(username: string) {
  try {
    const visitorId = getVisitorId()

    // Check if this visitor has already viewed this profile recently
    const { data: existingView } = await supabase
      .from("profile_views")
      .select("*")
      .eq("username", username)
      .eq("visitor_id", visitorId)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .single()

    if (existingView) {
      // Already viewed recently, don't count as a new view
      return { success: true, isNewView: false, viewCount: null }
    }

    // Record new view
    await supabase.from("profile_views").insert({
      username,
      visitor_id: visitorId,
    })

    // Get updated view count
    const { data: viewStats } = await supabase
      .from("profile_stats")
      .select("view_count")
      .eq("username", username)
      .single()

    // Update profile stats
    if (viewStats) {
      await supabase
        .from("profile_stats")
        .update({ view_count: viewStats.view_count + 1 })
        .eq("username", username)

      return { success: true, isNewView: true, viewCount: viewStats.view_count + 1 }
    } else {
      // Create profile stats if it doesn't exist
      await supabase.from("profile_stats").insert({ username, view_count: 1, like_count: 0 })

      return { success: true, isNewView: true, viewCount: 1 }
    }
  } catch (error) {
    console.error("Error tracking profile view:", error)
    return { success: false, error: "Failed to track view" }
  }
}

// Toggle like status
export async function toggleProfileLike(username: string) {
  try {
    const visitorId = getVisitorId()

    // Check if this visitor has already liked this profile
    const { data: existingLike } = await supabase
      .from("profile_likes")
      .select("*")
      .eq("username", username)
      .eq("visitor_id", visitorId)
      .single()

    if (existingLike) {
      // Unlike
      await supabase.from("profile_likes").delete().eq("id", existingLike.id)

      // Get current like count
      const { data: likeStats } = await supabase
        .from("profile_stats")
        .select("like_count")
        .eq("username", username)
        .single()

      if (likeStats && likeStats.like_count > 0) {
        // Decrement like count
        await supabase
          .from("profile_stats")
          .update({ like_count: likeStats.like_count - 1 })
          .eq("username", username)

        return { success: true, isLiked: false, likeCount: likeStats.like_count - 1 }
      }

      return { success: true, isLiked: false, likeCount: 0 }
    } else {
      // Like
      await supabase.from("profile_likes").insert({
        username,
        visitor_id: visitorId,
      })

      // Get current like count
      const { data: likeStats } = await supabase
        .from("profile_stats")
        .select("like_count")
        .eq("username", username)
        .single()

      if (likeStats) {
        // Increment like count
        await supabase
          .from("profile_stats")
          .update({ like_count: likeStats.like_count + 1 })
          .eq("username", username)

        return { success: true, isLiked: true, likeCount: likeStats.like_count + 1 }
      } else {
        // Create profile stats if it doesn't exist
        await supabase.from("profile_stats").insert({ username, view_count: 0, like_count: 1 })

        return { success: true, isLiked: true, likeCount: 1 }
      }
    }
  } catch (error) {
    console.error("Error toggling profile like:", error)
    return { success: false, error: "Failed to update like status" }
  }
}

// Get profile stats
export async function getProfileStats(username: string) {
  try {
    const visitorId = getVisitorId()

    // Get profile stats
    const { data: stats } = await supabase
      .from("profile_stats")
      .select("view_count, like_count")
      .eq("username", username)
      .single()

    // Check if visitor has liked this profile
    const { data: existingLike } = await supabase
      .from("profile_likes")
      .select("*")
      .eq("username", username)
      .eq("visitor_id", visitorId)
      .single()

    return {
      success: true,
      viewCount: stats?.view_count || 0,
      likeCount: stats?.like_count || 0,
      isLiked: !!existingLike,
    }
  } catch (error) {
    console.error("Error getting profile stats:", error)
    return {
      success: false,
      viewCount: 0,
      likeCount: 0,
      isLiked: false,
      error: "Failed to get profile stats",
    }
  }
}
