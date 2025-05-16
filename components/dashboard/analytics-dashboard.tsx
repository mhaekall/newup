"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Card as TremorCard, Title, DonutChart } from "@tremor/react"
import { createClient } from "@/lib/supabase-client"
import { Eye, Heart, Users, TrendingUp, ExternalLink } from "lucide-react"

interface AnalyticsDashboardProps {
  profileId: string
  username: string
}

export default function AnalyticsDashboard({ profileId, username }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    viewsByDay: [] as { date: string; views: number }[],
    likesByDay: [] as { date: string; likes: number }[],
    isLoading: true,
    error: null as string | null,
  })

  useEffect(() => {
    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, isLoading: true }))

      try {
        const supabase = createClient()

        // Calculate date range
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

        // Process data by day
        const viewsByDay = groupByDay(viewsData || [], startDate, endDate, "views")
        const likesByDay = groupByDay(likesData || [], startDate, endDate, "likes")

        setStats({
          totalViews: totalViews || 0,
          totalLikes: totalLikes || 0,
          viewsByDay,
          likesByDay,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load analytics data",
        }))
      }
    }

    if (profileId) {
      fetchStats()
    }
  }, [profileId, timeRange])

  // Helper to group data by day
  const groupByDay = (data: any[], startDate: Date, endDate: Date, valueKey: string) => {
    const result: any[] = []
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
      const dateObj: any = { date: dateStr }
      dateObj[valueKey] = countsByDate[dateStr] || 0
      result.push(dateObj)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  }

  if (stats.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Format data for charts
  const viewsData = stats.viewsByDay.map((day) => ({
    date: formatDate(day.date),
    Views: day.views,
  }))

  const likesData = stats.likesByDay.map((day) => ({
    date: formatDate(day.date),
    Likes: day.likes,
  }))

  const valueFormatter = (number: number) => {
    return `${number}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
        <div className="flex items-center">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm shadow-sm outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-500">View Portfolio</p>
                <p className="text-base font-medium mt-2">
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    {`/${username}`}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views">
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Views</CardTitle>
              <CardDescription>Daily views over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <TremorCard>
                <Title>Views Over Time</Title>
                <AreaChart
                  className="h-72 mt-4"
                  data={viewsData}
                  index="date"
                  categories={["Views"]}
                  colors={["blue"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showAnimation
                />
              </TremorCard>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Likes</CardTitle>
              <CardDescription>Daily likes over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <TremorCard>
                <Title>Likes Over Time</Title>
                <AreaChart
                  className="h-72 mt-4"
                  data={likesData}
                  index="date"
                  categories={["Likes"]}
                  colors={["rose"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showAnimation
                />
              </TremorCard>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Views vs. Likes</CardTitle>
              <CardDescription>Comparison of engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TremorCard>
                <Title>Distribution</Title>
                <DonutChart
                  className="mt-6"
                  data={[
                    { name: "Views", value: stats.totalViews },
                    { name: "Likes", value: stats.totalLikes },
                  ]}
                  category="value"
                  index="name"
                  colors={["blue", "rose"]}
                  valueFormatter={valueFormatter}
                  showAnimation
                />
              </TremorCard>

              <TremorCard>
                <Title>Summary</Title>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Views</p>
                    <p className="text-2xl font-bold">{stats.totalViews}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Likes</p>
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalViews > 0 ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}%` : "0.0%"}
                    </p>
                  </div>
                </div>
              </TremorCard>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
