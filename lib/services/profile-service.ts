import { supabase } from "../supabase"
import { AppError, ErrorCodes } from "../errors"
import type { Profile } from "@/types"

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
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profile: ${profileError.message}`, 500)
      }

      if (!profile) return null

      // Ambil data links
      const { data: links, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", profile.id)

      if (linksError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching links: ${linksError.message}`, 500)
      }

      // Ambil data education
      const { data: education, error: educationError } = await supabase
        .from("education")
        .select("*")
        .eq("profile_id", profile.id)

      if (educationError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching education: ${educationError.message}`, 500)
      }

      // Ambil data experience
      const { data: experience, error: experienceError } = await supabase
        .from("experience")
        .select("*")
        .eq("profile_id", profile.id)

      if (experienceError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching experience: ${experienceError.message}`, 500)
      }

      // Ambil data skills
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .eq("profile_id", profile.id)

      if (skillsError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching skills: ${skillsError.message}`, 500)
      }

      // Ambil data projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profile.id)

      if (projectsError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching projects: ${projectsError.message}`, 500)
      }

      // Ambil data project technologies
      const { data: projectTechnologies, error: projectTechnologiesError } = await supabase
        .from("project_technologies")
        .select("*")

      if (projectTechnologiesError) {
        throw new AppError(
          ErrorCodes.DATABASE_ERROR,
          `Error fetching project technologies: ${projectTechnologiesError.message}`,
          500
        )
      }

      // Ambil data contact info
      const { data: contactInfo, error: contactInfoError } = await supabase
        .from("contact_info")
        .select("*")
        .eq("profile_id", profile.id)
        .single()

      if (contactInfoError && contactInfoError.code !== "PGRST116") {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching contact info: ${contactInfoError.message}`, 500)
      }

      // Gabungkan technologies dengan projects
      const projectsWithTechnologies = projects.map((project) => {
        const technologies = projectTechnologies
          .filter((tech) => tech.project_id === project.id)
          .map((tech) => tech.technology)
        return { ...project, technologies }
      })

      // Gabungkan semua data
      return {
        ...profile,
        links: links || [],
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        projects: projectsWithTechnologies || [],
        contactInfo: contactInfo || null,
      }
    } catch (error) {
      console.error("Error in getProfileByUsername:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile", 500)
    }
  }
