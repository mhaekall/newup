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
// Replace the getProfileByUsername function with this updated version
export async function getProfileByUsername(username: string) {
  try {
    // Fetch the basic profile data
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

    // Fetch related data
    const [
      { data: links, error: linksError },
      { data: education, error: educationError },
      { data: experience, error: experienceError },
      { data: skills, error: skillsError },
      { data: projects, error: projectsError },
      { data: contactInfo, error: contactInfoError },
    ] = await Promise.all([
      supabase.from("links").select("*").eq("profile_id", profile.id),
      supabase.from("education").select("*").eq("profile_id", profile.id),
      supabase.from("experience").select("*").eq("profile_id", profile.id),
      supabase.from("skills").select("*").eq("profile_id", profile.id),
      supabase.from("projects").select("*").eq("profile_id", profile.id),
      supabase.from("contact_info").select("*").eq("profile_id", profile.id).maybeSingle(),
    ])

    // Check for errors
    if (linksError) throw handleSupabaseError(linksError)
    if (educationError) throw handleSupabaseError(educationError)
    if (experienceError) throw handleSupabaseError(experienceError)
    if (skillsError) throw handleSupabaseError(skillsError)
    if (projectsError) throw handleSupabaseError(projectsError)
    if (contactInfoError && contactInfoError.code !== "PGRST116") throw handleSupabaseError(contactInfoError)

    // Fetch project technologies for each project
    const projectsWithTechnologies = await Promise.all(
      projects.map(async (project) => {
        const { data: technologies, error: techError } = await supabase
          .from("project_technologies")
          .select("technology")
          .eq("project_id", project.id)

        if (techError) throw handleSupabaseError(techError)

        return {
          ...project,
          technologies: technologies.map((t) => t.technology),
        }
      }),
    )

    // Format the data to match the expected Profile structure
    const formattedProfile = {
      ...profile,
      links: links || [],
      education:
        education.map((edu) => ({
          ...edu,
          startDate: edu.start_date,
          endDate: edu.end_date,
        })) || [],
      experience:
        experience.map((exp) => ({
          ...exp,
          startDate: exp.start_date,
          endDate: exp.end_date,
        })) || [],
      skills: skills || [],
      projects: projectsWithTechnologies || [],
      contactInfo: contactInfo || null,
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
    const { data, error } = await supabase.from("profiles").select("username").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      throw handleSupabaseError(error)
    }

    if (!data) return null

    // Use the existing getProfileByUsername function to get the complete profile
    return getProfileByUsername(data.username)
  } catch (error) {
    console.error("Error fetching profile by user ID:", error)
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
    }

    // Start a transaction by using multiple operations
    // 1. Update or insert the basic profile data
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
      throw handleSupabaseError(profileError)
    }

    const profileId = savedProfile.id

    // 2. Handle links - delete existing and insert new
    if (profile.links && profile.links.length > 0) {
      // Delete existing links
      await supabase.from("links").delete().eq("profile_id", profileId)

      // Insert new links
      const linksToInsert = profile.links.map((link: any) => ({
        profile_id: profileId,
        label: link.label,
        url: link.url,
        icon: link.icon || "",
      }))

      const { error: linksError } = await supabase.from("links").insert(linksToInsert)
      if (linksError) throw handleSupabaseError(linksError)
    }

    // 3. Handle education - delete existing and insert new
    if (profile.education && profile.education.length > 0) {
      // Delete existing education
      await supabase.from("education").delete().eq("profile_id", profileId)

      // Insert new education
      const educationToInsert = profile.education.map((edu: any) => ({
        profile_id: profileId,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        start_date: edu.startDate,
        end_date: edu.endDate || null,
        description: edu.description || null,
      }))

      const { error: educationError } = await supabase.from("education").insert(educationToInsert)
      if (educationError) throw handleSupabaseError(educationError)
    }

    // 4. Handle experience - delete existing and insert new
    if (profile.experience && profile.experience.length > 0) {
      // Delete existing experience
      await supabase.from("experience").delete().eq("profile_id", profileId)

      // Insert new experience
      const experienceToInsert = profile.experience.map((exp: any) => ({
        profile_id: profileId,
        company: exp.company,
        position: exp.position,
        start_date: exp.startDate,
        end_date: exp.endDate || null,
        description: exp.description || null,
        location: exp.location || null,
      }))

      const { error: experienceError } = await supabase.from("experience").insert(experienceToInsert)
      if (experienceError) throw handleSupabaseError(experienceError)
    }

    // 5. Handle skills - delete existing and insert new
    if (profile.skills && profile.skills.length > 0) {
      // Delete existing skills
      await supabase.from("skills").delete().eq("profile_id", profileId)

      // Insert new skills
      const skillsToInsert = profile.skills.map((skill: any) => ({
        profile_id: profileId,
        name: skill.name,
        level: skill.level || 3,
        category: skill.category || "Technical",
      }))

      const { error: skillsError } = await supabase.from("skills").insert(skillsToInsert)
      if (skillsError) throw handleSupabaseError(skillsError)
    }

    // 6. Handle projects and technologies - delete existing and insert new
    if (profile.projects && profile.projects.length > 0) {
      // Get existing projects to delete their technologies
      const { data: existingProjects } = await supabase.from("projects").select("id").eq("profile_id", profileId)

      if (existingProjects && existingProjects.length > 0) {
        // Delete technologies for existing projects
        for (const project of existingProjects) {
          await supabase.from("project_technologies").delete().eq("project_id", project.id)
        }
      }

      // Delete existing projects
      await supabase.from("projects").delete().eq("profile_id", profileId)

      // Insert new projects and their technologies
      for (const project of profile.projects) {
        const { data: newProject, error: projectError } = await supabase
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

        if (projectError) throw handleSupabaseError(projectError)

        // Insert technologies for this project
        if (project.technologies && project.technologies.length > 0) {
          const techsToInsert = project.technologies.map((tech: string) => ({
            project_id: newProject.id,
            technology: tech,
          }))

          const { error: techError } = await supabase.from("project_technologies").insert(techsToInsert)
          if (techError) throw handleSupabaseError(techError)
        }
      }
    }

    // 7. Handle contact info - delete existing and insert new
    if (profile.contactInfo) {
      // Delete existing contact info
      await supabase.from("contact_info").delete().eq("profile_id", profileId)

      // Insert new contact info
      const { error: contactError } = await supabase.from("contact_info").insert({
        profile_id: profileId,
        email: profile.contactInfo.email || null,
        phone: profile.contactInfo.phone || null,
        whatsapp: profile.contactInfo.whatsapp || null,
        telegram: profile.contactInfo.telegram || null,
        website: profile.contactInfo.website || null,
      })

      if (contactError) throw handleSupabaseError(contactError)
    }

    // Fetch the complete updated profile
    return getProfileByUsername(profile.username)
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
