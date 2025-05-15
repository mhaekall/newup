"use server"

import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Function to get or create a visitor ID
const getVisitorId = () => {
  const cookieStore = cookies()
  let visitorId = cookieStore.get("visitor_id")?.value

  if (!visitorId) {
    visitorId = uuidv4()
    cookieStore.set("visitor_id", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  return visitorId
}

// Record a profile view
export async function recordProfileView(username: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Get profile ID from username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (profileError || !profileData) {
      console.error("Error fetching profile:", profileError)
      return { success: false, error: "Profile not found" }
    }

    const profileId = profileData.id

    // Insert view record
    const { error } = await supabase
      .from("profile_views")
      .insert({
        profile_id: profileId,
        visitor_id: visitorId,
      })
      .select()

    if (error && error.code !== "23505") {
      // Ignore unique constraint violations
      console.error("Error recording view:", error)
      return { success: false, error: error.message }
    }

    // Update stats
    await supabase.rpc("increment_profile_views", {
      profile_id_param: profileId,
    })

    // Get updated stats
    const { data: stats, error: statsError } = await supabase
      .from("profile_stats")
      .select("view_count, like_count")
      .eq("profile_id", profileId)
      .single()

    if (statsError) {
      console.error("Error fetching stats:", statsError)
      return { success: true, stats: null }
    }

    return {
      success: true,
      stats: {
        views: stats?.view_count || 0,
        likes: stats?.like_count || 0,
      },
    }
  } catch (error) {
    console.error("Error in recordProfileView:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Toggle like status
export async function toggleProfileLike(username: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Get profile ID from username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (profileError || !profileData) {
      console.error("Error fetching profile:", profileError)
      return { success: false, error: "Profile not found" }
    }

    const profileId = profileData.id

    // Check if already liked
    const { data: existingLike, error: likeCheckError } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    if (likeCheckError) {
      console.error("Error checking like status:", likeCheckError)
      return { success: false, error: likeCheckError.message }
    }

    let action: "added" | "removed" = "added"

    if (existingLike) {
      // Unlike
      const { error: unlikeError } = await supabase.from("profile_likes").delete().eq("id", existingLike.id)

      if (unlikeError) {
        console.error("Error removing like:", unlikeError)
        return { success: false, error: unlikeError.message }
      }

      // Decrement like count
      await supabase.rpc("decrement_profile_likes", {
        profile_id_param: profileId,
      })

      action = "removed"
    } else {
      // Like
      const { error: likeError } = await supabase.from("profile_likes").insert({
        profile_id: profileId,
        visitor_id: visitorId,
      })

      if (likeError) {
        console.error("Error adding like:", likeError)
        return { success: false, error: likeError.message }
      }

      // Increment like count
      await supabase.rpc("increment_profile_likes", {
        profile_id_param: profileId,
      })
    }

    // Get updated stats
    const { data: stats, error: statsError } = await supabase
      .from("profile_stats")
      .select("view_count, like_count")
      .eq("profile_id", profileId)
      .single()

    if (statsError) {
      console.error("Error fetching stats:", statsError)
      return {
        success: true,
        liked: action === "added",
        stats: null,
      }
    }

    return {
      success: true,
      liked: action === "added",
      stats: {
        views: stats?.view_count || 0,
        likes: stats?.like_count || 0,
      },
    }
  } catch (error) {
    console.error("Error in toggleProfileLike:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Check if user has liked a profile
export async function checkProfileLikeStatus(username: string) {
  try {
    const supabase = createClient()
    const visitorId = getVisitorId()

    // Get profile ID from username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (profileError || !profileData) {
      console.error("Error fetching profile:", profileError)
      return { success: false, error: "Profile not found" }
    }

    const profileId = profileData.id

    // Check if already liked
    const { data: existingLike, error: likeCheckError } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    if (likeCheckError) {
      console.error("Error checking like status:", likeCheckError)
      return { success: false, error: likeCheckError.message }
    }

    // Get stats
    const { data: stats, error: statsError } = await supabase
      .from("profile_stats")
      .select("view_count, like_count")
      .eq("profile_id", profileId)
      .single()

    if (statsError) {
      console.error("Error fetching stats:", statsError)
      return {
        success: true,
        liked: !!existingLike,
        stats: null,
      }
    }

    return {
      success: true,
      liked: !!existingLike,
      stats: {
        views: stats?.view_count || 0,
        likes: stats?.like_count || 0,
      },
    }
  } catch (error) {
    console.error("Error in checkProfileLikeStatus:", error)
    return { success: false, error: "Internal server error" }
  }
}
