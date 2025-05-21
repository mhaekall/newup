import { notFound } from "next/navigation"
import { getProfileByUsername, recordProfileView } from "@/lib/supabase"
import { getTemplateById } from "@/templates"
import { cookies, headers } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { getDictionary } from "@/lib/dictionary"

interface UsernamePageProps {
  params: {
    username: string
    lang: string
  }
}

export default async function UsernamePage({ params }: UsernamePageProps) {
  const { username, lang } = params
  const dict = await getDictionary(lang)
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  // Generate a visitor ID based on IP or user agent if not available
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const forwardedFor = headersList.get("x-forwarded-for") || ""
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown"

  // Get visitor ID from cookie or generate a new one
  const cookieStore = cookies()
  let visitorId = cookieStore.get("visitor_id")?.value

  if (!visitorId) {
    // Generate a unique visitor ID
    visitorId = uuidv4()
    // Note: In a server component, we can't set cookies directly
    // This will be handled client-side in the Template component
  }

  // Record the profile view (this is fire-and-forget, we don't await it)
  if (profile.id) {
    recordProfileView(profile.id, visitorId || `${ip}-${userAgent.substring(0, 50)}`)
  }

  // Get the template component based on the profile's template_id
  const template = getTemplateById(profile.template_id)
  const TemplateComponent = template.component

  return <TemplateComponent profile={profile} lang={lang} dictionary={dict} />
}
