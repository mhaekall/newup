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

// Profile-related functions
export async function getProfileByUsername(username: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null
      }
      throw handleSupabaseError(error)
    }

    return data
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

    return data
  } catch (error) {
    console.error("Error fetching profile:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
  }
}

// Update the updateProfile function to provide better error handling and validation
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

      // Log links untuk debugging
      console.log("Formatted links before saving:", profile.links)
    }

    // Perform the upsert operation
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile, {
        onConflict: "id",
        ignoreDuplicates: false,
        returning: "representation",
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase upsert error:", error)
      throw handleSupabaseError(error)
    }

    console.log("Profile saved successfully:", data)
    return data
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

    return data
  } catch (error) {
    console.error("Error fetching profiles:", error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profiles", 500)
  }
}
