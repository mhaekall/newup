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

// Get profile by username
export async function getProfileByUsername(username: string) {
  try {
    // Fetch the profile data
    const { data: profiles, error: profileError } = await supabase.from("profiles").select("*").eq("username", username)

    if (profileError) {
      throw handleSupabaseError(profileError)
    }

    if (!profiles || profiles.length === 0) return null

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
    console.error("Error fetching profile:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
  }
}

// Get profile by user ID
export async function getProfileByUserId(userId: string) {
  try {
    const { data: profiles, error } = await supabase.from("profiles").select("*").eq("user_id", userId)

    if (error) {
      throw handleSupabaseError(error)
    }

    if (!profiles || profiles.length === 0) return null

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
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
  }
}

// Update profile
export async function updateProfile(profileData: any) {
  try {
    // Validate the profile data against our schema
    const validationResult = ProfileSchema.safeParse(profileData)

    if (!validationResult.success) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, `Invalid profile data: ${validationResult.error.message}`, 400)
    }

    const profile = validationResult.data

    // Ensure we have all required fields
    if (!profile.username) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, "Username is required", 400)
    }

    // Check if a profile with this username already exists
    // Only check for username conflicts if this is a new profile or if the username has changed
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
        throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
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
        throw new AppError(ErrorCodes.NOT_FOUND, "Profile not found", 404)
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
          throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
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

    // Update or insert the profile data
    const { data: savedProfiles, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: profile.id || undefined,
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
      })
      .select()

    if (profileError) {
      throw handleSupabaseError(profileError)
    }

    if (!savedProfiles || savedProfiles.length === 0) {
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to save profile", 500)
    }

    return savedProfiles[0]
  } catch (error) {
    console.error("Error in updateProfile:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to update profile", 500)
  }
}

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
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profiles", 500)
  }
}
