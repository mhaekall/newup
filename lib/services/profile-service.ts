import { supabase } from "../supabase"
import { AppError, ErrorCodes, handleSupabaseError } from "../errors"
import type { Profile } from "@/types"
import { supabaseClient } from "../supabaseClient"
import { getProfileByUserId, updateProfile as updateProfileFunc } from "@/lib/supabase"

/**
 * Service for accessing and manipulating profile data
 */
export class ProfileService {
  /**
   * Get profile by username
   */
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      if (!username) {
        throw new AppError("Username is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      // Get profile data
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)

      if (profileError) {
        throw handleSupabaseError(profileError)
      }

      if (!profiles || profiles.length === 0) {
        return null
      }

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
      console.error("Error in getProfileByUsername:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to fetch profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Get profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      if (!userId) {
        throw new AppError("User ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      // Get profile data
      const { data: profiles, error: profileError } = await supabase.from("profiles").select("*").eq("user_id", userId)

      if (profileError) {
        throw handleSupabaseError(profileError)
      }

      if (!profiles || profiles.length === 0) {
        return null
      }

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
      console.error("Error in getProfileByUserId:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to fetch profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Save or update profile
   */
  static async saveProfile(profile: Profile): Promise<Profile> {
    try {
      console.log("ProfileService.saveProfile called with:", JSON.stringify(profile, null, 2))

      // Validate profile data
      if (!profile.username) {
        throw new AppError("Username is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      if (!profile.name) {
        throw new AppError("Name is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      if (!profile.user_id) {
        throw new AppError("User ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      // Use the updateProfile function to save the profile
      const savedProfile = await updateProfileFunc(profile)
      return savedProfile
    } catch (error) {
      console.error("Error in saveProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to save profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Delete profile
   */
  static async deleteProfile(profileId: string): Promise<boolean> {
    try {
      if (!profileId) {
        throw new AppError("Profile ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      }

      // Delete profile
      const { error } = await supabase.from("profiles").delete().eq("id", profileId)

      if (error) {
        throw handleSupabaseError(error)
      }

      return true
    } catch (error) {
      console.error("Error in deleteProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to delete profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Get all profiles
   */
  static async getAllProfiles(): Promise<Profile[]> {
    try {
      const { data: profiles, error } = await supabase.from("profiles").select("*")

      if (error) {
        throw handleSupabaseError(error)
      }

      if (!profiles) return []

      // Ensure all arrays have default values if they're null
      const formattedProfiles = profiles.map((profile) => ({
        ...profile,
        links: profile.links || [],
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || [],
        projects: profile.projects || [],
      }))

      return formattedProfiles
    } catch (error) {
      console.error("Error in getAllProfiles:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to fetch profiles", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Get the profile for the current user
   */
  static async getCurrentUserProfile(userId: string): Promise<Profile | null> {
    try {
      if (!userId) {
        throw new AppError("User ID is required", 401, ErrorCodes.UNAUTHORIZED)
      }

      const profile = await getProfileByUserId(userId)
      return profile
    } catch (error) {
      console.error("Error in getCurrentUserProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to fetch current user profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Update the profile for the current user
   */
  static async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    try {
      console.log(
        "ProfileService.updateProfile called with userId:",
        userId,
        "and data:",
        JSON.stringify(profileData, null, 2),
      )

      if (!userId) {
        throw new AppError("User ID is required", 401, ErrorCodes.UNAUTHORIZED)
      }

      // Get the current profile
      const currentProfile = await getProfileByUserId(userId)

      // If profile doesn't exist, create a new one
      if (!currentProfile) {
        console.log("No existing profile found, creating new profile")

        // Ensure required fields are present
        if (!profileData.username) {
          throw new AppError("Username is required", 400, ErrorCodes.VALIDATION_ERROR)
        }
        if (!profileData.name) {
          throw new AppError("Name is required", 400, ErrorCodes.VALIDATION_ERROR)
        }

        // Create a new profile
        const newProfile = {
          user_id: userId,
          username: profileData.username,
          name: profileData.name,
          bio: profileData.bio || "",
          links: profileData.links || [],
          education: profileData.education || [],
          experience: profileData.experience || [],
          skills: profileData.skills || [],
          projects: profileData.projects || [],
          ...profileData,
        }

        console.log("Creating new profile:", JSON.stringify(newProfile, null, 2))
        const updatedProfile = await updateProfileFunc(newProfile)
        return updatedProfile
      }

      console.log("Existing profile found:", JSON.stringify(currentProfile, null, 2))

      // Merge the current profile with the new data
      const mergedProfile = {
        ...currentProfile,
        ...profileData,
        // Ensure arrays are properly merged or replaced
        links: profileData.links !== undefined ? profileData.links : currentProfile.links || [],
        education: profileData.education !== undefined ? profileData.education : currentProfile.education || [],
        experience: profileData.experience !== undefined ? profileData.experience : currentProfile.experience || [],
        skills: profileData.skills !== undefined ? profileData.skills : currentProfile.skills || [],
        projects: profileData.projects !== undefined ? profileData.projects : currentProfile.projects || [],
      }

      console.log("Updating profile with merged data:", JSON.stringify(mergedProfile, null, 2))
      const updatedProfile = await updateProfileFunc(mergedProfile)
      return updatedProfile
    } catch (error) {
      console.error("Error in updateProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to update profile", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }
}

/**
 * Update user profile image
 */
export async function updateUserImage(userId: string, formData: FormData) {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" }
    }

    // Upload image to storage
    const file = formData.get("image") as File
    if (!file) {
      return { success: false, error: "No image provided" }
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profile-images/${fileName}`

    console.log(`Uploading image for user ${userId} to path ${filePath}`)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      throw new Error(uploadError.message)
    }

    // Get public URL
    const { data: urlData } = await supabaseClient.storage.from("avatars").getPublicUrl(filePath)

    const imageUrl = urlData.publicUrl
    console.log(`Image uploaded successfully. Public URL: ${imageUrl}`)

    // Update user profile with new image URL
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ profile_image: imageUrl })
      .eq("user_id", userId)

    if (updateError) {
      console.error("Error updating profile with image URL:", updateError)
      throw new Error(updateError.message)
    }

    console.log(`Profile updated with new image URL for user ${userId}`)
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Error updating user image:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
