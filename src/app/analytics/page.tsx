"use client"

import { AnalyticsCharts } from "@/src/components/analytics-charts"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import { ProtectedRoute } from "@/src/components/protected-route"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnalyticsCharts />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
