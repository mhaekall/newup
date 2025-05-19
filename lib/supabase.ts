import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database, Profile } from "@/types"
import { AppError, ErrorCodes, handleSupabaseError } from "@/lib/errors"
import { ProfileService } from "./services/profile-service"
import { ProfileViewService } from "./services/profile-view-service"

// Export createClient as a named export
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Initialize Supabase client as a singleton
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClient()
  return supabaseInstance
}

// Export the singleton instance
export const supabase = getSupabaseClient()

// Create a Supabase client
// const supabase = createClient()

// Get profile by username
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    console.log(`Fetching profile for username: ${username}`)

    const profileService = new ProfileService()
    return await profileService.getProfileByUsername(username)
  } catch (error: any) {
    console.error("Error in getProfileByUsername:", error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }
}

// Get profile by user ID
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  try {
    console.log(`Fetching profile for user ID: ${userId}`)

    const profileService = new ProfileService()
    return await profileService.getProfileByUserId(userId)
  } catch (error: any) {
    console.error("Error in getProfileByUserId:", error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }
}

// Update profile
export async function updateProfile(profile: Profile): Promise<Profile> {
  try {
    console.log(`Updating profile for user ID: ${profile.user_id}`)

    const profileService = new ProfileService()
    return await profileService.updateProfile(profile)
  } catch (error: any) {
    console.error("Error in updateProfile:", error)
    throw new Error(`Failed to update profile: ${error.message}`)
  }
}

// Validate username
export async function validateUsername(
  username: string,
  currentUserId: string,
): Promise<{ available: boolean; message?: string }> {
  try {
    console.log(`Validating username: ${username}`)

    const profileService = new ProfileService()
    return await profileService.isUsernameAvailable(username, currentUserId)
  } catch (error: any) {
    console.error("Error in validateUsername:", error)
    throw new Error(`Failed to validate username: ${error.message}`)
  }
}

/**
 * Get all profiles
 * @returns Array of all profiles
 */
export async function getAllProfiles() {
  try {
    const { data, error } = await supabase.from("profiles").select("*")

    if (error) {
      throw handleSupabaseError(error)
    }

    if (!data) return []

    // Ensure all arrays have default values if they're null
    const formattedProfiles = data.map((profile) => ({
      ...profile,
      links: profile.links || [],
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      projects: profile.projects || [],
    }))

    return formattedProfiles
  } catch (error) {
    console.error("Error fetching profiles:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError("Failed to fetch profiles", 500, ErrorCodes.SERVER_ERROR, error)
  }
}

/**
 * Record a profile view
 * @param profileId The ID of the profile being viewed
 * @param visitorId A unique identifier for the visitor
 * @returns Whether a new view was recorded
 */
export async function recordProfileView(profileId: string, visitorId: string): Promise<boolean> {
  try {
    console.log(`Recording profile view for profile ID: ${profileId} from visitor: ${visitorId}`)

    const profileViewService = new ProfileViewService()
    return await profileViewService.recordProfileView(profileId, visitorId)
  } catch (error: any) {
    console.error("Error in recordProfileView:", error)
    return false
  }
}

/**
 * Get the total number of views for a profile
 * @param profileId The ID of the profile
 * @returns The total number of views
 */
export async function getProfileViewCount(profileId: string): Promise<number> {
  try {
    console.log(`Getting view count for profile ID: ${profileId}`)

    const profileViewService = new ProfileViewService()
    return await profileViewService.getProfileViewCount(profileId)
  } catch (error: any) {
    console.error("Error in getProfileViewCount:", error)
    return 0
  }
}
