import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  const profile = await getProfileByUserId(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS-style header with blur effect */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image || "/placeholder.svg"}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            )}
            <Link href="/auth/signout">
              <Button variant="outline" size="sm" className="rounded-full text-sm px-4 h-9">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* User profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5">
            <div className="flex items-center gap-4 mb-6">
              {session.user.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{session.user.name}</h2>
                <p className="text-gray-500">{session.user.email}</p>
              </div>
            </div>

            {profile ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">{profile.name}</h3>
                  <p className="text-gray-500 text-sm">@{profile.username}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`/dashboard/edit?id=${profile.id}`} className="flex-1">
                    <Button className="w-full rounded-full h-11" size="lg">
                      Edit Portfolio
                    </Button>
                  </Link>
                  <Link href={`/${profile.username}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full h-11" size="lg">
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">You don't have a portfolio yet</h3>
                <p className="text-gray-500 mb-6">Create your portfolio to showcase your skills and projects</p>
                <Link href="/dashboard/edit">
                  <Button className="rounded-full px-6 h-11" size="lg">
                    Create Portfolio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Additional info card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-medium mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Add your skills and projects to showcase your expertise</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Include your social media links to help people connect with you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Upload a professional profile photo to make a good impression</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
