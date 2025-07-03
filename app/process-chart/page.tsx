"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProcessChart } from "@/components/process-chart"

export default function ProcessChartPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ProcessChart />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
