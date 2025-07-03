"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  UserCheck,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Play,
  Settings,
  BarChart3,
  Shield,
  Clock,
  Target,
  AlertCircle,
  FileText,
  Send,
  Eye,
} from "lucide-react"

interface ProcessStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  role: "instructor" | "trainee" | "admin" | "system"
  status: "pending" | "active" | "completed"
  dependencies?: string[]
  duration?: string
}

interface ProcessFlow {
  id: string
  name: string
  description: string
  steps: ProcessStep[]
  connections: Array<{ from: string; to: string; condition?: string }>
}

export function ProcessChart() {
  const [selectedFlow, setSelectedFlow] = useState("module-lifecycle")
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  const processFlows: ProcessFlow[] = [
    {
      id: "module-lifecycle",
      name: "Module Lifecycle",
      description: "Complete workflow from module creation to completion tracking",
      steps: [
        {
          id: "create-module",
          title: "Create Module",
          description: "Instructor creates new training content with title, description, and materials",
          icon: <BookOpen className="h-5 w-5" />,
          role: "instructor",
          status: "completed",
          duration: "15-30 min",
        },
        {
          id: "review-module",
          title: "Content Review",
          description: "Optional admin review for quality assurance and compliance",
          icon: <Eye className="h-5 w-5" />,
          role: "admin",
          status: "active",
          dependencies: ["create-module"],
          duration: "5-10 min",
        },
        {
          id: "assign-trainees",
          title: "Assign to Trainees",
          description: "Instructor selects trainees and assigns the module",
          icon: <Users className="h-5 w-5" />,
          role: "instructor",
          status: "pending",
          dependencies: ["review-module"],
          duration: "2-5 min",
        },
        {
          id: "notify-trainees",
          title: "Send Notifications",
          description: "System automatically notifies assigned trainees",
          icon: <Send className="h-5 w-5" />,
          role: "system",
          status: "pending",
          dependencies: ["assign-trainees"],
          duration: "Instant",
        },
        {
          id: "trainee-access",
          title: "Trainee Access",
          description: "Trainee logs in and views assigned modules",
          icon: <UserCheck className="h-5 w-5" />,
          role: "trainee",
          status: "pending",
          dependencies: ["notify-trainees"],
          duration: "Variable",
        },
        {
          id: "complete-module",
          title: "Complete Training",
          description: "Trainee works through content and marks as complete",
          icon: <CheckCircle className="h-5 w-5" />,
          role: "trainee",
          status: "pending",
          dependencies: ["trainee-access"],
          duration: "30-90 min",
        },
        {
          id: "track-progress",
          title: "Progress Tracking",
          description: "System tracks completion and updates analytics",
          icon: <BarChart3 className="h-5 w-5" />,
          role: "system",
          status: "pending",
          dependencies: ["complete-module"],
          duration: "Real-time",
        },
        {
          id: "generate-reports",
          title: "Generate Reports",
          description: "Instructor reviews completion reports and analytics",
          icon: <FileText className="h-5 w-5" />,
          role: "instructor",
          status: "pending",
          dependencies: ["track-progress"],
          duration: "5-15 min",
        },
      ],
      connections: [
        { from: "create-module", to: "review-module" },
        { from: "review-module", to: "assign-trainees", condition: "Approved" },
        { from: "assign-trainees", to: "notify-trainees" },
        { from: "notify-trainees", to: "trainee-access" },
        { from: "trainee-access", to: "complete-module" },
        { from: "complete-module", to: "track-progress" },
        { from: "track-progress", to: "generate-reports" },
      ],
    },
    {
      id: "user-onboarding",
      name: "User Onboarding",
      description: "Process for new user registration and role assignment",
      steps: [
        {
          id: "user-signup",
          title: "User Registration",
          description: "New user creates account with email and selects role",
          icon: <Users className="h-5 w-5" />,
          role: "system",
          status: "completed",
          duration: "2-3 min",
        },
        {
          id: "email-verification",
          title: "Email Verification",
          description: "System sends verification email to confirm account",
          icon: <Send className="h-5 w-5" />,
          role: "system",
          status: "active",
          dependencies: ["user-signup"],
          duration: "Instant",
        },
        {
          id: "admin-approval",
          title: "Admin Approval",
          description: "Admin reviews and approves new instructor accounts",
          icon: <Shield className="h-5 w-5" />,
          role: "admin",
          status: "pending",
          dependencies: ["email-verification"],
          duration: "1-24 hours",
        },
        {
          id: "profile-setup",
          title: "Profile Setup",
          description: "User completes profile information and preferences",
          icon: <Settings className="h-5 w-5" />,
          role: "instructor",
          status: "pending",
          dependencies: ["admin-approval"],
          duration: "5-10 min",
        },
        {
          id: "dashboard-access",
          title: "Dashboard Access",
          description: "User gains access to role-specific dashboard",
          icon: <Target className="h-5 w-5" />,
          role: "system",
          status: "pending",
          dependencies: ["profile-setup"],
          duration: "Instant",
        },
      ],
      connections: [
        { from: "user-signup", to: "email-verification" },
        { from: "email-verification", to: "admin-approval", condition: "If Instructor" },
        { from: "email-verification", to: "profile-setup", condition: "If Trainee" },
        { from: "admin-approval", to: "profile-setup", condition: "Approved" },
        { from: "profile-setup", to: "dashboard-access" },
      ],
    },
    {
      id: "progress-tracking",
      name: "Progress Tracking",
      description: "Real-time monitoring and analytics workflow",
      steps: [
        {
          id: "activity-capture",
          title: "Activity Capture",
          description: "System captures user interactions and progress data",
          icon: <Clock className="h-5 w-5" />,
          role: "system",
          status: "active",
          duration: "Real-time",
        },
        {
          id: "data-processing",
          title: "Data Processing",
          description: "Analytics engine processes and aggregates data",
          icon: <BarChart3 className="h-5 w-5" />,
          role: "system",
          status: "active",
          dependencies: ["activity-capture"],
          duration: "Real-time",
        },
        {
          id: "dashboard-update",
          title: "Dashboard Update",
          description: "Real-time updates to instructor and trainee dashboards",
          icon: <Target className="h-5 w-5" />,
          role: "system",
          status: "active",
          dependencies: ["data-processing"],
          duration: "Instant",
        },
        {
          id: "alert-generation",
          title: "Alert Generation",
          description: "System generates alerts for milestones and issues",
          icon: <AlertCircle className="h-5 w-5" />,
          role: "system",
          status: "active",
          dependencies: ["data-processing"],
          duration: "Instant",
        },
        {
          id: "report-generation",
          title: "Report Generation",
          description: "Automated generation of progress and completion reports",
          icon: <FileText className="h-5 w-5" />,
          role: "system",
          status: "active",
          dependencies: ["data-processing"],
          duration: "Scheduled",
        },
      ],
      connections: [
        { from: "activity-capture", to: "data-processing" },
        { from: "data-processing", to: "dashboard-update" },
        { from: "data-processing", to: "alert-generation" },
        { from: "data-processing", to: "report-generation" },
      ],
    },
  ]

  const currentFlow = processFlows.find((flow) => flow.id === selectedFlow)!

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "trainee":
        return "bg-green-100 text-green-800 border-green-200"
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "pending":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  const getStepPosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total))
    const row = Math.floor(index / cols)
    const col = index % cols
    return { row, col, cols }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Process Flow Charts</h2>
        <p className="text-muted-foreground">
          Visualize the complete workflows and processes in the training management system
        </p>
      </div>

      <Tabs value={selectedFlow} onValueChange={setSelectedFlow}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="module-lifecycle">Module Lifecycle</TabsTrigger>
          <TabsTrigger value="user-onboarding">User Onboarding</TabsTrigger>
          <TabsTrigger value="progress-tracking">Progress Tracking</TabsTrigger>
        </TabsList>

        {processFlows.map((flow) => (
          <TabsContent key={flow.id} value={flow.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{flow.name}</CardTitle>
                <CardDescription>{flow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Process Flow Diagram */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Process Flow</h4>
                    <div className="relative bg-gray-50 p-6 rounded-lg min-h-[600px]">
                      {flow.steps.map((step, index) => {
                        const position = getStepPosition(index, flow.steps.length)
                        const isSelected = selectedStep === step.id

                        return (
                          <div
                            key={step.id}
                            className="absolute"
                            style={{
                              left: `${(position.col * 100) / position.cols + 10}%`,
                              top: `${position.row * 120 + 20}px`,
                              width: `${80 / position.cols}%`,
                            }}
                          >
                            <div
                              className={`relative p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <div className={`p-1 rounded ${getRoleColor(step.role)}`}>{step.icon}</div>
                                <div
                                  className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`}
                                  title={step.status}
                                />
                              </div>
                              <h5 className="font-medium text-sm mb-1">{step.title}</h5>
                              <Badge variant="outline" className={`text-xs ${getRoleColor(step.role)}`}>
                                {step.role}
                              </Badge>
                              {step.duration && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  {step.duration}
                                </div>
                              )}
                            </div>

                            {/* Connection arrows */}
                            {flow.connections
                              .filter((conn) => conn.from === step.id)
                              .map((conn, connIndex) => {
                                const toIndex = flow.steps.findIndex((s) => s.id === conn.to)
                                const toPosition = getStepPosition(toIndex, flow.steps.length)

                                if (toPosition.row === position.row && toPosition.col === position.col + 1) {
                                  // Horizontal arrow
                                  return (
                                    <div
                                      key={connIndex}
                                      className="absolute top-1/2 -right-4 transform -translate-y-1/2"
                                    >
                                      <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )
                                } else if (toPosition.row === position.row + 1) {
                                  // Vertical arrow
                                  return (
                                    <div
                                      key={connIndex}
                                      className="absolute bottom-0 left-1/2 transform translate-y-2 -translate-x-1/2"
                                    >
                                      <ArrowDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )
                                }
                                return null
                              })}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Step Details</h4>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {flow.steps.map((step) => (
                        <Card
                          key={step.id}
                          className={`cursor-pointer transition-all ${
                            selectedStep === step.id ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded ${getRoleColor(step.role)}`}>{step.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium">{step.title}</h5>
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(step.status)}`} />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <Badge variant="outline" className={getRoleColor(step.role)}>
                                    {step.role}
                                  </Badge>
                                  {step.duration && (
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {step.duration}
                                    </span>
                                  )}
                                  <span className="capitalize">{step.status}</span>
                                </div>
                                {step.dependencies && step.dependencies.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Depends on:</span>{" "}
                                    {step.dependencies
                                      .map((dep) => flow.steps.find((s) => s.id === dep)?.title)
                                      .join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Total Steps</p>
                      <p className="text-2xl font-bold">{flow.steps.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {flow.steps.filter((s) => s.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {flow.steps.filter((s) => s.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {flow.steps.filter((s) => s.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                    <span className="text-sm">Instructor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-sm">Trainee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                    <span className="text-sm">Admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                    <span className="text-sm">System</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
