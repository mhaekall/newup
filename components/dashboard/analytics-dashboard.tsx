"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AreaChart, BarChart } from "@tremor/react"
import { getProfileAnalytics } from "@/actions/profile-stats"
import { useToast } from "@/components/ui/use-toast"
import {
  Eye,
  Heart,
  Users,
  TrendingUp,
  ExternalLink,
  Calendar,
  RefreshCw,
  Download,
  Share2,
  Clock,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react"

interface AnalyticsDashboardProps {
  profileId: string
  username: string
}

export default function AnalyticsDashboard({ profileId, username }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true)
      const result = await getProfileAnalytics(profileId, timeRange)

      if (result.success && result.analytics) {
        setAnalytics(result.analytics)
        setError(null)
      } else {
        setError("Failed to load analytics data")
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (profileId) {
      fetchAnalytics()
    }
  }, [profileId, timeRange])

  // Calculate trends
  const trends = useMemo(() => {
    if (!analytics) return null

    const viewsData = analytics.viewsByDay
    const likesData = analytics.likesByDay

    // Calculate view trend
    const firstHalfViews = viewsData.slice(0, Math.floor(viewsData.length / 2)).reduce((sum, day) => sum + day.views, 0)
    const secondHalfViews = viewsData.slice(Math.floor(viewsData.length / 2)).reduce((sum, day) => sum + day.views, 0)
    const viewsTrend = firstHalfViews > 0 ? ((secondHalfViews - firstHalfViews) / firstHalfViews) * 100 : 0

    // Calculate like trend
    const firstHalfLikes = likesData.slice(0, Math.floor(likesData.length / 2)).reduce((sum, day) => sum + day.likes, 0)
    const secondHalfLikes = likesData.slice(Math.floor(likesData.length / 2)).reduce((sum, day) => sum + day.likes, 0)
    const likesTrend = firstHalfLikes > 0 ? ((secondHalfLikes - firstHalfLikes) / firstHalfLikes) * 100 : 0

    return {
      views: {
        value: viewsTrend,
        isPositive: viewsTrend >= 0,
      },
      likes: {
        value: likesTrend,
        isPositive: likesTrend >= 0,
      },
    }
  }, [analytics])

  // Format data for charts
  const chartData = useMemo(() => {
    if (!analytics) return { viewsData: [], likesData: [], combinedData: [] }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    }

    const viewsData = analytics.viewsByDay.map((day: any) => ({
      date: formatDate(day.date),
      Views: day.views,
    }))

    const likesData = analytics.likesByDay.map((day: any) => ({
      date: formatDate(day.date),
      Likes: day.likes,
    }))

    const combinedData = analytics.viewsByDay.map((day: any, index: number) => ({
      date: formatDate(day.date),
      Views: day.views,
      Likes: analytics.likesByDay[index]?.likes || 0,
    }))

    return { viewsData, likesData, combinedData }
  }, [analytics])

  const valueFormatter = (number: number) => `${number}`

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
          <CardDescription>We encountered a problem loading your analytics data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error || "Unknown error occurred"}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
          {isRefreshing && <RefreshCw className="ml-2 h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowTimeSelector(!showTimeSelector)}
          >
            <Calendar className="h-4 w-4" />
            {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"}
            <ChevronDown className={`h-4 w-4 transition-transform ${showTimeSelector ? "rotate-180" : ""}`} />
          </Button>

          <AnimatePresence>
            {showTimeSelector && (
              <motion.div
                className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-1">
                  {[
                    { value: "7d", label: "Last 7 days" },
                    { value: "30d", label: "Last 30 days" },
                    { value: "90d", label: "Last 90 days" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        timeRange === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setTimeRange(option.value as any)
                        setShowTimeSelector(false)
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold mt-2">{analytics.totalViews.toLocaleString()}</p>
                  {trends && (
                    <div
                      className={`flex items-center mt-2 text-sm ${
                        trends.views.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trends.views.isPositive ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      <span>
                        {Math.abs(trends.views.value).toFixed(1)}% {trends.views.isPositive ? "increase" : "decrease"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                  <p className="text-3xl font-bold mt-2">{analytics.totalLikes.toLocaleString()}</p>
                  {trends && (
                    <div
                      className={`flex items-center mt-2 text-sm ${
                        trends.likes.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trends.likes.isPositive ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      <span>
                        {Math.abs(trends.likes.value).toFixed(1)}% {trends.likes.isPositive ? "increase" : "decrease"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                  <p className="text-3xl font-bold mt-2">
                    {analytics.totalViews > 0
                      ? `${((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1)}%`
                      : "0.0%"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Based on likes per view</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                  <p className="text-3xl font-bold mt-2">{analytics.uniqueVisitors.toLocaleString()}</p>
                  <div className="mt-2">
                    <a
                      href={`/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Portfolio
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="views" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="views" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Views</span>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Likes</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Comparison</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-blue-500" />
                  Profile Views
                </CardTitle>
                <CardDescription>Daily views over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <AreaChart
                    className="h-full mt-4"
                    data={chartData.viewsData}
                    index="date"
                    categories={["Views"]}
                    colors={["blue"]}
                    valueFormatter={valueFormatter}
                    showLegend={false}
                    showAnimation
                    curveType="natural"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Peak Traffic Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chartData.viewsData.length > 0 && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Highest Traffic Day</p>
                          <p className="text-xl font-semibold mt-1">
                            {chartData.viewsData.reduce((max, day) => (day.Views > max.Views ? day : max)).date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {chartData.viewsData.reduce((max, day) => (day.Views > max.Views ? day : max)).Views}{" "}
                            views
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Average Daily Views</p>
                          <p className="text-xl font-semibold mt-1">
                            {(
                              chartData.viewsData.reduce((sum, day) => sum + day.Views, 0) / chartData.viewsData.length
                            ).toFixed(1)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Visitor Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                      <p className="text-xl font-semibold mt-1">{analytics.uniqueVisitors.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {((analytics.uniqueVisitors / analytics.totalViews) * 100).toFixed(1)}% of total views
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Return Rate</p>
                      <p className="text-xl font-semibold mt-1">
                        {analytics.uniqueVisitors > 0
                          ? `${(
                              ((analytics.totalViews - analytics.uniqueVisitors) / analytics.totalViews) * 100
                            ).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Profile Likes
                </CardTitle>
                <CardDescription>Daily likes over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <BarChart
                    className="h-full mt-4"
                    data={chartData.likesData}
                    index="date"
                    categories={["Likes"]}
                    colors={["rose"]}
                    valueFormatter={valueFormatter}
                    showLegend={false}
                    showAnimation
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Like Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chartData.likesData.length > 0 && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Most Liked Day</p>
                          <p className="text-xl font-semibold mt-1">
                            {chartData.likesData.reduce((max, day) => (day.Likes > max.Likes ? day : max)).date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {chartData.likesData.reduce((max, day) => (day.Likes > max.Likes ? day : max)).Likes}{" "}
                            likes
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Average Daily Likes</p>
                          <p className="text-xl font-semibold mt-1">
                            {(
                              chartData.likesData.reduce((sum, day) => sum + day.Likes, 0) / chartData.likesData.length
                            ).toFixed(1)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Like to View Ratio</p>
                      <p className="text-xl font-semibold mt-1">
                        {analytics.totalViews > 0
                          ? `${((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Likes per Unique Visitor</p>
                      <p className="text-xl font-semibold mt-1">
                        {analytics.uniqueVisitors > 0
                          ? (analytics.totalLikes / analytics.uniqueVisitors).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Views vs. Likes
                </CardTitle>
                <CardDescription>Comparison of engagement metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <AreaChart
                    className="h-full mt-4"
                    data={chartData.combinedData}
                    index="date"
                    categories={["Views", "Likes"]}
                    colors={["blue", "rose"]}
                    valueFormatter={valueFormatter}
                    showAnimation
                    curveType="natural"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Views</span>
                      <Badge variant="secondary">{analytics.totalViews.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Likes</span>
                      <Badge variant="secondary">{analytics.totalLikes.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Unique Visitors</span>
                      <Badge variant="secondary">{analytics.uniqueVisitors.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Engagement Rate</span>
                      <Badge variant="secondary">
                        {analytics.totalViews > 0
                          ? `${((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Growth Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-2 ${
                            trends?.views.isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {trends?.views.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Views Trend</p>
                          <p className={`text-xs ${trends?.views.isPositive ? "text-green-600" : "text-red-600"}`}>
                            {trends?.views.isPositive ? "Growing" : "Declining"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.abs(trends?.views.value || 0).toFixed(1)}%{" "}
                        {trends?.views.isPositive ? "increase" : "decrease"} in views
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-2 ${
                            trends?.likes.isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {trends?.likes.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Likes Trend</p>
                          <p className={`text-xs ${trends?.likes.isPositive ? "text-green-600" : "text-red-600"}`}>
                            {trends?.likes.isPositive ? "Growing" : "Declining"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.abs(trends?.likes.value || 0).toFixed(1)}%{" "}
                        {trends?.likes.isPositive ? "increase" : "decrease"} in likes
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center mt-2">
                        <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                        <p className="text-sm font-medium">Recommendation</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trends?.views.isPositive && trends?.likes.isPositive
                          ? "Your portfolio is performing well! Consider adding more content to maintain momentum."
                          : trends?.views.isPositive && !trends?.likes.isPositive
                            ? "You're getting views but fewer likes. Try updating your portfolio design to increase engagement."
                            : !trends?.views.isPositive && trends?.likes.isPositive
                              ? "Your content is engaging but reaching fewer people. Share your portfolio on social media to increase visibility."
                              : "Consider refreshing your portfolio content and sharing it on social media to boost performance."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Actions */}
      <motion.div className="flex flex-wrap gap-4 justify-end" variants={itemVariants}>
        <Button variant="outline" onClick={fetchAnalytics} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Portfolio
        </Button>
      </motion.div>
    </motion.div>
  )
}
