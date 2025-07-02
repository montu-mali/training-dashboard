"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
  Legend,
  LabelList,
} from "recharts"
import { TrendingUp, Users, BookOpen, Clock, Target, Activity, Zap, Download, RefreshCw } from "lucide-react"
import { useAuth } from "@/src/lib/auth-context"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalModules: number
    completionRate: number
    avgTimeSpent: number
    engagementScore: number
  }
  userEngagement: Array<{
    date: string
    activeUsers: number
    newUsers: number
    returningUsers: number
    sessionDuration: number
  }>
  modulePerformance: Array<{
    moduleId: string
    title: string
    enrollments: number
    completions: number
    avgScore: number
    avgTimeSpent: number
    difficulty: string
    category: string
  }>
  learningProgress: Array<{
    week: string
    completed: number
    started: number
    dropped: number
    avgProgress: number
  }>
  userBehavior: Array<{
    hour: number
    activity: number
    completions: number
    logins: number
  }>
  skillsAssessment: Array<{
    skill: string
    before: number
    after: number
    improvement: number
  }>
  geographicData: Array<{
    region: string
    users: number
    completionRate: number
    avgScore: number
  }>
  cohortAnalysis: Array<{
    cohort: string
    week1: number
    week2: number
    week3: number
    week4: number
    retention: number
  }>
}

export function AnalyticsCharts() {
  const { user } = useAuth()
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalModules: 45,
      completionRate: 78.5,
      avgTimeSpent: 42.3,
      engagementScore: 8.7,
    },
    userEngagement: [
      { date: "2024-06-01", activeUsers: 120, newUsers: 15, returningUsers: 105, sessionDuration: 35 },
      { date: "2024-06-02", activeUsers: 135, newUsers: 22, returningUsers: 113, sessionDuration: 38 },
      { date: "2024-06-03", activeUsers: 142, newUsers: 18, returningUsers: 124, sessionDuration: 41 },
      { date: "2024-06-04", activeUsers: 128, newUsers: 12, returningUsers: 116, sessionDuration: 36 },
      { date: "2024-06-05", activeUsers: 156, newUsers: 28, returningUsers: 128, sessionDuration: 44 },
      { date: "2024-06-06", activeUsers: 148, newUsers: 20, returningUsers: 128, sessionDuration: 42 },
      { date: "2024-06-07", activeUsers: 134, newUsers: 16, returningUsers: 118, sessionDuration: 39 },
    ],
    modulePerformance: [
      {
        moduleId: "1",
        title: "Safety Protocols",
        enrollments: 245,
        completions: 198,
        avgScore: 87.5,
        avgTimeSpent: 45,
        difficulty: "Beginner",
        category: "Safety",
      },
      {
        moduleId: "2",
        title: "Communication Skills",
        enrollments: 189,
        completions: 142,
        avgScore: 82.3,
        avgTimeSpent: 62,
        difficulty: "Intermediate",
        category: "Soft Skills",
      },
      {
        moduleId: "3",
        title: "Leadership Training",
        enrollments: 156,
        completions: 98,
        avgScore: 79.8,
        avgTimeSpent: 78,
        difficulty: "Advanced",
        category: "Leadership",
      },
      {
        moduleId: "4",
        title: "Digital Literacy",
        enrollments: 203,
        completions: 167,
        avgScore: 85.2,
        avgTimeSpent: 38,
        difficulty: "Beginner",
        category: "Technology",
      },
    ],
    learningProgress: [
      { week: "Week 1", completed: 45, started: 120, dropped: 8, avgProgress: 25 },
      { week: "Week 2", completed: 67, started: 98, dropped: 12, avgProgress: 45 },
      { week: "Week 3", completed: 89, started: 76, dropped: 15, avgProgress: 65 },
      { week: "Week 4", completed: 102, started: 54, dropped: 18, avgProgress: 78 },
      { week: "Week 5", completed: 78, started: 42, dropped: 10, avgProgress: 82 },
      { week: "Week 6", completed: 95, started: 38, dropped: 8, avgProgress: 88 },
    ],
    userBehavior: [
      { hour: 6, activity: 12, completions: 2, logins: 8 },
      { hour: 7, activity: 28, completions: 5, logins: 18 },
      { hour: 8, activity: 45, completions: 12, logins: 32 },
      { hour: 9, activity: 78, completions: 25, logins: 56 },
      { hour: 10, activity: 92, completions: 32, logins: 68 },
      { hour: 11, activity: 85, completions: 28, logins: 62 },
      { hour: 12, activity: 65, completions: 18, logins: 45 },
      { hour: 13, activity: 72, completions: 22, logins: 52 },
      { hour: 14, activity: 88, completions: 30, logins: 64 },
      { hour: 15, activity: 95, completions: 35, logins: 72 },
      { hour: 16, activity: 82, completions: 28, logins: 58 },
      { hour: 17, activity: 68, completions: 20, logins: 48 },
      { hour: 18, activity: 45, completions: 12, logins: 32 },
      { hour: 19, activity: 32, completions: 8, logins: 22 },
      { hour: 20, activity: 25, completions: 5, logins: 18 },
      { hour: 21, activity: 18, completions: 3, logins: 12 },
    ],
    skillsAssessment: [
      { skill: "Communication", before: 6.2, after: 8.4, improvement: 35.5 },
      { skill: "Leadership", before: 5.8, after: 7.9, improvement: 36.2 },
      { skill: "Problem Solving", before: 6.5, after: 8.2, improvement: 26.2 },
      { skill: "Technical Skills", before: 7.1, after: 8.8, improvement: 23.9 },
      { skill: "Teamwork", before: 6.8, after: 8.6, improvement: 26.5 },
      { skill: "Time Management", before: 5.9, after: 7.7, improvement: 30.5 },
    ],
    geographicData: [
      { region: "North America", users: 456, completionRate: 82.3, avgScore: 87.2 },
      { region: "Europe", users: 342, completionRate: 79.8, avgScore: 85.6 },
      { region: "Asia Pacific", users: 289, completionRate: 85.1, avgScore: 89.1 },
      { region: "Latin America", users: 123, completionRate: 76.4, avgScore: 83.8 },
      { region: "Africa", users: 87, completionRate: 73.2, avgScore: 81.5 },
    ],
    cohortAnalysis: [
      { cohort: "Jan 2024", week1: 100, week2: 85, week3: 72, week4: 65, retention: 65 },
      { cohort: "Feb 2024", week1: 100, week2: 88, week3: 76, week4: 68, retention: 68 },
      { cohort: "Mar 2024", week1: 100, week2: 82, week3: 69, week4: 61, retention: 61 },
      { cohort: "Apr 2024", week1: 100, week2: 90, week3: 78, week4: 72, retention: 72 },
      { cohort: "May 2024", week1: 100, week2: 87, week3: 74, week4: 67, retention: 67 },
      { cohort: "Jun 2024", week1: 100, week2: 92, week3: 81, week4: 75, retention: 75 },
    ],
  })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const exportData = () => {
    // Simulate data export
    console.log("Exporting analytics data...")
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into training performance and user engagement</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {["7d", "30d", "90d", "1y"].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.overview.activeUsers}</div>
            <div className="text-xs text-muted-foreground">
              {((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.overview.completionRate}%</div>
            <Progress value={analyticsData.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.avgTimeSpent}m</div>
            <div className="text-xs text-muted-foreground">Per session</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analyticsData.overview.engagementScore}/10</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{analyticsData.overview.totalModules}</div>
            <div className="text-xs text-muted-foreground">Available content</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        {/* User Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Active Users */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>User activity trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.userEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      stroke="#3b82f6"
                      name="Active Users"
                    />
                    <Bar dataKey="newUsers" fill="#10b981" name="New Users" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Session Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Average Session Duration</CardTitle>
                <CardDescription>Time spent per session in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.userEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="sessionDuration"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                      name="Session Duration (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Learning Progress Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Funnel</CardTitle>
              <CardDescription>Weekly progression through learning stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.learningProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="started" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Started" />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Completed"
                  />
                  <Area type="monotone" dataKey="dropped" stackId="1" stroke="#ef4444" fill="#ef4444" name="Dropped" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Module Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Module Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Module Completion Rates</CardTitle>
                <CardDescription>Success rates by module</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.modulePerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="title" type="category" width={120} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${(((value as number) / analyticsData.modulePerformance.find((m) => m.title === name)!.enrollments) * 100).toFixed(1)}%`,
                        "Completion Rate",
                      ]}
                    />
                    <Bar
                      dataKey="completions"
                      fill="#10b981"
                      name="Completions"
                      radius={[0, 4, 4, 0]}
                      label={{ position: "right" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Average Scores by Module</CardTitle>
                <CardDescription>Performance metrics across modules</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData.modulePerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="title" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Average Score"
                      dataKey="avgScore"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Module Performance Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Module Performance Matrix</CardTitle>
              <CardDescription>Enrollment vs completion rate analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={analyticsData.modulePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="enrollments" name="Enrollments" />
                  <YAxis dataKey="avgScore" name="Avg Score" domain={[70, 95]} />
                  <ZAxis dataKey="completions" range={[50, 400]} name="Completions" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium">{data.title}</p>
                            <p>Enrollments: {data.enrollments}</p>
                            <p>Completions: {data.completions}</p>
                            <p>Avg Score: {data.avgScore}%</p>
                            <p>Completion Rate: {((data.completions / data.enrollments) * 100).toFixed(1)}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter name="Modules" fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Module Categories Performance */}
          <div className="grid gap-4 md:grid-cols-4">
            {["Safety", "Soft Skills", "Leadership", "Technology"].map((category, index) => {
              const categoryModules = analyticsData.modulePerformance.filter((m) => m.category === category)
              const avgCompletion =
                categoryModules.reduce((sum, m) => sum + (m.completions / m.enrollments) * 100, 0) /
                categoryModules.length
              const avgScore = categoryModules.reduce((sum, m) => sum + m.avgScore, 0) / categoryModules.length

              return (
                <Card key={category}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category}</h4>
                      <Badge variant="outline">{categoryModules.length} modules</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span>{avgCompletion.toFixed(1)}%</span>
                        </div>
                        <Progress value={avgCompletion} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Avg Score</span>
                          <span>{avgScore.toFixed(1)}%</span>
                        </div>
                        <Progress value={avgScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hourly Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity Pattern</CardTitle>
                <CardDescription>User activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.userBehavior}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `${value}:00`}
                      formatter={(value, name) => [value, name === "activity" ? "Total Activity" : name]}
                    />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Activity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Login vs Completion Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Login vs Completion Patterns</CardTitle>
                <CardDescription>Correlation between logins and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.userBehavior}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => `${value}:00`} />
                    <Legend />
                    <Bar dataKey="logins" fill="#10b981" name="Logins" />
                    <Line type="monotone" dataKey="completions" stroke="#f59e0b" strokeWidth={3} name="Completions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Peak Activity Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Activity Analysis</CardTitle>
              <CardDescription>Identifying optimal training times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">10:00 AM</div>
                  <div className="text-sm text-blue-800">Peak Activity Hour</div>
                  <div className="text-xs text-gray-600">95 active users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3:00 PM</div>
                  <div className="text-sm text-green-800">Peak Completion Hour</div>
                  <div className="text-xs text-gray-600">35 completions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">9:00 AM</div>
                  <div className="text-sm text-purple-800">Peak Login Hour</div>
                  <div className="text-xs text-gray-600">72 logins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Assessment Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skills Improvement */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Improvement</CardTitle>
                <CardDescription>Before vs after training comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.skillsAssessment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill="#ef4444" name="Before Training" />
                    <Bar dataKey="after" fill="#10b981" name="After Training" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Improvement Percentage */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Percentage</CardTitle>
                <CardDescription>Percentage improvement by skill area</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.skillsAssessment} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 40]} />
                    <YAxis dataKey="skill" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, "Improvement"]} />
                    <Bar dataKey="improvement" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="improvement" position="right" formatter={(value: number) => `${value}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Skills Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment Radar</CardTitle>
              <CardDescription>Comprehensive skills comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analyticsData.skillsAssessment}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Before Training"
                    dataKey="before"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="After Training"
                    dataKey="after"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Region</CardTitle>
                <CardDescription>Geographic spread of users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.geographicData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="users"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Completion rates and scores by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.geographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="completionRate" fill="#3b82f6" name="Completion Rate %" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Avg Score"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Regional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Details</CardTitle>
              <CardDescription>Detailed metrics by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.geographicData.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <h4 className="font-medium">{region.region}</h4>
                        <p className="text-sm text-gray-600">{region.users} users</p>
                      </div>
                    </div>
                    <div className="flex space-x-8 text-right">
                      <div>
                        <div className="text-sm font-medium">{region.completionRate}%</div>
                        <div className="text-xs text-gray-500">Completion Rate</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{region.avgScore}%</div>
                        <div className="text-xs text-gray-500">Avg Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cohort Analysis Tab */}
        <TabsContent value="cohorts" className="space-y-6">
          {/* Cohort Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>User retention patterns by signup cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.cohortAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="week1" stroke="#3b82f6" strokeWidth={2} name="Week 1" />
                  <Line type="monotone" dataKey="week2" stroke="#10b981" strokeWidth={2} name="Week 2" />
                  <Line type="monotone" dataKey="week3" stroke="#f59e0b" strokeWidth={2} name="Week 3" />
                  <Line type="monotone" dataKey="week4" stroke="#ef4444" strokeWidth={2} name="Week 4" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Retention Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Retention Heatmap</CardTitle>
              <CardDescription>Visual representation of cohort retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-600">
                  <div>Cohort</div>
                  <div>Week 1</div>
                  <div>Week 2</div>
                  <div>Week 3</div>
                  <div>Week 4</div>
                  <div>Final Retention</div>
                </div>
                {analyticsData.cohortAnalysis.map((cohort) => (
                  <div key={cohort.cohort} className="grid grid-cols-6 gap-2 text-sm">
                    <div className="font-medium">{cohort.cohort}</div>
                    <div
                      className="text-center p-2 rounded text-white"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${cohort.week1 / 100})` }}
                    >
                      {cohort.week1}%
                    </div>
                    <div
                      className="text-center p-2 rounded text-white"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${cohort.week2 / 100})` }}
                    >
                      {cohort.week2}%
                    </div>
                    <div
                      className="text-center p-2 rounded text-white"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${cohort.week3 / 100})` }}
                    >
                      {cohort.week3}%
                    </div>
                    <div
                      className="text-center p-2 rounded text-white"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${cohort.week4 / 100})` }}
                    >
                      {cohort.week4}%
                    </div>
                    <div className="text-center p-2 rounded bg-gray-100 font-medium">{cohort.retention}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cohort Insights */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Best Performing Cohort</p>
                    <p className="text-2xl font-bold text-green-600">Jun 2024</p>
                    <p className="text-xs text-gray-600">75% retention rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Average Retention</p>
                    <p className="text-2xl font-bold text-blue-600">68%</p>
                    <p className="text-xs text-gray-600">Across all cohorts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Improvement Trend</p>
                    <p className="text-2xl font-bold text-purple-600">+7%</p>
                    <p className="text-xs text-gray-600">Recent vs older cohorts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
