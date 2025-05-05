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
      {/* Banner */}
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
        }}
      />

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-blue-500 font-medium mt-1">@{profile.username}</p>
                <p className="text-gray-700 mt-4 text-lg leading-relaxed">{profile.bio}</p>

                {/* Social Links */}
                {profile.links && profile.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                    {profile.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url} // Gunakan URL langsung karena sudah diformat oleh formatUrl
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <span className="mr-2 text-blue-500">{getSocialIcon(link.icon, link.url)}</span>
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Left Column */}
          <div className="md:col-span-4 space-y-8">
            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>

                {/* Group skills by category */}
                {Array.from(new Set(profile.skills.map((skill) => skill.category))).map((category) => (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{category}</h3>
                    <div className="space-y-4">
                      {profile.skills
                        .filter((skill) => skill.category === category)
                        .map((skill, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">{skill.name}</span>
                              <span className="text-xs text-gray-500">
                                {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${skill.level * 20}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="relative pl-6 pb-6 last:pb-0">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="absolute left-0.5 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-gray-600">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{formatDateRange(edu.startDate, edu.endDate)}</p>
                      {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-8 space-y-8">
            {/* Experience Section */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                <div className="space-y-8">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 pb-8 last:pb-0">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="absolute left-0.5 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <div className="mt-1 sm:mt-0 text-right">
                          <p className="text-sm text-gray-500">{formatDateRange(exp.startDate, exp.endDate)}</p>
                          {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && <p className="text-gray-600 mt-3">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {profile.projects && profile.projects.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                <div className="grid grid-cols-1 gap-8">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      {project.image && (
                        <div className="w-full h-56 overflow-hidden">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                          {project.url && (
                            <a
                              href={project.url} // Gunakan URL langsung karena sudah diformat
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                        <p className="text-gray-600 mt-3">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-block bg-blue-50 rounded-full px-3 py-1 text-xs font-medium text-blue-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} {profile.name} • Built with Next.js Portfolio Builder
          </p>
        </div>
      </footer>
    </div>
  )
}
