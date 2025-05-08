import { supabase } from "../supabase"
import { AppError, ErrorCodes } from "../errors"
import type { Profile } from "@/types"
import { supabaseClient } from "../supabaseClient"
import { getProfileByUserId, updateProfile as updateProfileFunc } from "@/lib/supabase"

/**
 * Service untuk mengakses dan memanipulasi data profil
 */
export class ProfileService {
  /**
   * Mendapatkan profil berdasarkan username
   */
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      // Ambil data profil
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)

      if (profileError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profile: ${profileError.message}`, 500)
      }

      if (!profiles || profiles.length === 0) return null

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
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
    }
  }

  /**
   * Mendapatkan profil berdasarkan user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      // Ambil data profil
      const { data: profiles, error: profileError } = await supabase.from("profiles").select("*").eq("user_id", userId)

      if (profileError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profile: ${profileError.message}`, 500)
      }

      if (!profiles || profiles.length === 0) return null

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
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
    }
  }

  /**
   * Menyimpan atau memperbarui profil
   */
  static async saveProfile(profile: Profile): Promise<Profile> {
    try {
      // Validasi data profil
      if (!profile.username) {
        throw new AppError(ErrorCodes.VALIDATION_ERROR, "Username is required", 400)
      }

      if (!profile.name) {
        throw new AppError(ErrorCodes.VALIDATION_ERROR, "Name is required", 400)
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
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error checking username: ${error.message}`, 500)
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
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profile: ${currentProfileError.message}`, 500)
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
            throw new AppError(ErrorCodes.DATABASE_ERROR, `Error checking username: ${error.message}`, 500)
          }

          if (existingProfiles && existingProfiles.length > 0) {
            throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
          }
        }
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
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving profile: ${profileError.message}`, 500)
      }

      if (!savedProfiles || savedProfiles.length === 0) {
        throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to save profile", 500)
      }

      return savedProfiles[0]
    } catch (error) {
      console.error("Error in saveProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to save profile", 500)
    }
  }

  /**
   * Menghapus profil
   */
  static async deleteProfile(profileId: string): Promise<boolean> {
    try {
      // Hapus profil
      const { error } = await supabase.from("profiles").delete().eq("id", profileId)

      if (error) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error deleting profile: ${error.message}`, 500)
      }

      return true
    } catch (error) {
      console.error("Error in deleteProfile:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to delete profile", 500)
    }
  }

  /**
   * Mendapatkan semua profil
   */
  static async getAllProfiles(): Promise<Profile[]> {
    try {
      const { data: profiles, error } = await supabase.from("profiles").select("*")

      if (error) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profiles: ${error.message}`, 500)
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
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profiles", 500)
    }
  }

  /**
   * Get the profile for the current user
   */
  static async getCurrentUserProfile(userId: string): Promise<Profile | null> {
    try {
      if (!userId) {
        throw new AppError(ErrorCodes.UNAUTHORIZED, "User ID is required", 401)
      }

      const profile = await getProfileByUserId(userId)
      return profile
    } catch (error) {
      console.error("Error in getCurrentUserProfile:", error)
      throw error
    }
  }

  /**
   * Update the profile for the current user
   */
  static async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    try {
      if (!userId) {
        throw new AppError(ErrorCodes.UNAUTHORIZED, "User ID is required", 401)
      }

      // Get the current profile
      const currentProfile = await getProfileByUserId(userId)

      // If profile doesn't exist, create a new one
      if (!currentProfile) {
        // Ensure required fields are present
        if (!profileData.username) {
          throw new AppError(ErrorCodes.VALIDATION_ERROR, "Username is required", 400)
        }
        if (!profileData.name) {
          throw new AppError(ErrorCodes.VALIDATION_ERROR, "Name is required", 400)
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

        const updatedProfile = await updateProfileFunc(newProfile)
        return updatedProfile
      }

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

      const updatedProfile = await updateProfileFunc(mergedProfile)
      return updatedProfile
    } catch (error) {
      console.error("Error in updateProfile:", error)
      throw error
    }
  }
}

export async function updateUserImage(userId: string, formData: FormData) {
  try {
    // Upload image to storage
    const file = formData.get("image") as File
    if (!file) {
      return { success: false, error: "No image provided" }
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profile-images/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    // Get public URL
    const { data: urlData } = await supabaseClient.storage.from("avatars").getPublicUrl(filePath)

    const imageUrl = urlData.publicUrl

    // Update user profile with new image URL
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ profile_image: imageUrl })
      .eq("user_id", userId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return { success: true, imageUrl }
  } catch (error) {
    console.error("Error updating user image:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
