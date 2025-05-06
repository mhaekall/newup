import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfileByUserId } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  const profile = await getProfileByUserId(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* User profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              {session.user.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-medium">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-medium text-gray-900">{session.user.name}</h2>
                {profile && <p className="text-gray-500 text-sm">@{profile.username}</p>}
              </div>
            </div>

            {profile ? (
              <div className="space-y-4">
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
    </div>
  )
}
