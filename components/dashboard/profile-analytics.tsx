"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase-client"
import { LineChart, BarChart } from "@tremor/react"
import { CalendarDays, Eye, Heart, TrendingUp } from "lucide-react"

type ProfileStats = {
  totalViews: number
  totalLikes: number
  viewsByDay: { date: string; count: number }[]
  likesByDay: { date: string; count: number }[]
  topReferrers: { source: string; count: number }[]
}

export default function ProfileAnalytics({ profileId }: { profileId: string }) {
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()

        // Get date range
        const endDate = new Date()
        const startDate = new Date()

        if (timeRange === "7d") {
          startDate.setDate(endDate.getDate() - 7)
        } else if (timeRange === "30d") {
          startDate.setDate(endDate.getDate() - 30)
        } else {
          startDate.setDate(endDate.getDate() - 90)
        }

        // Get total views
        const { count: totalViews } = await supabase
          .from("profile_views")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", profileId)

        // Get total likes
        const { count: totalLikes } = await supabase
          .from("profile_likes")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", profileId)

        // Get views by day
        const { data: viewsData } = await supabase
          .from("profile_views")
          .select("created_at")
          .eq("profile_id", profileId)
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())

        // Get likes by day
        const { data: likesData } = await supabase
          .from("profile_likes")
          .select("created_at")
          .eq("profile_id", profileId)
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())

        // Process views by day
        const viewsByDay = processTimeSeriesData(viewsData || [], startDate, endDate)

        // Process likes by day
        const likesByDay = processTimeSeriesData(likesData || [], startDate, endDate)

        // Mock data for referrers since we don't track this yet
        const topReferrers = [
          { source: "Direct", count: Math.floor(Math.random() * 50) + 10 },
          { source: "Google", count: Math.floor(Math.random() * 40) + 5 },
          { source: "Twitter", count: Math.floor(Math.random() * 30) + 3 },
          { source: "LinkedIn", count: Math.floor(Math.random() * 20) + 2 },
          { source: "Other", count: Math.floor(Math.random() * 10) + 1 },
        ].sort((a, b) => b.count - a.count)

        setStats({
          totalViews: totalViews || 0,
          totalLikes: totalLikes || 0,
          viewsByDay,
          likesByDay,
          topReferrers,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (profileId) {
      fetchAnalytics()
    }
  }, [profileId, timeRange])

  // Helper function to process time series data
  const processTimeSeriesData = (data: any[], startDate: Date, endDate: Date) => {
    const result: { date: string; count: number }[] = []

    // Create a map of dates to counts
    const countsByDate: Record<string, number> = {}

    // Count occurrences by date
    data.forEach((item) => {
      const date = new Date(item.created_at).toISOString().split("T")[0]
      countsByDate[date] = (countsByDate[date] || 0) + 1
    })

    // Fill in all dates in the range
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      result.push({
        date: dateStr,
        count: countsByDate[dateStr] || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
        <div className="flex items-center space-x-2">
          <select
            className="border rounded-md px-3 py-1.5 bg-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <p className="text-2xl font-bold">{stats.totalLikes}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                <p className="text-2xl font-bold">
                  {stats.totalViews > 0 ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}%` : "0.0%"}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <CalendarDays className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views">
        <TabsList className="mb-4">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Daily profile views for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.viewsByDay}
                index="date"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} views`}
                yAxisWidth={40}
                showAnimation
                className="h-72"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes">
          <Card>
            <CardHeader>
              <CardTitle>Likes Over Time</CardTitle>
              <CardDescription>Daily profile likes for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.likesByDay}
                index="date"
                categories={["count"]}
                colors={["rose"]}
                valueFormatter={(value) => `${value} likes`}
                yAxisWidth={40}
                showAnimation
                className="h-72"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={stats.topReferrers}
                index="source"
                categories={["count"]}
                colors={["emerald"]}
                valueFormatter={(value) => `${value} visits`}
                yAxisWidth={40}
                showAnimation
                className="h-72"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
