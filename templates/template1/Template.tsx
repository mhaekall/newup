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

  // Random skill level generator for demonstration
  const getSkillLevel = () => Math.floor(Math.random() * 41) + 60; // Returns between 60-100%

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl my-10 backdrop-blur-sm dark:text-white transition-all duration-300">
      <div className="flex flex-col items-center mb-12 relative">
        {profile.profile_image && (
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-blue-400 dark:border-indigo-500 shadow-lg relative z-10"
              style={{ boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)" }}
            >
              <img
                src={profile.profile_image || "/placeholder.svg?height=160&width=160"}
                alt={`${profile.name || profile.username}'s avatar`}
                className="w-full h-full object-cover transition-transform duration-700"
              />
            </div>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur opacity-70" />
          </div>
        )}

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-1">
          {profile.name || profile.username}
        </h1>
        
        {profile.username && (
          <p className="text-indigo-500 dark:text-indigo-300 mb-3 text-lg font-medium">
            @{profile.username}
          </p>
        )}
        
        {profile.bio && (
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-lg mb-6 font-light leading-relaxed text-lg italic">
            "{profile.bio}"
          </p>
        )}

        {/* Social Links with Brand Icons */}
        {profile.links && profile.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {profile.links.map((link, index) => {
              if (!link.url) return null;
              const platform = link.label || getPlatformName(link.url);
              const displayText = getDisplayText(link.url, platform);

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-full text-gray-700 dark:text-gray-200 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
                >
                  <SocialMediaIcon platform={platform} />
                  <span className="font-medium">{displayText}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left column */}
        <div className="space-y-10">
          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Skills
              </h2>
              <div className="space-y-4">
                {profile.skills.map((skill, index) => {
                  const level = getSkillLevel(); // Get a random skill level
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
                Education
              </h2>
              
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div 
                    key={index}
                    className="border-l-4 border-green-500 dark:border-green-400 pl-4 hover:border-green-600 dark:hover:border-green-300 transition-colors duration-300 relative"
                  >
                    <div className="absolute -left-2.5 top-0 bg-white dark:bg-gray-800 p-1 rounded-full border-2 border-green-500 dark:border-green-400">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{edu.degree}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column */}
        <div className="space-y-10">
          {/* Experience Section */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Experience
              </h2>
              
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div 
                    key={index}
                    className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 hover:border-blue-600 dark:hover:border-blue-300 transition-colors duration-300 relative"
                  >
                    <div className="absolute -left-2.5 top-0 bg-white dark:bg-gray-800 p-1 rounded-full border-2 border-blue-500 dark:border-blue-400">
                      <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{exp.position}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.projects.map((project, index) => (
              <div 
                key={index}
                className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {project.image && (
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={project.image || "/placeholder.svg?height=200&width=400"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  {!project.image && (
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:translate-x-1"
                    >
                      View Project 
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} {profile.name || profile.username}</p>
      </div>
    </div>
  )
}
