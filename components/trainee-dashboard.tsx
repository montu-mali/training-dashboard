"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { BookOpen, CheckCircle, Clock, TrendingUp, Award, Target, Calendar, Play } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface TraineeStats {
  totalAssigned: number
  completed: number
  pending: number
  progressPercentage: number
  streak: number
  avgScore: number
}

interface ModuleProgress {
  id: string
  title: string
  description: string
  isCompleted: boolean
  completedAt?: Date
  progress: number
}

export function TraineeDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<TraineeStats>({
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    progressPercentage: 0,
    streak: 0,
    avgScore: 0,
  })
  const [modules, setModules] = useState<ModuleProgress[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [assignmentsRes, modulesRes] = await Promise.all([
        fetch(`/api/assignments?traineeId=${user?.id}`),
        fetch("/api/modules"),
      ])

      const [assignmentsData, modulesData] = await Promise.all([assignmentsRes.json(), modulesRes.json()])

      if (assignmentsRes.ok && modulesRes.ok) {
        const assignments = assignmentsData.assignments
        const allModules = modulesData.modules

        // Calculate stats
        const completed = assignments.filter((a: any) => a.isCompleted).length
        const total = assignments.length
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

        // Calculate streak (consecutive days with completions)
        const completedAssignments = assignments
          .filter((a: any) => a.isCompleted && a.completedAt)
          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

        let streak = 0
        if (completedAssignments.length > 0) {
          const today = new Date()
          const lastCompletion = new Date(completedAssignments[0].completedAt)
          const daysDiff = Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24))

          if (daysDiff <= 1) {
            streak = 1
            // Count consecutive days
            for (let i = 1; i < completedAssignments.length; i++) {
              const current = new Date(completedAssignments[i - 1].completedAt)
              const previous = new Date(completedAssignments[i].completedAt)
              const diff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))
              if (diff === 1) {
                streak++
              } else {
                break
              }
            }
          }
        }

        setStats({
          totalAssigned: total,
          completed,
          pending: total - completed,
          progressPercentage,
          streak,
          avgScore: 85, // Mock average score
        })

        // Map modules with progress
        const modulesWithProgress = assignments.map((assignment: any) => {
          const module = allModules.find((m: any) => m.id === assignment.moduleId)
          return {
            id: assignment.id,
            title: module?.title || "Unknown Module",
            description: module?.description || "",
            isCompleted: assignment.isCompleted,
            completedAt: assignment.completedAt ? new Date(assignment.completedAt) : undefined,
            progress: assignment.isCompleted ? 100 : Math.floor(Math.random() * 60) + 20, // Mock progress
          }
        })
        setModules(modulesWithProgress)

        // Recent activity
        const recentCompletions = assignments
          .filter((a: any) => a.isCompleted && a.completedAt)
          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, 5)
          .map((assignment: any) => {
            const module = allModules.find((m: any) => m.id === assignment.moduleId)
            return {
              ...assignment,
              moduleName: module?.title || "Unknown Module",
            }
          })
        setRecentActivity(recentCompletions)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for charts
  const progressData = [
    { name: "Completed", value: stats.completed, color: "#10b981" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
  ]

  const weeklyProgress = [
    { day: "Mon", completed: 2 },
    { day: "Tue", completed: 1 },
    { day: "Wed", completed: 3 },
    { day: "Thu", completed: 0 },
    { day: "Fri", completed: 1 },
    { day: "Sat", completed: 2 },
    { day: "Sun", completed: 1 },
  ]

  const monthlyTrend = [
    { month: "Jan", progress: 20 },
    { month: "Feb", progress: 35 },
    { month: "Mar", progress: 50 },
    { month: "Apr", progress: 65 },
    { month: "May", progress: 80 },
    { month: "Jun", progress: stats.progressPercentage },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your progress...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Continue your learning journey.</p>
          </div>
          <div className="flex space-x-3">
            <Button asChild>
              <Link href="/trainee">
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/trainee/progress">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssigned}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Still to complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.progressPercentage}%</div>
              <Progress value={stats.progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Target className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.avgScore}%</div>
              <p className="text-xs text-muted-foreground">Performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Progress Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Modules completed this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Trend</CardTitle>
            <CardDescription>Your learning progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Current Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Current Modules</CardTitle>
            <CardDescription>Your assigned training modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.slice(0, 5).map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        module.isCompleted ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      {module.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} />
                    </div>
                    <Badge variant={module.isCompleted ? "default" : "secondary"}>
                      {module.isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Module Completed!</p>
                        <p className="text-sm text-gray-600">"{activity.moduleName}"</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(activity.completedAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">Complete modules to see your achievements here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
