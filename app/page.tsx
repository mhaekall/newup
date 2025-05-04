import Link from "next/link"
import { getAllProfiles } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const profiles = await getAllProfiles()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm backdrop-blur-lg bg-white/90 supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
          <Link href="/dashboard/edit">
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600 transition-all">Create Portfolio</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-3xl overflow-hidden p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Portfolio Builder</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create your own portfolio in minutes. No coding required. Just fill out a form and get a beautiful
              portfolio page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Link href="/dashboard/edit" className="flex-1 max-w-md mx-auto">
              <Button className="w-full h-14 rounded-full text-lg font-medium shadow-sm">Create Your Portfolio</Button>
            </Link>
          </div>

          {profiles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Recent Portfolios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/${profile.username}`}
                    className="block p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
                        {profile.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{profile.name}</h4>
                        <p className="text-gray-500">@{profile.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>Built with Next.js and Supabase</p>
        </div>
      </footer>
    </div>
  )
}
