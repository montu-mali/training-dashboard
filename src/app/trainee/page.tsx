"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Clock, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { ModuleWithProgress } from "@/src/lib/types";
import { useAuth } from "@/src/lib/auth-context";
import axios from "axios";
import { toast } from "@/src/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function TraineeDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignedModules, setAssignedModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingModules, setCompletingModules] = useState<Set<string>>(
    new Set()
  );
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progressPercentage: 0,
  });
  const [userTokan, setUserTokan] = useState("");

  useEffect(() => {
    const tokanId = Cookies.get("userTokan") as string;
    if (!tokanId) {
      router.push("/login");
    }
    setUserTokan(tokanId);
    if (tokanId) {
      // getOrderData(tokanId);
      fetchAssignedModules(tokanId);
    }
  }, []);

  const fetchAssignedModules = async (tokanId: string) => {
    try {
      setIsLoading(true);
      const [assignmentsResponse, modulesResponse] = await Promise.all([
        axios.get(`/api/assignments?traineeId=${tokanId}`),
        axios.get("/api/modules"),
      ]);

      const assignmentsData = await assignmentsResponse.data;
      const modulesData = await modulesResponse.data;

      if (assignmentsData.success && modulesData.success) {
        const assignments = assignmentsData.assignments;
        const modules = modulesData.modules;

        // const modulesWithProgress = assignments.map((assignment: any) => {
        //   const module = modules.find((m: any) => m.id === assignment.moduleId);
        //   return {
        //     ...module,
        //     assignmentId: assignment.id,
        //     completedAt: assignment.completedAt
        //       ? new Date(assignment.completedAt)
        //       : undefined,
        //   };
        // });

        setAssignedModules(assignments);

        // Calculate stats
        const total = assignmentsData.assignments.length;
        const completed = assignmentsData.assignments.filter(
          (e: any) => e.status === "COMPLETED"
        ).length;
        const pending = total - completed;
        const progressPercentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({ total, completed, pending, progressPercentage });
      }
    } catch (error) {
      console.error("Failed to fetch assigned modules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your modules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async (assignmentId: string) => {
    try {
      const response = await axios.put("/api/assignments", {
        assignmentId,
        status: "COMPLETED",
      });
      if (response.data.success) {
        toast({
          title: "Congratulations!",
          description: "Module completed successfully",
        });
        fetchAssignedModules(userTokan);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark module as complete",
        variant: "destructive",
      });
    } finally {
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            My Training Modules
          </h2>
          <p className="text-muted-foreground">
            Track your progress and complete assigned modules
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Modules
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.progressPercentage}%
              </div>
              <Progress value={stats.progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Assigned Modules</h3>

          {assignedModules.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {assignedModules.map((module: any) => (
                <Card
                  key={module.id}
                  className={
                    module.isCompleted ? "border-green-200 bg-green-50" : ""
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen
                          className={`h-6 w-6 ${
                            module?.status === "COMPLETED"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        />
                        {module.isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <Badge
                        variant={
                          module?.status === "COMPLETED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {module?.status === "COMPLETED"
                          ? "Completed"
                          : "Pending"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {module.content}
                    </p>

                    {module?.status === "COMPLETED" ? (
                      <div className="text-sm text-green-600">
                        ✓ Completed on {module.updatedAt.slice(0, 10)}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleMarkComplete(module.assignmentId)}
                        className="w-full"
                        disabled={completingModules.has(module.id)}
                      >
                        {completingModules.has(module.id) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          "Mark as Complete"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No modules assigned
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your instructor hasn't assigned any modules yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
