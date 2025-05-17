"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Share2, BarChart3, TrendingUp, Calendar, Users, Globe } from "lucide-react"
import { useProfileAnalytics } from "@/hooks/use-profile-analytics"
import { useProfileStats } from "@/hooks/use-profile-stats"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AnalyticsDashboardProps {
  username: string
}

export default function AnalyticsDashboard({ username }: AnalyticsDashboardProps) {
  const { stats } = useProfileAnalytics(username)
  const { profileStats } = useProfileStats(username)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const viewsData = [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 18 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 25 },
    { name: "Fri", value: 32 },
    { name: "Sat", value: 28 },
    { name: "Sun", value: 20 },
  ]

  const sharesData = [
    { name: "Mon", value: 2 },
    { name: "Tue", value: 4 },
    { name: "Wed", value: 3 },
    { name: "Thu", value: 5 },
    { name: "Fri", value: 7 },
    { name: "Sat", value: 6 },
    { name: "Sun", value: 4 },
  ]

  const handleExportData = () => {
    // In a real app, this would generate a CSV or PDF
    toast({
      title: "Analytics Exported",
      description: "Your analytics data has been exported successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track how your portfolio is performing</p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.views}</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20) + 5}% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.shares}</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 15) + 2}% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 5}%</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 5) + 1}% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Views</CardTitle>
                <CardDescription>How your portfolio has been viewed over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-gray-50 rounded-md flex items-end justify-around p-4">
                  {viewsData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="bg-rose-500 rounded-t-md w-8" style={{ height: `${item.value * 4}px` }}></div>
                      <span className="text-xs text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Shares</CardTitle>
                <CardDescription>How your portfolio has been shared over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-gray-50 rounded-md flex items-end justify-around p-4">
                  {sharesData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="bg-blue-500 rounded-t-md w-8" style={{ height: `${item.value * 15}px` }}></div>
                      <span className="text-xs text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>How users are interacting with your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Average View Time</span>
                  </div>
                  <span className="font-medium">
                    {Math.floor(Math.random() * 3) + 1}m {Math.floor(Math.random() * 50) + 10}s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span>Share Rate</span>
                  </div>
                  <span className="font-medium">{Math.floor(Math.random() * 5) + 1}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>Bounce Rate</span>
                  </div>
                  <span className="font-medium">{Math.floor(Math.random() * 30) + 20}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Demographics</CardTitle>
              <CardDescription>Information about your portfolio visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Unique Visitors</span>
                  </div>
                  <span className="font-medium">{Math.floor(stats.views * 0.7)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Average Visits per Day</span>
                  </div>
                  <span className="font-medium">{Math.floor(stats.views / 30)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Top Countries</span>
                  </div>
                  <span className="font-medium">US, UK, Canada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
