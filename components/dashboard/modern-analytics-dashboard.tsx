"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronDown } from "lucide-react"
import { clientAnalytics } from "@/lib/analytics-service"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart as TremorAreaChart, BarChart as TremorBarChart } from "@tremor/react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Types
interface AnalyticsDashboardProps {
  profileId: string
  username: string
  className?: string
}

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  viewsByDay: { date: string; count: number }[]
  // Add more as needed
}

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
      stiffness: 100,
      damping: 15,
    },
  },
}

// Helper components
const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  loading = false,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  change?: number
  changeType?: "positive" | "negative" | "neutral"
  loading?: boolean
}) => {
  const changeColor =
    changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-gray-500"

  const changeIcon = changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "•"

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
          </div>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${changeColor}`}>
              <span className="mr-1">{changeIcon}</span>
              {Math.abs(change)}% from last period
            </p>
          )}
        </>
      )}
    </motion.div>
  )
}

const TimeRangeSelector = ({
  selectedRange,
  onChange,
}: {
  selectedRange: string
  onChange: (range: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const ranges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
    { value: "all", label: "All time" },
  ]

  const selectedLabel = ranges.find((r) => r.value === selectedRange)?.label || ranges[0].label

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} />
        <span>{selectedLabel}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {ranges.map((range) => (
              <button
                key={range.value}
                className={`block w-full text-left px-4 py-2 text-sm ${selectedRange === range.value ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                onClick={() => {
                  onChange(range.value)
                  setIsOpen(false)
                }}
              >
                {range.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main component
export function ModernAnalyticsDashboard({ profileId, username, className }: AnalyticsDashboardProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    shares: 0,
  })
  const [viewsData, setViewsData] = useState<{ date: string; views: number }[]>([])
  const [likesData, setLikesData] = useState<{ date: string; likes: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Fetch basic stats
        const period = timeRangeToPeriod(timeRange)
        const statsData = await clientAnalytics.getProfileStats(profileId, period)
        setStats(statsData)

        // Fetch time series data (mock data for now)
        const mockViewsData = generateMockTimeSeriesData(timeRange, "views")
        const mockLikesData = generateMockTimeSeriesData(timeRange, "likes")
        setViewsData(mockViewsData)
        setLikesData(mockLikesData)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [profileId, timeRange])

  // Helper function to convert time range to period
  const timeRangeToPeriod = (range: string) => {
    switch (range) {
      case "7d":
        return "week"
      case "30d":
        return "month"
      case "90d":
        return "year"
      case "all":
      default:
        return "all"
    }
  }

  // Generate mock time series data
  const generateMockTimeSeriesData = (range: string, type: "views" | "likes") => {
    const data = []
    const now = new Date()
    let days = 30

    switch (range) {
      case "7d":
        days = 7
        break
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
      case "all":
        days = 365
        break
    }

    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Generate random data with some patterns
      let value = Math.floor(Math.random() * 10)
      if (type === "views") {
        // Views tend to be higher
        value = Math.floor(Math.random() * 20) + 5
      }

      // Add some weekly patterns
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekends have higher engagement
        value = Math.floor(value * 1.5)
      }

      data.push({
        date: dateStr,
        [type]: value,
      })
    }

    return data
  }

  return (
    <motion.div
      className={cn("p-6 space-y-8", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your portfolio performance and engagement metrics</p>
        </div>
        <Tabs
          defaultValue="30d"
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as any)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
            <TabsTrigger value="7d">Last 7 days</TabsTrigger>
            <TabsTrigger value="30d">Last 30 days</TabsTrigger>
            <TabsTrigger value="90d">Last 90 days</TabsTrigger>
            <TabsTrigger value="all">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Overview */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.views}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[100px]">
                <TremorAreaChart
                  className="h-[100px] mt-4"
                  data={viewsData}
                  index="date"
                  categories={["views"]}
                  colors={["blue"]}
                  showXAxis={false}
                  showYAxis={false}
                  showLegend={false}
                  showGridLines={false}
                  showAnimation={true}
                  autoMinValue={true}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Total Likes</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.likes}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[100px]">
                <TremorAreaChart
                  className="h-[100px] mt-4"
                  data={likesData}
                  index="date"
                  categories={["likes"]}
                  colors={["rose"]}
                  showXAxis={false}
                  showYAxis={false}
                  showLegend={false}
                  showGridLines={false}
                  showAnimation={true}
                  autoMinValue={true}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Profile Link</CardDescription>
              <CardTitle className="text-lg font-medium truncate">
                {`${typeof window !== "undefined" ? window.location.origin : ""}/${username}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined") {
                      navigator.clipboard.writeText(`${window.location.origin}/${username}`)
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          `${window.location.origin}/${username}`,
                        )}&text=Check out my portfolio!`,
                        "_blank",
                      )
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Share
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detailed charts */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Track how your portfolio views change over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TremorAreaChart
                className="h-[300px]"
                data={viewsData}
                index="date"
                categories={["views"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} views`}
                showAnimation={true}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Likes Over Time</CardTitle>
            <CardDescription>Track how your portfolio likes change over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TremorBarChart
                className="h-[300px]"
                data={likesData}
                index="date"
                categories={["likes"]}
                colors={["rose"]}
                valueFormatter={(value) => `${value} likes`}
                showAnimation={true}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips for improving engagement */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Tips to Improve Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  1
                </span>
                <span className="text-gray-600">
                  Share your portfolio on social media platforms to increase visibility
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  2
                </span>
                <span className="text-gray-600">Add more projects with detailed descriptions and images</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  3
                </span>
                <span className="text-gray-600">Keep your skills and experience up to date</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  4
                </span>
                <span className="text-gray-600">Include a professional profile photo and a compelling bio</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
