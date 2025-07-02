"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CredentialManager } from "@/components/credential-manager"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CredentialManager />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
