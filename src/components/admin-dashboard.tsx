"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
} from "recharts"
import { Users, BookOpen, TrendingUp, Shield, Settings, UserPlus, Activity } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"
import { useAuth } from "@/src/lib/auth-context"

interface AdminStats {
  totalUsers: number
  totalInstructors: number
  totalTrainees: number
  totalModules: number
  totalAssignments: number
  systemHealth: number
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInstructors: 0,
    totalTrainees: 0,
    totalModules: 0,
    totalAssignments: 0,
    systemHealth: 98,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setIsLoading(true)
      const [usersRes, modulesRes, assignmentsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/modules"),
        fetch("/api/assignments"),
      ])

      const [usersData, modulesData, assignmentsData] = await Promise.all([
        usersRes.json(),
        modulesRes.json(),
        assignmentsRes.json(),
      ])

      if (usersRes.ok && modulesRes.ok && assignmentsRes.ok) {
        const users = usersData.users
        const instructors = users.filter((u: any) => u.role === "instructor")
        const trainees = users.filter((u: any) => u.role === "trainee")

        setStats({
          totalUsers: users.length,
          totalInstructors: instructors.length,
          totalTrainees: trainees.length,
          totalModules: modulesData.modules.length,
          totalAssignments: assignmentsData.assignments.length,
          systemHealth: 98,
        })
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for charts
  const userGrowth = [
    { month: "Jan", instructors: 5, trainees: 20 },
    { month: "Feb", instructors: 7, trainees: 35 },
    { month: "Mar", instructors: 8, trainees: 45 },
    { month: "Apr", instructors: 10, trainees: 60 },
    { month: "May", instructors: 12, trainees: 75 },
    { month: "Jun", instructors: stats.totalInstructors, trainees: stats.totalTrainees },
  ]

  const roleDistribution = [
    { name: "Trainees", value: stats.totalTrainees, color: "#3b82f6" },
    { name: "Instructors", value: stats.totalInstructors, color: "#10b981" },
  ]

  const systemMetrics = [
    { name: "CPU Usage", value: 45 },
    { name: "Memory", value: 62 },
    { name: "Storage", value: 38 },
    { name: "Network", value: 28 },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management controls</p>
          </div>
          <div className="flex space-x-3">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instructors</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalInstructors}</div>
              <p className="text-xs text-muted-foreground">Active instructors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trainees</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalTrainees}</div>
              <p className="text-xs text-muted-foreground">Learning users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">Training content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.systemHealth}%</div>
              <Progress value={stats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="instructors" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="trainees" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Role Distribution</CardTitle>
              <CardDescription>Breakdown of user types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time system resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-green-600" />
                Content Oversight
              </CardTitle>
              <CardDescription>Review and moderate training content</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                Analytics
              </CardTitle>
              <CardDescription>System-wide performance metrics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-orange-600" />
                System Config
              </CardTitle>
              <CardDescription>Configure system settings and preferences</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
