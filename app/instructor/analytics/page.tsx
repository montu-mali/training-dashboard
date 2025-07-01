"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Users, BookOpen, TrendingUp, Award, Calendar, Target } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { TraineeWithProgress } from "@/lib/types"
import { users, modules, assignments } from "@/lib/database"

export default function AnalyticsPage() {
  const [trainees, setTrainees] = useState<TraineeWithProgress[]>([])
  const [analytics, setAnalytics] = useState({
    totalTrainees: 0,
    totalModules: 0,
    totalAssignments: 0,
    completionRate: 0,
    activeTrainees: 0,
  })

  useEffect(() => {
    // Get all trainees with their progress
    const traineeUsers = users.filter((user) => user.role === "trainee")

    const traineesWithProgress = traineeUsers.map((trainee) => {
      const traineeAssignments = assignments.filter((assignment) => assignment.traineeId === trainee.id)
      const totalModules = traineeAssignments.length
      const completedModules = traineeAssignments.filter((assignment) => assignment.isCompleted).length
      const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

      return {
        ...trainee,
        totalModules,
        completedModules,
        progressPercentage,
      }
    })

    setTrainees(traineesWithProgress)

    // Calculate analytics
    const totalAssignments = assignments.length
    const completedAssignments = assignments.filter((a) => a.isCompleted).length
    const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
    const activeTrainees = traineesWithProgress.filter((t) => t.totalModules > 0).length

    setAnalytics({
      totalTrainees: traineeUsers.length,
      totalModules: modules.length,
      totalAssignments,
      completionRate,
      activeTrainees,
    })
  }, [])

  // Chart data
  const traineeProgressData = trainees.map((trainee) => ({
    name: trainee.name.split(" ")[0], // First name only
    completed: trainee.completedModules,
    total: trainee.totalModules,
    percentage: trainee.progressPercentage,
  }))

  const moduleCompletionData = modules.map((module) => {
    const moduleAssignments = assignments.filter((a) => a.moduleId === module.id)
    const completedCount = moduleAssignments.filter((a) => a.isCompleted).length
    return {
      name: module.title.length > 15 ? module.title.substring(0, 15) + "..." : module.title,
      assigned: moduleAssignments.length,
      completed: completedCount,
      completionRate: moduleAssignments.length > 0 ? Math.round((completedCount / moduleAssignments.length) * 100) : 0,
    }
  })

  const progressDistribution = [
    { name: "Completed", value: assignments.filter((a) => a.isCompleted).length, color: "#10b981" },
    { name: "In Progress", value: assignments.filter((a) => !a.isCompleted).length, color: "#f59e0b" },
  ]

  // Monthly progress simulation
  const monthlyProgressData = [
    { month: "Jan", completed: 8, assigned: 12 },
    { month: "Feb", completed: 15, assigned: 18 },
    { month: "Mar", completed: 22, assigned: 25 },
    { month: "Apr", completed: 18, assigned: 22 },
    { month: "May", completed: 25, assigned: 28 },
    { month: "Jun", completed: 30, assigned: 32 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <ProtectedRoute requiredRole="instructor">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive training progress and performance metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalTrainees}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trainees</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.activeTrainees}</div>
                <p className="text-xs text-muted-foreground">With assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalModules}</div>
                <p className="text-xs text-muted-foreground">Available content</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{analytics.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">Total assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Award className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{analytics.completionRate}%</div>
                <Progress value={analytics.completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {trainees.length > 0
                    ? Math.round(trainees.reduce((sum, t) => sum + t.progressPercentage, 0) / trainees.length)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Across all trainees</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Trainee Progress Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trainee Progress Overview</CardTitle>
                <CardDescription>Individual progress by trainee</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={traineeProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === "completed" ? "Completed" : name === "total" ? "Total" : "Percentage",
                      ]}
                    />
                    <Bar dataKey="completed" fill="#10b981" name="completed" />
                    <Bar dataKey="total" fill="#e5e7eb" name="total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Status Distribution</CardTitle>
                <CardDescription>Overall completion status</CardDescription>
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
                    >
                      {progressDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Module Completion Rates</CardTitle>
                <CardDescription>Performance by training module</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moduleCompletionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, "Completion Rate"]} />
                    <Bar dataKey="completionRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress Trend</CardTitle>
                <CardDescription>Assignment completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="assigned" stackId="1" stroke="#e5e7eb" fill="#e5e7eb" />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Progress Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Trainee Progress</CardTitle>
              <CardDescription>Comprehensive view of individual trainee performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainees.map((trainee) => (
                  <div key={trainee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{trainee.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{trainee.name}</h4>
                        <p className="text-sm text-gray-600">{trainee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{trainee.completedModules}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{trainee.totalModules}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{trainee.progressPercentage}%</span>
                        </div>
                        <Progress value={trainee.progressPercentage} />
                      </div>
                      <Badge
                        variant={
                          trainee.progressPercentage === 100
                            ? "default"
                            : trainee.progressPercentage > 50
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {trainee.progressPercentage === 100
                          ? "Complete"
                          : trainee.progressPercentage > 50
                            ? "Good Progress"
                            : "Getting Started"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {trainees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No trainees</h3>
                  <p className="mt-1 text-sm text-gray-500">No trainees have been assigned modules yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
