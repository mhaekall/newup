import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import ProfileImageUploader from "@/components/profile-image-uploader"
// Import the ProfileViewsStats component at the top of the file
import { ProfileViewsStats } from "@/components/profile-views-stats"
// Add React.memo to optimize component rendering
import { memo } from "react"

// Memoize the ProfileViewsStats component to prevent unnecessary re-renders
const MemoizedProfileViewsStats = memo(ProfileViewsStats)

export default async function Dashboard() {
  // Get the user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Wrap the profile fetching in a try/catch to handle potential errors
  let profile = null
  try {
    profile = await getProfileByUserId(session.user.id)
  } catch (error) {
    console.error("Error fetching profile:", error)
    // Continue with profile as null - we'll handle this case below
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* User profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <ProfileImageUploader
                userId={session.user.id}
                currentImageUrl={session.user.image || undefined}
                username={profile?.username || "user"}
              />

              <div className="mt-4 text-center">
                <h2 className="text-2xl font-medium text-gray-900">{session.user.name}</h2>
                {profile && <p className="text-gray-500 text-sm">@{profile.username}</p>}
              </div>
            </div>

            {profile ? (
              <div className="space-y-4">
                {profile && profile.id && <MemoizedProfileViewsStats profileId={profile.id} />}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`/dashboard/edit?id=${profile.id}`} className="flex-1">
                    <Button className="w-full rounded-full h-12 bg-blue-500 hover:bg-blue-600" size="lg">
                      Edit Portfolio
                    </Button>
                  </Link>
                  <Link href={`/${profile.username}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full h-12 border-gray-200" size="lg">
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2">You don't have a portfolio yet</h3>
                <p className="text-gray-500 mb-6">Create your portfolio to showcase your skills and projects</p>
                <Link href="/dashboard/edit">
                  <Button className="rounded-full px-6 h-12 bg-blue-500 hover:bg-blue-600" size="lg">
                    Create Portfolio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tips card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-medium mb-4">Quick Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                •
              </span>
              <span className="text-gray-600">Add your skills and projects to showcase your expertise</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                •
              </span>
              <span className="text-gray-600">Include your social media links to help people connect with you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                •
              </span>
              <span className="text-gray-600">Upload a professional profile photo to make a good impression</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Add the custom footer with contact info */}
      <div className="mt-12 py-6 border-t border-gray-100">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h3 className="text-xl font-medium mb-2">Contact</h3>
          <p className="text-gray-600 mb-2">Have questions or feedback?</p>
          <a href="mailto:looqmy@outlook.co.id" className="text-blue-500 hover:underline">
            looqmy@outlook.co.id
          </a>
          <p className="mt-6 text-sm text-gray-500">© 2025 looqmy. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
