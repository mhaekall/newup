import { createClient } from "@/lib/supabaseClient"
import type { Profile } from "@/types"

export class ProfileService {
  async getProfileByUsername(username: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return null
    }

    return data as Profile
  }

  async getProfileById(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile by ID:", error)
      return null
    }

    return data as Profile
  }

  async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const supabase = createClient()

    // Check if username is already taken
    if (profile.username) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", profile.username)
        .single()

      if (existingProfile) {
        throw new Error("Username is already taken")
      }
    }

    const { data, error } = await supabase.from("profiles").insert([profile]).select().single()

    if (error) {
      console.error("Error creating profile:", error)
      return null
    }

    return data as Profile
  }

  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile | null> {
    const supabase = createClient()

    // If username is being updated, check if it's already taken by someone else
    if (profile.username) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", profile.username)
        .single()

      // If username exists and belongs to a different user
      if (existingProfile && existingProfile.id !== userId) {
        throw new Error("Username is already taken")
      }
    }

    const { data, error } = await supabase.from("profiles").update(profile).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      return null
    }

    return data as Profile
  }

  async deleteProfile(userId: string): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting profile:", error)
      return false
    }

    return true
  }

  async validateUsername(username: string, userId?: string): Promise<boolean> {
    const supabase = createClient()

    // Check if username is valid format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
      return false
    }

    // Check if username is already taken
    const query = supabase.from("profiles").select("id").eq("username", username)

    // If userId is provided, exclude that user from the check
    // This allows a user to keep their existing username
    const { data, error } = userId ? await query.neq("id", userId) : await query

    if (error) {
      console.error("Error validating username:", error)
      return false
    }

    // Username is valid if no other user has it
    return data.length === 0
  }
}

export async function updateUserImage(userId: string, imageUrl: string): Promise<boolean> {
  try {
    const profileService = new ProfileService()
    const result = await profileService.updateProfile(userId, {
      profileImage: imageUrl,
      updatedAt: new Date().toISOString(),
    })
    return !!result
  } catch (error) {
    console.error("Error updating user image:", error)
    return false
  }
}

export default ProfileService
