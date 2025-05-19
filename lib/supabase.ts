import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import type { Database } from "@/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey)

// Add createClient export
export function createClient() {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey)
}

export async function getProfileByUsername(username: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
}

export async function getProfileByUserId(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching profile by user ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
}

export async function updateProfile(profile: any) {
  try {
    const { data, error } = await supabase.from("profiles").upsert(profile).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Unexpected error:", error)
    throw error
  }
}

export async function validateUsername(username: string, currentUserId: string) {
  try {
    // Cek apakah username sudah digunakan
    let query = supabase.from("profiles").select("id, user_id").eq("username", username)

    // Jika ada currentUserId, exclude profile milik user tersebut
    if (currentUserId) {
      query = query.neq("user_id", currentUserId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error("Error checking username:", error)
      return { available: false, message: "Failed to check username" }
    }

    // Jika data ada, username sudah digunakan oleh user lain
    const isAvailable = !data

    return { available: isAvailable }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { available: false, message: "An unexpected error occurred" }
  }
}

/**
 * Records a profile view in the database
 * @param profileId The ID of the profile being viewed
 * @param visitorId A unique identifier for the visitor
 * @returns Whether the view was successfully recorded
 */
export async function recordProfileView(profileId: string, visitorId: string): Promise<boolean> {
  try {
    // Check if this visitor has already viewed this profile today
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

    const { data: existingView, error: checkError } = await supabase
      .from("profile_views")
      .select("id")
      .eq("profile_id", profileId)
      .eq("visitor_id", visitorId)
      .eq("created_date", today)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing view:", checkError)
      return false
    }

    // If the visitor has already viewed this profile today, don't record another view
    if (existingView) {
      console.log("Visitor already viewed this profile today")
      return false
    }

    // Record the new view
    const { error: insertError } = await supabase.from("profile_views").insert({
      profile_id: profileId,
      visitor_id: visitorId,
      created_at: new Date().toISOString(),
      created_date: today,
    })

    if (insertError) {
      console.error("Error recording profile view:", insertError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in recordProfileView:", error)
    return false
  }
}

/**
 * Gets the total view count for a profile
 * @param profileId The ID of the profile
 * @returns The total number of views
 */
export async function getProfileViewCount(profileId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)

    if (error) {
      console.error("Error getting profile view count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getProfileViewCount:", error)
    return 0
  }
}
