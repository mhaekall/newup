import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types"
import { ProfileSchema } from "@/lib/schemas"
import { AppError, ErrorCodes, handleSupabaseError } from "@/lib/errors"
import { formatUrl } from "@/lib/utils"

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

/**
 * Get profile by username
 * @param username The username to look up
 * @returns The profile or null if not found
 */
export async function getProfileByUsername(username: string) {
  try {
    if (!username) {
      throw new AppError("Username is required", 400, ErrorCodes.VALIDATION_ERROR)
    }

    // Fetch the profile data
    const { data: profiles, error: profileError } = await supabase.from("profiles").select("*").eq("username", username)

    if (profileError) {
      throw handleSupabaseError(profileError)
    }

    if (!profiles || profiles.length === 0) {
      return null
    }

    // Use the first profile if multiple are found (shouldn't happen with unique usernames)
    const profile = profiles[0]

    // Ensure all arrays have default values if they're null
    const formattedProfile = {
      ...profile,
      links: profile.links || [],
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      projects: profile.projects || [],
    }

    return formattedProfile
  } catch (error) {
    console.error("Error fetching profile by username:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError("Failed to fetch profile", 500, ErrorCodes.SERVER_ERROR, error)
  }
}

/**
 * Get profile by user ID
 * @param userId The user ID to look up
 * @returns The profile or null if not found
 */
export async function getProfileByUserId(userId: string) {
  try {
    if (!userId) {
      throw new AppError("User ID is required", 400, ErrorCodes.VALIDATION_ERROR)
    }

    const { data: profiles, error } = await supabase.from("profiles").select("*").eq("user_id", userId)

    if (error) {
      throw handleSupabaseError(error)
    }

    if (!profiles || profiles.length === 0) {
      return null
    }

    // Use the first profile if multiple are found (shouldn't happen with unique user IDs)
    const profile = profiles[0]

    // Ensure all arrays have default values if they're null
    const formattedProfile = {
      ...profile,
      links: profile.links || [],
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      projects: profile.projects || [],
    }

    return formattedProfile
  } catch (error) {
    console.error("Error fetching profile by user ID:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError("Failed to fetch profile", 500, ErrorCodes.SERVER_ERROR, error)
  }
}

/**
 * Create or update a profile
 * @param profileData The profile data to save
 * @returns The saved profile
 */
export async function updateProfile(profileData: any) {
  try {
    console.log("Updating profile with data:", JSON.stringify(profileData, null, 2))

    // Validate the profile data against our schema
    const validationResult = ProfileSchema.safeParse(profileData)

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error)
      throw new AppError(
        `Invalid profile data: ${validationResult.error.message}`,
        400,
        ErrorCodes.VALIDATION_ERROR,
        validationResult.error,
      )
    }

    const profile = validationResult.data

    // Ensure we have all required fields
    if (!profile.username) {
      throw new AppError("Username is required", 400, ErrorCodes.VALIDATION_ERROR)
    }

    if (!profile.user_id) {
      throw new AppError("User ID is required", 400, ErrorCodes.VALIDATION_ERROR)
    }

    // Check if a profile with this username already exists
    if (!profile.id) {
      // This is a new profile, check if username is taken
      const { data: existingProfiles, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", profile.username)

      if (error) {
        throw handleSupabaseError(error)
      }

      // If we found a profile with this username
      if (existingProfiles && existingProfiles.length > 0) {
        throw new AppError(`Username '${profile.username}' is already taken`, 409, ErrorCodes.CONFLICT)
      }
    } else {
      // This is an existing profile, first get the current profile
      const { data: currentProfiles, error: currentProfileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", profile.id)

      if (currentProfileError) {
        throw handleSupabaseError(currentProfileError)
      }

      if (!currentProfiles || currentProfiles.length === 0) {
        throw new AppError("Profile not found", 404, ErrorCodes.NOT_FOUND)
      }

      const currentProfile = currentProfiles[0]

      // Only check for username conflicts if the username has changed
      if (currentProfile.username !== profile.username) {
        // Check if the new username is taken by another profile
        const { data: existingProfiles, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", profile.username)
          .neq("id", profile.id)

        if (error) {
          throw handleSupabaseError(error)
        }

        if (existingProfiles && existingProfiles.length > 0) {
          throw new AppError(`Username '${profile.username}' is already taken`, 409, ErrorCodes.CONFLICT)
        }
      }
    }

    // Process links to ensure URLs have proper format
    if (profile.links && profile.links.length > 0) {
      profile.links = profile.links.map((link: any) => ({
        ...link,
        url: formatUrl(link.url),
      }))
    }

    // Prepare the data for upsert
    const profileToSave = {
      id: profile.id || undefined, // If id is null/undefined, Supabase will generate one
      user_id: profile.user_id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio || "",
      template_id: profile.template_id || "template1",
      profile_image: profile.profile_image || null,
      banner_image: profile.banner_image || null,
      links: profile.links || [],
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      projects: profile.projects || [],
    }

    console.log("Saving profile:", JSON.stringify(profileToSave, null, 2))

    // Update or insert the profile data
    const { data: savedProfiles, error: profileError } = await supabase.from("profiles").upsert(profileToSave).select()

    if (profileError) {
      console.error("Error saving profile:", profileError)
      throw handleSupabaseError(profileError)
    }

    if (!savedProfiles || savedProfiles.length === 0) {
      throw new AppError("Failed to save profile", 500, ErrorCodes.SERVER_ERROR)
    }

    console.log("Profile saved successfully:", savedProfiles[0])
    return savedProfiles[0]
  } catch (error) {
    console.error("Error in updateProfile:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError("Failed to update profile", 500, ErrorCodes.SERVER_ERROR, error)
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
