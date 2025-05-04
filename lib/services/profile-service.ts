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
      const { data: links, error: linksError } = await supabase.from("links").select("*").eq("profile_id", profile.id)

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
          500,
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

  /**
   * Mendapatkan profil berdasarkan user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      // Ambil data profil
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (profileError) {
        if (profileError.code === "PGRST116") {
          // No rows returned
          return null
        }
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error fetching profile: ${profileError.message}`, 500)
      }

      if (!profile) return null

      // Gunakan metode yang sudah ada untuk mendapatkan profil lengkap
      return this.getProfileByUsername(profile.username)
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

      // Cek apakah username sudah digunakan
      if (!profile.id) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", profile.username)
          .single()

        if (existingProfile) {
          throw new AppError(ErrorCodes.CONFLICT, `Username '${profile.username}' is already taken`, 409)
        }
      } else {
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

      // Mulai transaksi
      // Note: Supabase JS client tidak mendukung transaksi, jadi kita akan melakukan operasi secara berurutan

      // 1. Simpan data profil dasar
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
        })
        .select()
        .single()

      if (profileError) {
        throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving profile: ${profileError.message}`, 500)
      }

      const profileId = savedProfile.id

      // 2. Simpan links
      if (profile.links && profile.links.length > 0) {
        // Hapus links lama
        await supabase.from("links").delete().eq("profile_id", profileId)

        // Tambahkan links baru
        const linksToInsert = profile.links.map((link) => ({
          profile_id: profileId,
          label: link.label,
          url: link.url,
          icon: link.icon || "",
        }))

        const { error: linksError } = await supabase.from("links").insert(linksToInsert)

        if (linksError) {
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving links: ${linksError.message}`, 500)
        }
      }

      // 3. Simpan education
      if (profile.education && profile.education.length > 0) {
        // Hapus education lama
        await supabase.from("education").delete().eq("profile_id", profileId)

        // Tambahkan education baru
        const educationToInsert = profile.education.map((edu) => ({
          profile_id: profileId,
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          start_date: edu.startDate,
          end_date: edu.endDate || null,
          description: edu.description || null,
        }))

        const { error: educationError } = await supabase.from("education").insert(educationToInsert)

        if (educationError) {
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving education: ${educationError.message}`, 500)
        }
      }

      // 4. Simpan experience
      if (profile.experience && profile.experience.length > 0) {
        // Hapus experience lama
        await supabase.from("experience").delete().eq("profile_id", profileId)

        // Tambahkan experience baru
        const experienceToInsert = profile.experience.map((exp) => ({
          profile_id: profileId,
          company: exp.company,
          position: exp.position,
          start_date: exp.startDate,
          end_date: exp.endDate || null,
          description: exp.description || null,
          location: exp.location || null,
        }))

        const { error: experienceError } = await supabase.from("experience").insert(experienceToInsert)

        if (experienceError) {
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving experience: ${experienceError.message}`, 500)
        }
      }

      // 5. Simpan skills
      if (profile.skills && profile.skills.length > 0) {
        // Hapus skills lama
        await supabase.from("skills").delete().eq("profile_id", profileId)

        // Tambahkan skills baru
        const skillsToInsert = profile.skills.map((skill) => ({
          profile_id: profileId,
          name: skill.name,
          level: skill.level || 3,
          category: skill.category || "Technical",
        }))

        const { error: skillsError } = await supabase.from("skills").insert(skillsToInsert)

        if (skillsError) {
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving skills: ${skillsError.message}`, 500)
        }
      }

      // 6. Simpan projects dan technologies
      if (profile.projects && profile.projects.length > 0) {
        // Hapus projects lama
        const { data: oldProjects } = await supabase.from("projects").select("id").eq("profile_id", profileId)

        if (oldProjects && oldProjects.length > 0) {
          const oldProjectIds = oldProjects.map((p) => p.id)

          // Hapus technologies terkait
          await supabase.from("project_technologies").delete().in("project_id", oldProjectIds)

          // Hapus projects
          await supabase.from("projects").delete().eq("profile_id", profileId)
        }

        // Tambahkan projects baru
        for (const project of profile.projects) {
          // Insert project
          const { data: savedProject, error: projectError } = await supabase
            .from("projects")
            .insert({
              profile_id: profileId,
              title: project.title,
              description: project.description || null,
              url: project.url || null,
              image: project.image || null,
            })
            .select()
            .single()

          if (projectError) {
            throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving project: ${projectError.message}`, 500)
          }

          // Insert technologies
          if (project.technologies && project.technologies.length > 0) {
            const technologiesToInsert = project.technologies.map((tech) => ({
              project_id: savedProject.id,
              technology: tech,
            }))

            const { error: techError } = await supabase.from("project_technologies").insert(technologiesToInsert)

            if (techError) {
              throw new AppError(
                ErrorCodes.DATABASE_ERROR,
                `Error saving project technologies: ${techError.message}`,
                500,
              )
            }
          }
        }
      }

      // 7. Simpan contact info
      if (profile.contactInfo) {
        // Hapus contact info lama
        await supabase.from("contact_info").delete().eq("profile_id", profileId)

        // Tambahkan contact info baru
        const { error: contactError } = await supabase.from("contact_info").insert({
          profile_id: profileId,
          email: profile.contactInfo.email || null,
          phone: profile.contactInfo.phone || null,
          whatsapp: profile.contactInfo.whatsapp || null,
          telegram: profile.contactInfo.telegram || null,
          website: profile.contactInfo.website || null,
        })

        if (contactError) {
          throw new AppError(ErrorCodes.DATABASE_ERROR, `Error saving contact info: ${contactError.message}`, 500)
        }
      }

      // Ambil profil lengkap yang sudah disimpan
      return this.getProfileByUsername(profile.username) as Promise<Profile>
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
      // Hapus profil (cascade delete akan menghapus data terkait)
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

      return profiles || []
    } catch (error) {
      console.error("Error in getAllProfiles:", error)
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(ErrorCodes.SERVER_ERROR, "Failed to fetch profiles", 500)
    }
  }
}
