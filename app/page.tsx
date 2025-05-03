import Link from "next/link"
import { getAllProfiles } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const profiles = await getAllProfiles()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Builder</h1>
          <Link href="/dashboard/edit">
            <Button>Create Portfolio</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-2xl overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Portfolio Builder</h2>
          <p className="text-gray-600 mb-8">
            Create your own portfolio in minutes. No coding required. Just fill out a form and get a beautiful portfolio
            page.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/dashboard/edit" className="flex-1">
              <Button className="w-full">Create Your Portfolio</Button>
            </Link>
          </div>

          {profiles.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Portfolios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/${profile.username}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900">{profile.name}</h4>
                    <p className="text-gray-500">@{profile.username}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>Built with Next.js 13 and Supabase</p>
        </div>
      </footer>
    </div>
  )
}
