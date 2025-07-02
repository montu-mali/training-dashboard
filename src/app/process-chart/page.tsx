"use client"

import { ProtectedRoute } from "@/src/components/protected-route"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import { ProcessChart } from "@/src/components/process-chart"

export default function ProcessChartPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ProcessChart />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
