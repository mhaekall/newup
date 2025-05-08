import { createClient } from "@/lib/supabaseClient"
import type { Profile } from "@/types"

export class ProfileService {
  private supabase = createClient()

  async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      console.log(`Fetching profile for username: ${username}`)

      const { data, error } = await this.supabase.from("profiles").select("*").eq("username", username).maybeSingle()

      if (error) {
        console.error("Error fetching profile by username:", error)
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      if (!data) {
        console.log(`No profile found for username: ${username}`)
        return null
      }

      console.log(`Profile found for username: ${username}`)
      return data as Profile
    } catch (error: any) {
      console.error("Error in getProfileByUsername:", error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      console.log(`Fetching profile for user ID: ${userId}`)

      const { data, error } = await this.supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle()

      if (error) {
        console.error("Error fetching profile by user ID:", error)
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      if (!data) {
        console.log(`No profile found for user ID: ${userId}`)
        return null
      }

      console.log(`Profile found for user ID: ${userId}`)
      return data as Profile
    } catch (error: any) {
      console.error("Error in getProfileByUserId:", error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      console.log(`Updating profile for user ID: ${profile.user_id}`)

      // First, check if this user already has a profile
      const existingProfile = await this.getProfileByUserId(profile.user_id)

      // If updating an existing profile, use the existing ID
      if (existingProfile) {
        console.log(`Existing profile found with ID: ${existingProfile.id}`)
        profile.id = existingProfile.id

        // If username is the same as existing, we're just updating other fields
        if (profile.username === existingProfile.username) {
          console.log(`Username unchanged: ${profile.username}`)
        } else {
          // If username is different, check if it's available
          console.log(`Username changed from ${existingProfile.username} to ${profile.username}`)
          const usernameCheck = await this.isUsernameAvailable(profile.username, profile.user_id)
          if (!usernameCheck.available) {
            console.error(`Username ${profile.username} is already taken`)
            throw new Error(`Username '${profile.username}' is already taken. Please choose another username.`)
          }
        }
      } else {
        console.log(`No existing profile found, creating new profile`)
        // For new profiles, check username availability
        const usernameCheck = await this.isUsernameAvailable(profile.username, profile.user_id)
        if (!usernameCheck.available) {
          console.error(`Username ${profile.username} is already taken`)
          throw new Error(`Username '${profile.username}' is already taken. Please choose another username.`)
        }
      }

      // Update or insert the profile
      const { data, error } = await this.supabase
        .from("profiles")
        .upsert(profile, { onConflict: "id" })
        .select()
        .maybeSingle()

      if (error) {
        console.error("Error updating profile:", error)
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      if (!data) {
        console.error("No data returned after profile update")
        throw new Error("Failed to update profile: No data returned")
      }

      console.log(`Profile updated successfully for user ID: ${profile.user_id}`)
      return data as Profile
    } catch (error: any) {
      console.error("Error in updateProfile:", error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }
  }

  async isUsernameAvailable(
    username: string,
    currentUserId: string,
  ): Promise<{ available: boolean; message?: string }> {
    try {
      console.log(`Checking if username ${username} is available`)

      // Check if username is valid
      if (!username || username.trim() === "") {
        return { available: false, message: "Username cannot be empty" }
      }

      // Check if username follows the pattern (letters, numbers, underscore, dash)
      if (!/^[a-z0-9_-]+$/i.test(username)) {
        return {
          available: false,
          message: "Username can only contain letters, numbers, underscores, and dashes",
        }
      }

      // Check if username is already taken by another user
      const { data, error } = await this.supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .maybeSingle()

      if (error) {
        console.error("Error checking username availability:", error)
        throw new Error(`Failed to check username availability: ${error.message}`)
      }

      // If no data, username is available
      if (!data) {
        console.log(`Username ${username} is available`)
        return { available: true }
      }

      // If the username belongs to the current user, it's available for them
      if (data.user_id === currentUserId) {
        console.log(`Username ${username} belongs to the current user`)
        return { available: true }
      }

      // Username is taken by another user
      console.log(`Username ${username} is already taken`)
      return {
        available: false,
        message: `Username '${username}' is already taken. Please choose another username.`,
      }
    } catch (error: any) {
      console.error("Error in isUsernameAvailable:", error)
      throw new Error(`Failed to check username availability: ${error.message}`)
    }
  }
}
