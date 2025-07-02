"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"
import {
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
  LineChart,
  Line,
} from "recharts"
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import type { ModuleWithProgress } from "@/src/lib/types"
import { modules, assignments } from "@/src/lib/database"
import { useAuth } from "@/src/lib/auth-context"

export default function ProgressPage() {
  const { user } = useAuth()
  const [assignedModules, setAssignedModules] = useState<ModuleWithProgress[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progressPercentage: 0,
  })

  useEffect(() => {
    if (user) {
      // Get assigned modules for current trainee
      const userAssignments = assignments.filter((assignment) => assignment.traineeId === user.id)

      const modulesWithProgress = userAssignments.map((assignment) => {
        const module = modules.find((m) => m.id === assignment.moduleId)
        return {
          ...module!,
          isCompleted: assignment.isCompleted,
          completedAt: assignment.completedAt,
        }
      })

      setAssignedModules(modulesWithProgress)

      // Calculate stats
      const total = modulesWithProgress.length
      const completed = modulesWithProgress.filter((m) => m.isCompleted).length
      const pending = total - completed
      const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats({ total, completed, pending, progressPercentage })
    }
  }, [user])

  // Data for charts
  const progressData = [
    { name: "Completed", value: stats.completed, color: "#10b981" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
  ]

  const monthlyData = [
    { month: "Jan", completed: 2 },
    { month: "Feb", completed: 1 },
    { month: "Mar", completed: 3 },
    { month: "Apr", completed: 0 },
    { month: "May", completed: 1 },
    { month: "Jun", completed: 2 },
  ]

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Progress Overview</h2>
            <p className="text-muted-foreground">Track your learning progress and achievements</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
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
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.progressPercentage}%</div>
                <Progress value={stats.progressPercentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Distribution</CardTitle>
                <CardDescription>Visual breakdown of completed vs pending modules</CardDescription>
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
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Completed ({stats.completed})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Pending ({stats.pending})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Modules completed over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* New Progress Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Timeline</CardTitle>
              <CardDescription>Your completion progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Module Progress Breakdown</CardTitle>
              <CardDescription>Individual module completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedModules.map((module, index) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{module.title}</span>
                      <Badge variant={module.isCompleted ? "default" : "secondary"}>
                        {module.isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <Progress value={module.isCompleted ? 100 : 0} className="h-2" />
                    {module.isCompleted && module.completedAt && (
                      <p className="text-xs text-gray-500">Completed on {module.completedAt.toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
  )
}
