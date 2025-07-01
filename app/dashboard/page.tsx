"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { RoleBasedDashboard } from "@/components/role-based-dashboard"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleBasedDashboard />
    </ProtectedRoute>
  )
}
