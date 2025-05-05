import type { Profile } from "@/types"
import SocialMediaIcon from "@/components/social-media-icons"

interface TemplateProps {
  profile: Profile
}

export default function Template1({ profile }: TemplateProps) {
  // Helper function to extract platform name from URL
  const getPlatformName = (url: string): string => {
    try {
      if (!url) return "Link"

      if (url.includes("mailto:")) return "Email"
      if (url.includes("tel:")) return "Phone"
      if (url.includes("wa.me") || url.includes("whatsapp")) return "WhatsApp"

      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace("www.", "")

      if (domain.includes("instagram")) return "Instagram"
      if (domain.includes("twitter") || domain.includes("x.com")) return "Twitter"
      if (domain.includes("facebook")) return "Facebook"
      if (domain.includes("linkedin")) return "LinkedIn"
      if (domain.includes("github")) return "GitHub"
      if (domain.includes("telegram")) return "Telegram"
      if (domain.includes("youtube")) return "YouTube"
      if (domain.includes("twitch")) return "Twitch"
      if (domain.includes("dribbble")) return "Dribbble"
      if (domain.includes("figma")) return "Figma"
      if (domain.includes("codepen")) return "CodePen"
      if (domain.includes("slack")) return "Slack"
      if (domain.includes("discord")) return "Discord"

      // If it's the user's own portfolio site
      if (domain.includes(profile.username?.toLowerCase() || "")) return "Portfolio"

      return "Website"
    } catch (error) {
      // If URL parsing fails, try to identify common patterns
      if (url.includes("instagram")) return "Instagram"
      if (url.includes("twitter") || url.includes("x.com")) return "Twitter"
      if (url.includes("facebook")) return "Facebook"
      if (url.includes("linkedin")) return "LinkedIn"
      if (url.includes("github")) return "GitHub"
      if (url.includes("whatsapp")) return "WhatsApp"
      if (url.includes("telegram")) return "Telegram"
      if (url.includes("mailto:")) return "Email"
      if (url.includes("tel:")) return "Phone"

      return "Link"
    }
  }

  // Format display text for links
  const getDisplayText = (url: string, platform: string): string => {
    if (platform === "Email") {
      return url.replace("mailto:", "")
    }
    if (platform === "Phone") {
      return url.replace("tel:", "")
    }
    if (platform === "WhatsApp") {
      return "WhatsApp"
    }
    return platform
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-8">
        {profile.profile_image && (
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
            <img
              src={profile.profile_image || "/placeholder.svg?height=128&width=128"}
              alt={`${profile.name || profile.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-800">{profile.name || profile.username}</h1>
        {profile.username && <p className="text-blue-500 mb-2">@{profile.username}</p>}
        {profile.bio && <p className="text-gray-600 text-center max-w-md mb-4">{profile.bio}</p>}

        {/* Social Links with Brand Icons */}
        {profile.links && profile.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {profile.links.map((link, index) => {
              if (!link.url) return null
              const platform = link.label || getPlatformName(link.url)
              const displayText = getDisplayText(link.url, platform)

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
                >
                  <SocialMediaIcon platform={platform} />
                  <span>{displayText}</span>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-gray-500 text-sm">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-500 text-sm">
                  {edu.startDate} - {edu.endDate || "Present"}
                </p>
                {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {profile.projects && profile.projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {project.image && (
                  <img
                    src={project.image || "/placeholder.svg?height=200&width=400"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
