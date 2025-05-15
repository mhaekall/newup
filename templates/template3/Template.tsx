import type React from "react"
import Image from "next/image"
import type { PortfolioData } from "../../types/portfolio"
import { HorizontalProgressBar } from "../../components/ui/progress-timeline"
import { ProfileBanner } from "../../components/ui/profile-banner"
import { ModernFooter } from "../../components/ui/modern-footer"

interface TemplateProps {
  data: PortfolioData
}

const Template3: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Banner */}
      <ProfileBanner bannerUrl={data.bannerUrl} color="#10b981" pattern="dots" height={200} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 -mt-16 relative z-10 mb-8 mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
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
              <p className="text-xl text-green-600">{data.title}</p>
              <p className="mt-2 text-gray-700 max-w-2xl">{data.bio}</p>

              {/* Contact Information */}
              <div className="flex flex-wrap gap-4 mt-4">
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {data.email}
                  </a>
                )}

                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {data.phone}
                  </a>
                )}

                {data.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {data.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4">
            {/* Skills with Progress Bars */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Skills</h2>

              {/* Group skills by category */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-green-600 mb-3">Technical Skills</h3>
                  <div className="space-y-4">
                    {data.skills?.slice(0, 3).map((skill, index) => (
                      <HorizontalProgressBar
                        key={index}
                        label={skill}
                        percentage={90 - index * 5}
                        variant="success"
                        height={8}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-green-600 mb-3">Soft Skills</h3>
                  <div className="space-y-4">
                    {data.skills?.slice(3, 6).map((skill, index) => (
                      <HorizontalProgressBar
                        key={index}
                        label={skill}
                        percentage={85 - index * 5}
                        variant="info"
                        height={8}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            {data.links && data.links.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Links</h2>
                <ul className="space-y-3">
                  {data.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                          {link.title || link.url}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Experience</h2>

                <div className="space-y-8">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Progress indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-100 rounded-full"></div>

                      <div className="pl-6">
                        <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-green-500 -ml-2 border-2 border-white"></div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-sm text-gray-500 md:ml-4">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>

                        <p className="text-green-600 mt-1">{exp.company}</p>
                        <p className="mt-2 text-gray-700">{exp.description}</p>

                        {/* Progress bar showing duration */}
                        <div className="mt-4">
                          <HorizontalProgressBar
                            percentage={index === 0 ? 100 : 70 - index * 10}
                            height={4}
                            variant="success"
                            showPercentage={false}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Education</h2>

                <div className="space-y-8">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative">
                      {/* Progress indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-100 rounded-full"></div>

                      <div className="pl-6">
                        <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-cyan-500 -ml-2 border-2 border-white"></div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-500 md:ml-4">
                            {edu.startDate} - {edu.endDate || "Present"}
                          </p>
                        </div>

                        <p className="text-cyan-600 mt-1">{edu.institution}</p>
                        <p className="mt-2 text-gray-700">{edu.description}</p>

                        {/* Progress bar showing duration */}
                        <div className="mt-4">
                          <HorizontalProgressBar
                            percentage={index === 0 ? 100 : 70 - index * 10}
                            height={4}
                            variant="info"
                            showPercentage={false}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Projects</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <div
                      key={index}
                      className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100"
                    >
                      {project.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <Image
                            src={project.imageUrl || "/placeholder.svg"}
                            alt={project.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {project.date}
                          </span>
                        </div>

                        <p className="mt-2 text-gray-700">{project.description}</p>

                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
                          >
                            <span>View Details</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
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
      <ModernFooter variant="dark" />
    </div>
  )
}

export default Template3
