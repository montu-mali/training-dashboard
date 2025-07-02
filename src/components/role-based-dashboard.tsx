"use client"

import { useAuth } from "@/src/lib/auth-context"
import { InstructorDashboard } from "./instructor-dashboard"
import { TraineeDashboard } from "./trainee-dashboard"
import { AdminDashboard } from "./admin-dashboard"
import { Loader2 } from "lucide-react"

export function RoleBasedDashboard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  switch (user.role) {
    case "instructor":
      return <InstructorDashboard />
    case "trainee":
      return <TraineeDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <div>Invalid user role</div>
  }
}
