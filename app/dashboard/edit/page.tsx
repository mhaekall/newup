import { Suspense } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import { ProfileWizard } from "@/components/profile-wizard/profile-wizard"
import { PageLoading } from "@/components/ui/page-loading"
import { setupSupabaseStorage } from "@/lib/supabase-setup"

export default async function EditPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Setup Supabase storage buckets
  await setupSupabaseStorage()

  const profile = await getProfileByUserId(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 font-medium">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-2xl overflow-hidden p-6">
          <Suspense fallback={<PageLoading />}>
            <ProfileWizard initialData={profile || undefined} userId={session.user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
