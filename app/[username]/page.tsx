import { notFound } from "next/navigation"
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

  return <TemplateComponent profile={profile} />
}
