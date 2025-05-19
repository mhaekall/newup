import { supabase } from "@/lib/supabase"
import { AppError, ErrorCodes, handleSupabaseError } from "@/lib/errors"

export class ProfileViewService {
  /**
   * Record a new profile view
   * @param profileId The ID of the profile being viewed
   * @param visitorId A unique identifier for the visitor (can be IP or session ID)
   * @returns The created profile view record
   */
  async recordProfileView(profileId: string, visitorId: string): Promise<boolean> {
    try {
      // Check if this visitor has viewed this profile in the last 24 hours
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      const { data: existingViews } = await supabase
        .from("profile_views")
        .select("*")
        .eq("profile_id", profileId)
        .eq("visitor_id", visitorId)
        .gte("created_at", oneDayAgo.toISOString())
        .limit(1)

      // If the visitor has already viewed the profile in the last 24 hours, don't record a new view
      if (existingViews && existingViews.length > 0) {
        return false
      }

      // Record the new view
      const { error } = await supabase.from("profile_views").insert({
        profile_id: profileId,
        visitor_id: visitorId,
        created_at: new Date().toISOString(),
        created_date: new Date().toISOString().split("T")[0],
      })

      if (error) {
        throw handleSupabaseError(error)
      }

      return true
    } catch (error) {
      console.error("Error recording profile view:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to record profile view", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Get the total number of views for a profile
   * @param profileId The ID of the profile
   * @returns The total number of views
   */
  async getProfileViewCount(profileId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profileId)

      if (error) {
        throw handleSupabaseError(error)
      }

      return count || 0
    } catch (error) {
      console.error("Error getting profile view count:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to get profile view count", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }

  /**
   * Get the number of unique visitors for a profile
   * @param profileId The ID of the profile
   * @returns The number of unique visitors
   */
  async getUniqueVisitorCount(profileId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from("profile_views")
        .select("visitor_id")
        .eq("profile_id", profileId)
        .limit(1000)

      if (error) {
        throw handleSupabaseError(error)
      }

      // Count unique visitor IDs
      const uniqueVisitors = new Set(data.map((view) => view.visitor_id))
      return uniqueVisitors.size
    } catch (error) {
      console.error("Error getting unique visitor count:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to get unique visitor count", 500, ErrorCodes.SERVER_ERROR, error)
    }
  }
}
