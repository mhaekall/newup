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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {session.user.image && (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">{session.user.name}</span>
            </div>
            <Link href="/auth/signout">
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Portfolio</h2>

          {profile ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium">{profile.name}</h3>
                  <p className="text-gray-500">@{profile.username}</p>
                </div>
                <div className="space-x-2">
                  <Link href={`/dashboard/edit?id=${profile.id}`}>
                    <Button>Edit Portfolio</Button>
                  </Link>
                  <Link href={`/${profile.username}`} target="_blank">
                    <Button variant="outline">View Portfolio</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">You don't have a portfolio yet</h3>
              <p className="text-gray-500 mb-6">Create your portfolio to showcase your skills and projects</p>
              <Link href="/dashboard/edit">
                <Button>Create Portfolio</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
