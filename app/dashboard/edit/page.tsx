import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProfileByUserId } from "@/lib/supabase"
import { ProfileWizard } from "@/components/profile-wizard/profile-wizard"
import PageLoading from "@/components/ui/page-loading"

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  const userId = session.user.id
  const profile = await getProfileByUserId(userId)

  if (!profile) {
    // If no profile exists, create a new one
    return (
      <div className="min-h-screen">
        <ProfileWizard initialData={{}} userId={userId} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ProfileWizard initialData={profile} userId={userId} />
    </div>
  )
}

export function Loading() {
  return <PageLoading />
}
