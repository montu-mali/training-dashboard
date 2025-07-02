"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { BookOpen, Users, TrendingUp, Award, Calendar, Target, Plus, Eye } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface DashboardStats {
  totalModules: number
  totalTrainees: number
  activeAssignments: number
  completedAssignments: number
  completionRate: number
  avgProgress: number
}

interface ModuleProgress {
  moduleId: string
  title: string
  assigned: number
  completed: number
  completionRate: number
}

export function InstructorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalModules: 0,
    totalTrainees: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    completionRate: 0,
    avgProgress: 0,
  })
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [modulesRes, usersRes, assignmentsRes] = await Promise.all([
        fetch(`/api/modules?instructorId=${user?.id}`),
        fetch("/api/users?role=trainee"),
        fetch(`/api/assignments?instructorId=${user?.id}`),
      ])

      const [modulesData, usersData, assignmentsData] = await Promise.all([
        modulesRes.json(),
        usersRes.json(),
        assignmentsRes.json(),
      ])

      if (modulesRes.ok && usersRes.ok && assignmentsRes.ok) {
        const modules = modulesData.modules
        const trainees = usersData.users
        const assignments = assignmentsData.assignments

        // Calculate stats
        const completed = assignments.filter((a: any) => a.isCompleted).length
        const total = assignments.length
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

        // Calculate trainee progress
        const traineeProgress = trainees.map((trainee: any) => {
          const traineeAssignments = assignments.filter((a: any) => a.traineeId === trainee.id)
          const traineeCompleted = traineeAssignments.filter((a: any) => a.isCompleted).length
          return traineeAssignments.length > 0 ? (traineeCompleted / traineeAssignments.length) * 100 : 0
        })
        const avgProgress =
          traineeProgress.length > 0
            ? Math.round(traineeProgress.reduce((sum, prog) => sum + prog, 0) / traineeProgress.length)
            : 0

        setStats({
          totalModules: modules.length,
          totalTrainees: trainees.length,
          activeAssignments: total - completed,
          completedAssignments: completed,
          completionRate,
          avgProgress,
        })

        // Calculate module progress
        const moduleProgressData = modules.map((module: any) => {
          const moduleAssignments = assignments.filter((a: any) => a.moduleId === module.id)
          const moduleCompleted = moduleAssignments.filter((a: any) => a.isCompleted).length
          return {
            moduleId: module.id,
            title: module.title,
            assigned: moduleAssignments.length,
            completed: moduleCompleted,
            completionRate:
              moduleAssignments.length > 0 ? Math.round((moduleCompleted / moduleAssignments.length) * 100) : 0,
          }
        })
        setModuleProgress(moduleProgressData)

        // Recent activity (last 5 completed assignments)
        const recentCompletions = assignments
          .filter((a: any) => a.isCompleted && a.completedAt)
          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, 5)
          .map((assignment: any) => {
            const module = modules.find((m: any) => m.id === assignment.moduleId)
            const trainee = trainees.find((t: any) => t.id === assignment.traineeId)
            return {
              ...assignment,
              moduleName: module?.title || "Unknown Module",
              traineeName: trainee?.name || "Unknown Trainee",
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

  const chartData = moduleProgress.map((mp) => ({
    name: mp.title.length > 15 ? mp.title.substring(0, 15) + "..." : mp.title,
    completed: mp.completed,
    assigned: mp.assigned,
    rate: mp.completionRate,
  }))

  const progressDistribution = [
    { name: "Completed", value: stats.completedAssignments, color: "#10b981" },
    { name: "In Progress", value: stats.activeAssignments, color: "#f59e0b" },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Here's your training overview.</p>
          </div>
          <div className="flex space-x-3">
            <Button asChild>
              <Link href="/instructor">
                <Plus className="mr-2 h-4 w-4" />
                Create Module
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/instructor/analytics">
                <Eye className="mr-2 h-4 w-4" />
                View Analytics
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
              <div className="text-2xl font-bold">{stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">Created by you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalTrainees}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedAssignments}</div>
              <p className="text-xs text-muted-foreground">Finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Target className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Across trainees</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Module Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Module Progress Overview</CardTitle>
              <CardDescription>Completion rates by module</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="assigned" fill="#e5e7eb" name="Total Assigned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Status</CardTitle>
              <CardDescription>Overall completion distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {progressDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest module completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{activity.traineeName}</p>
                        <p className="text-sm text-gray-600">completed "{activity.moduleName}"</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(activity.completedAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">Module completions will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Manage Modules
              </CardTitle>
              <CardDescription>Create, edit, and organize your training content</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-600" />
                Manage Trainees
              </CardTitle>
              <CardDescription>Assign modules and track trainee progress</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                View Analytics
              </CardTitle>
              <CardDescription>Detailed insights and performance metrics</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
