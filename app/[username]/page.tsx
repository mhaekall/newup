import { notFound } from "next/navigation"
import Link from "next/link"
import { getProfileByUsername } from "@/lib/supabase"
import { getTemplateById } from "@/templates"

interface UsernamePageProps {
  params: {
    username: string
  }
}

export default async function UsernamePage({ params }: UsernamePageProps) {
  const { username } = params
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  // Get the template component based on the profile's template_id
  const template = getTemplateById(profile.template_id)
  const TemplateComponent = template.component

  return (
    <>
      <div className="fixed top-4 right-4 z-10">
        <Link
          href={`/dashboard/edit?username=${username}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Profile
        </Link>
      </div>
      <TemplateComponent profile={profile} />
    </>
  )
}
