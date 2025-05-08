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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single()

    if (profileError) {
      if (profileError.code === "PGRST116") {
        // No rows returned
        return null
      }
      throw handleSupabaseError(profileError)
    }

    if (!profile) return null

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
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      throw handleSupabaseError(error)
    }

    if (!data) return null

    // Ensure all arrays have default values if they're null
    const formattedProfile = {
      ...data,
      links: data.links || [],
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      projects: data.projects || [],
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
    if (!profile.id) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", profile.username)
        .single()

      // If we found a profile with this username and it's not the current profile being edited
      if (existingProfile) {
        throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
      }
    } else {
      // If updating an existing profile, check if username is taken by another profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", profile.username)
        .neq("id", profile.id)
        .single()

      if (existingProfile) {
        throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
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
    const { data: savedProfile, error: profileError } = await supabase
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
      .single()

    if (profileError) {
      throw handleSupabaseError(profileError)
    }

    return savedProfile
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
