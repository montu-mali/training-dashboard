"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CredentialManager } from "@/components/credential-manager"

export default function SettingsPage() {
  return (
      <DashboardLayout>
        <CredentialManager />
      </DashboardLayout>
  )
}
