import type React from "react"
import Image from "next/image"
import type { PortfolioData } from "../../types/portfolio"
import { ProgressTimeline, CircleProgressBar } from "../../components/ui/progress-timeline"
import { ProfileBanner } from "../../components/ui/profile-banner"
import { ModernFooter } from "../../components/ui/modern-footer"

interface TemplateProps {
  data: PortfolioData
}

const Template2: React.FC<TemplateProps> = ({ data }) => {
  // Membuat data untuk progress timeline
  const educationSteps =
    data.education?.map((edu, index) => ({
      title: edu.degree,
      description: edu.institution,
      completed: true,
      active: index === 0,
    })) || []

  // Membuat data untuk progress timeline experience
  const experienceSteps =
    data.experience?.map((exp, index) => ({
      title: exp.title,
      description: exp.company,
      completed: true,
      active: index === 0,
    })) || []

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Banner */}
      <ProfileBanner bannerUrl={data.bannerUrl} color="#f43f5e" pattern="waves" height={220} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center -mt-24 relative z-10 mb-12">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl || "/placeholder.svg"}
                alt={data.name || "Profile picture"}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">{data.name?.charAt(0) || "?"}</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-xl text-rose-600 font-medium">{data.title}</p>
            <p className="mt-2 text-gray-700 max-w-2xl mx-auto">{data.bio}</p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-700">{data.email}</span>
              </a>
            )}

            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-700">{data.phone}</span>
              </a>
            )}

            {data.location && (
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-500 mr-2"
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
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {/* Skills with Circle Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Skills</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.skills?.slice(0, 6).map((skill, index) => (
                  <CircleProgressBar
                    key={index}
                    percentage={90 - index * 5} // Simulasi level skill yang berbeda
                    size={100}
                    strokeWidth={8}
                    variant={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "info"}
                    label={skill}
                  />
                ))}
              </div>
            </div>

            {/* Links */}
            {data.links && data.links.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Links</h2>
                <ul className="space-y-3">
                  {data.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-rose-50 transition-colors group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-rose-500 mr-3 group-hover:scale-110 transition-transform"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
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
          <div className="lg:col-span-2">
            {/* Experience with Timeline */}
            {data.experience && data.experience.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Experience</h2>
                <ProgressTimeline steps={experienceSteps} variant="secondary" />

                <div className="mt-6 space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-rose-600">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education with Timeline */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Education</h2>
                <ProgressTimeline steps={educationSteps} variant="info" />

                <div className="mt-6 space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-cyan-600">{edu.institution}</p>
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      {project.imageUrl && (
                        <div className="h-48 overflow-hidden">
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
                            className="mt-3 inline-flex items-center text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <span>View Project</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
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
      <ModernFooter variant="colored" color="#f43f5e" />
    </div>
  )
}

export default Template2
