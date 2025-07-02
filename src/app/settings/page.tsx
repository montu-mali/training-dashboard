"use client"

import { ProtectedRoute } from "@/src/components/protected-route"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import { CredentialManager } from "@/src/components/credential-manager"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CredentialManager />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
