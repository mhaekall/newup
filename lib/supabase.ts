import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types"

// Initialize Supabase client as a singleton
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Export the singleton instance
export const supabase = getSupabaseClient()

// Profile-related functions
export async function getProfileByUsername(username: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

// Get profile by user ID
export async function getProfileByUserId(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

// Update the updateProfile function to provide better error handling
export async function updateProfile(profile: any) {
  try {
    // Ensure we have all required fields
    if (!profile.username) {
      throw new Error("Username is required")
    }

    // Check if a profile with this username already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", profile.username)
      .single()

    // If we found a profile with this username and it's not the current profile being edited
    if (existingProfile && existingProfile.id !== profile.id) {
      throw new Error(`Username '${profile.username}' is already taken`)
    }

    // Perform the upsert operation
    const { data, error } = await supabase.from("profiles").upsert(profile).select().single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in updateProfile:", error)
    throw error
  }
}

export async function getAllProfiles() {
  const { data, error } = await supabase.from("profiles").select("*")

  if (error) {
    console.error("Error fetching profiles:", error)
    return []
  }

  return data
}
