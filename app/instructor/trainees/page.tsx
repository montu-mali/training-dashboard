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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { TraineeWithProgress, Module } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { decrypt } from "@/lib/data-fetching";
import { useRouter } from "next/navigation";

export default function TraineesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { push } = useRouter();
  const [trainees, setTrainees] = useState<TraineeWithProgress[]>([]);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [selectedTrainee, setSelectedTrainee] =
    useState<TraineeWithProgress | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [userTokan, setUserTokan] = useState("");

  const selectAssignModule = (assignmentModul: any) => {
    const moduleIds = assignmentModul.map((a: any) => a.moduleId);
    setSelectedModules(moduleIds);
  };

  useEffect(() => {
    const tokanId = Cookies.get("instructorTokan") as string;
    if (!tokanId) {
      push("/login");
    }
    setUserTokan(tokanId);
    if (tokanId) {
      fetchTrainees(tokanId);
      fetchModules(tokanId);
      getAssignedModules(tokanId);
    }
  }, []);

  const fetchTrainees = async (tokanId: string) => {
    try {
      setIsLoading(true);
      const [usersResponse, assignmentsResponse] = await Promise.all([
        axios.get("/api/users?role=TRAINEE"),
        axios.get(`/api/assignments?instructorId=${tokanId}`),
      ]);

      const usersData = usersResponse.data;
      const assignmentsData = assignmentsResponse.data;
      setTrainees(usersData);

      if (usersData.success && assignmentsData.success) {
        const traineeUsers = usersData.users;
        const assignments = assignmentsData.assignments;

        const traineesWithProgress = traineeUsers.map((trainee: any) => {
          const traineeAssignments = assignments.filter(
            (assignment: any) => assignment.traineeId === trainee.id
          );
          const totalModules = traineeAssignments.length;
          const completedModules = traineeAssignments.filter(
            (assignment: any) => assignment.isCompleted
          ).length;
          const progressPercentage =
            totalModules > 0
              ? Math.round((completedModules / totalModules) * 100)
              : 0;

          return {
            ...trainee,
            totalModules,
            completedModules,
            progressPercentage,
          };
        });

        setTrainees(traineesWithProgress);
      }
    } catch (error) {
      console.error("Failed to fetch trainees:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trainees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchModules = async (tokanId: string) => {
    try {
      const response = await axios.get(`/api/modules?instructorId=${tokanId}`);
      console.log(response.data.instructorModules);
      setAvailableModules(response.data.instructorModules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };

  const handleAssignModules = async () => {
    if (!selectedTrainee || selectedModules.length === 0) return;

    setIsAssigning(true);
    try {
      const response = await axios.post("/api/assignments", {
        moduleIds: selectedModules,
        traineeId: selectedTrainee.id,
        instructorId: user?.id,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Assigned ${selectedModules.length} modules to ${selectedTrainee.name}`,
        });
        console.log("Assigned done");
        fetchTrainees(userTokan);
      } else {
        // throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign modules",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  console.log(trainees);

  const getAssignedModules = async (traineeId: string) => {
    try {
      const response = await axios.get(
        `/api/assignments?traineeId=${decrypt(traineeId)}`
      );
      const data = response.data;
      console.log(data.assignments);
      if (data.success) {
        return data.map((assignment: any) => {
          const module = availableModules.find(
            (m: any) => m.id === assignment.moduleId
          );
          return {
            ...module,
            isCompleted: assignment.isCompleted,
            completedAt: assignment.completedAt,
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch assigned modules:", error);
    }
    return [];
  };

  // const getAvailableModulesForTrainee = async (traineeId: string) => {
  //   try {
  //     const response = await fetch(`/api/assignments?traineeId=${traineeId}`);
  //     const data = await response.json();
  //     if (response.ok) {
  //       const assignedModuleIds = data.assignments.map(
  //         (assignment: any) => assignment.moduleId
  //       );
  //       return availableModules.filter(
  //         (module) => !assignedModuleIds.includes(module.id)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch available modules:", error);
  //   }
  //   return availableModules;
  // };

  // if (isLoading) {
  //   return (
  //     <ProtectedRoute requiredRole="instructor">
  //       <DashboardLayout>
  //         <div className="flex items-center justify-center min-h-[400px]">
  //           <Loader2 className="h-8 w-8 animate-spin" />
  //         </div>
  //       </DashboardLayout>
  //     </ProtectedRoute>
  //   );
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trainees</h2>
          <p className="text-muted-foreground">
            Manage your trainees and assign training modules
          </p>
        </div>

        {/* Trainees Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainees?.map((trainee: any) => (
            <Card key={trainee.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Users className="h-8 w-8 text-blue-600" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setSelectedTrainee(trainee);
                          setSelectedModules([]);
                          selectAssignModule(trainee?.Assignment);
                          // You could fetch available modules here if needed
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>
                          Assign Modules to {trainee.name}
                        </DialogTitle>
                        <DialogDescription>
                          Select training modules to assign to this trainee.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {availableModules
                            .filter((module) => {
                              // Filter out already assigned modules
                              // This is a simplified version - in real app, you'd fetch this data
                              return true;
                            })
                            .map((module: any) => (
                              <div
                                key={module.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={module.id}
                                  checked={selectedModules.includes(module.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedModules([
                                        ...selectedModules,
                                        module.id,
                                      ]);
                                    } else {
                                      setSelectedModules(
                                        selectedModules.filter(
                                          (id) => id !== module.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  // htmlFor={module.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {module.title}
                                </label>
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTrainee(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAssignModules}
                            disabled={
                              selectedModules.length === 0 || isAssigning
                            }
                          >
                            {isAssigning ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              "Assign Modules"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardTitle className="text-lg">{trainee.name}</CardTitle>
                <CardDescription>{trainee.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {(
                        (trainee?.Assignment?.filter(
                          (e: any) => e.status === "COMPLETED"
                        ).length *
                          100) /
                        trainee?.Assignment?.length
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (trainee?.Assignment?.filter(
                        (e: any) => e.status === "COMPLETED"
                      ).length *
                        100) /
                      trainee?.Assignment?.length
                    }
                  />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Completed:{" "}
                      {
                        trainee?.Assignment?.filter(
                          (e: any) => e.status === "COMPLETED"
                        ).length
                      }
                    </span>
                    <span>Total: {trainee?.Assignment?.length}</span>
                  </div>

                  <Badge
                    variant={
                      trainee.progressPercentage === 100
                        ? "default"
                        : trainee.progressPercentage > 50
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {trainee.progressPercentage === 100
                      ? "Complete"
                      : trainee.progressPercentage > 50
                      ? "Good Progress"
                      : "Getting Started"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trainees.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No trainees
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No trainees have signed up yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
