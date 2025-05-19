"use client"

import { useState, useEffect } from "react"
import { getProfileViewCount } from "@/lib/supabase"
import { IOSCard } from "@/components/ui/ios-card"
import { Eye, TrendingUp } from "lucide-react"

interface ProfileViewsStatsProps {
  profileId: string
}

export function ProfileViewsStats({ profileId }: ProfileViewsStatsProps) {
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const count = await getProfileViewCount(profileId)
        setViewCount(count)
      } catch (error) {
        console.error("Error fetching view count:", error)
      } finally {
        setLoading(false)
      }
    }

    if (profileId) {
      fetchViewCount()
    }
  }, [profileId])

  return (
    <IOSCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Views</h3>

      {loading ? (
        <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{viewCount}</p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
          </div>

          <div className="text-green-500 flex items-center">
            <TrendingUp size={18} className="mr-1" />
            <span>Active</span>
          </div>
        </div>
      )}
    </IOSCard>
  )
}
