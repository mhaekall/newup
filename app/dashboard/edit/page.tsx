import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import { ModernOnboardingWizard } from "@/components/profile-wizard/modern-onboarding-wizard"
import PageLoading from "@/components/ui/page-loading"
import { ensureBucketsExist } from "@/lib/supabase-storage"
import Navbar from "@/components/navbar"

export default async function EditPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Setup Supabase storage buckets
  await ensureBucketsExist()

  const profile = await getProfileByUserId(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-0 sm:px-4">
        <Suspense fallback={<PageLoading />}>
          <ModernOnboardingWizard initialData={profile || undefined} userId={session.user.id} />
        </Suspense>
      </main>
    </div>
  )
}
