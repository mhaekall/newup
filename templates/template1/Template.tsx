import type { Profile } from "@/types"

interface TemplateProps {
  profile: Profile
}

export default function Template1({ profile }: TemplateProps) {
  // Helper function to get social icon
  const getSocialIcon = (icon: string | undefined, url: string) => {
    const iconName = icon || getIconFromUrl(url)

    switch (iconName) {
      case "github":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "linkedin":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        )
      case "twitter":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        )
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "facebook":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "youtube":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        )
    }
  }

  // Helper function to get icon from URL
  const getIconFromUrl = (url: string): string => {
    const domain = url.toLowerCase()
    if (domain.includes("github")) return "github"
    if (domain.includes("linkedin")) return "linkedin"
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter"
    if (domain.includes("instagram")) return "instagram"
    if (domain.includes("facebook")) return "facebook"
    if (domain.includes("youtube")) return "youtube"
    return "link"
  }

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate}${endDate ? ` - ${endDate}` : " - Present"}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Banner */}
      <div
        className="w-full h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: profile.banner_image
            ? `url(${profile.banner_image})`
            : "linear-gradient(to right, #3b82f6, #2563eb)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex-shrink-0">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150"
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 mt-1">@{profile.username}</p>
              <p className="text-gray-700 mt-4 whitespace-pre-wrap">{profile.bio}</p>

              {/* Social Links */}
              {profile.links && profile.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
                  {profile.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url} // Gunakan URL langsung karena sudah diformat oleh formatUrl
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      <span className="mr-2 text-gray-600">{getSocialIcon(link.icon, link.url)}</span>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>

              {/* Group skills by category */}
              {Array.from(new Set(profile.skills.map((skill) => skill.category))).map((category) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-md font-medium text-gray-700 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {profile.skills
                      .filter((skill) => skill.category === category)
                      .map((skill, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                            <span className="text-xs text-gray-500">
                              {["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][skill.level - 1]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
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
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4 pb-2">
                    <h3 className="text-md font-medium text-gray-800">{edu.institution}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    {edu.description && <p className="text-sm text-gray-600 mt-2">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience Section */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience</h2>
              <div className="space-y-8">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4 pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                      </div>
                      <div className="mt-1 sm:mt-0 text-right">
                        <p className="text-xs text-gray-500">{formatDateRange(exp.startDate, exp.endDate)}</p>
                        {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects</h2>
              <div className="grid grid-cols-1 gap-6">
                {profile.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    {project.image && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400"
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
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
                      <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
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

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500 text-sm mt-12">
        <p>Created with Next.js Portfolio Builder</p>
      </footer>
    </div>
  )
}
