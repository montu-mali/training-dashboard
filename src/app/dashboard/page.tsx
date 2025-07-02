"use client"

import { ProtectedRoute } from "@/src/components/protected-route"
import { RoleBasedDashboard } from "@/src/components/role-based-dashboard"


export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleBasedDashboard />
    </ProtectedRoute>
  )
}
