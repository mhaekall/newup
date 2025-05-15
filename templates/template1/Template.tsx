import type React from "react"
import Image from "next/image"
import type { PortfolioData } from "../../types/portfolio"
import { HorizontalProgressBar } from "../../components/ui/progress-timeline"
import { ProfileBanner } from "../../components/ui/profile-banner"
import { ModernFooter } from "../../components/ui/modern-footer"

interface TemplateProps {
  data: PortfolioData
}

const Template1: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Banner */}
      <ProfileBanner bannerUrl={data.bannerUrl} color="#3b82f6" pattern="waves" height={180} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 -mt-16 relative z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl || "/placeholder.svg"}
                alt={data.name || "Profile picture"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">{data.name?.charAt(0) || "?"}</span>
              </div>
            )}
          </div>

          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-xl text-gray-600">{data.title}</p>
            <p className="mt-2 text-gray-700 max-w-2xl">{data.bio}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Contact Information</h2>
              <ul className="space-y-3">
                {data.email && (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href={`mailto:${data.email}`} className="text-gray-700 hover:text-blue-500 transition-colors">
                      {data.email}
                    </a>
                  </li>
                )}
                {data.phone && (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href={`tel:${data.phone}`} className="text-gray-700 hover:text-blue-500 transition-colors">
                      {data.phone}
                    </a>
                  </li>
                )}
                {data.location && (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{data.location}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Skills with Progress Bars */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Skills</h2>
              <div className="space-y-4">
                {data.skills?.map((skill, index) => (
                  <HorizontalProgressBar
                    key={index}
                    label={skill}
                    percentage={85 - index * 5} // Simulasi level skill yang berbeda
                    variant="primary"
                    height={6}
                  />
                ))}
              </div>
            </div>

            {/* Links */}
            {data.links && data.links.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Links</h2>
                <ul className="space-y-3">
                  {data.links.map((link, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-500 transition-colors"
                      >
                        {link.title || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Experience</h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100"
                    >
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 -ml-2 border-2 border-white"></div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Education</h2>
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100"
                    >
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 -ml-2 border-2 border-white"></div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                      <p className="mt-2 text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {project.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <Image
                            src={project.imageUrl || "/placeholder.svg"}
                            alt={project.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{project.date}</p>
                        <p className="mt-2 text-gray-700">{project.description}</p>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-blue-500 hover:text-blue-700 transition-colors"
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
        </div>
      </div>

      {/* Modern Footer */}
      <ModernFooter variant="light" color="#3b82f6" />
    </div>
  )
}

export default Template1
