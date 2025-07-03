"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AnalyticsPage() {
  return (
      <DashboardLayout>
        <AnalyticsCharts />
      </DashboardLayout>
  )
}
