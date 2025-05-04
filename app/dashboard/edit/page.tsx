import { Suspense } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import { ProfileWizard } from "@/components/profile-wizard/profile-wizard"
import { PageLoading } from "@/components/ui/page-loading"
import { ensureBucketsExist } from "@/lib/supabase-storage"

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
      {/* iOS-style header with blur effect */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Portfolio</h1>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <Suspense fallback={<PageLoading />}>
            <ProfileWizard initialData={profile || undefined} userId={session.user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
