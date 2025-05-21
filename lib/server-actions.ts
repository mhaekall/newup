"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabaseClient"
import { ProfileService } from "./services/profile-service"

/**
 * Set the language preference in a cookie
 */
export async function setLanguagePreference(language: string) {
  cookies().set("NEXT_LOCALE", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  })

  return { success: true }
}

/**
 * Get the current language preference from cookies
 */
export async function getLanguagePreference() {
  const locale = cookies().get("NEXT_LOCALE")
  return locale?.value || "en"
}

/**
 * Update user profile
 */
export async function updateUserProfile(profile: any) {
  const profileService = new ProfileService()
  return await profileService.updateProfile(profile)
}

/**
 * Validate username
 */
export async function validateUsername(username: string, userId: string) {
  const profileService = new ProfileService()
  return await profileService.isUsernameAvailable(username, userId)
}

/**
 * Update user image
 */
export async function updateUserImageAction(userId: string, formData: FormData) {
  const supabase = createClient()

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

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  // Get public URL
  const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(filePath)

  const imageUrl = urlData.publicUrl

  // Update user profile with new image URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profile_image: imageUrl })
    .eq("user_id", userId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true, imageUrl }
}
