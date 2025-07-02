"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { Module } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/data-fetching";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "INSTRUCTOR" | "TRAINEE";
  isActive: boolean;
}

export default function InstructorDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<User>();
  const [loder, setLoder] = useState(true);
  const [stats, setStats] = useState({
    totalModules: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    completionRate: 0,
  });
  const [instructorModules, setInstructorModules] = useState<any>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    estimatedDuration: 14,
  });

  useEffect(() => {
    // fetchModules();
    fetchStats();
  });

  useEffect(() => {
    const tokanId = Cookies.get("instructorTokan") as string;
    // if (!tokanId) {
    //   router.push("/login");
    // }
    // setUserTokan(tokanId);
    if (tokanId) {
      fetchModules(tokanId);
      getUserData(tokanId);
    }
  }, []);

  const getUserData = async (tokanId: any) => {
    try {
      if (tokanId) {
        const response = await axios.get(
          `/api/users?profileTokanId=${tokanId}`
        );
        setProfileData(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.error("something wrong", err);
    } finally {
      setLoder(false);
    }
  };

  const fetchModules = async (tokanId: string) => {
    try {
      const response = await axios.get(`/api/modules?instructorId=${tokanId}`);
      setInstructorModules(response.data.instructorModules);
      if (response) {
        // setModuleList(data.modules);
      }
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/assignments?instructorId=${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        const assignments = data.assignments;
        const completed = assignments.filter((a: any) => a.isCompleted).length;
        const total = assignments.length;
        setStats({
          totalModules: moduleList.length,
          activeAssignments: total - completed,
          completedAssignments: completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `/api/modules?instructorId=${profileData?.id}`,
        formData
      );
      if (response.data.Success) {
        console.log("Module add Successfully");
        toast({
          title: "Success",
          description: "Module created successfully",
        });
        setEditingModule(null);
        setFormData({
          title: "",
          description: "",
          content: "",
          estimatedDuration: 14,
        });
      }
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save module",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      content: module.content,
      estimatedDuration: module.estimatedDuration ?? 0, // ✅ Fallback to 0 if undefined
    });
  };

  // const handleDelete = async (moduleId: string) => {
  //   if (
  //     !confirm(
  //       "Are you sure you want to delete this module? This will also remove all related assignments."
  //     )
  //   ) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`/api/modules?id=${moduleId}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       setModuleList((prev) =>
  //         prev.filter((module) => module.id !== moduleId)
  //       );
  //       toast({
  //         title: "Success",
  //         description: "Module deleted successfully",
  //       });
  //       fetchStats(); // Refresh stats
  //     } else {
  //       const data = await response.json();
  //       throw new Error(data.error);
  //     }
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to delete module",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      estimatedDuration: 0,
    });
    setEditingModule(null);
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Training Modules
              </h2>
              <p className="text-muted-foreground">
                Create and manage your training modules
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Module
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                  <DialogDescription>
                    Add a new training module for your trainees.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      rows={4}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Estimated Duration (Days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedDuration: Number(e.target.value) || 0,
                        })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Module"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Modules
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{instructorModules?.length}</div>
                <p className="text-xs text-muted-foreground">Created by you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Assignments
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.activeAssignments}
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedAssignments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Finished assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.completionRate}%
                </div>
                <Progress value={stats.completionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Edit Dialog */}
          <Dialog
            open={!!editingModule}
            onOpenChange={() => setEditingModule(null)}
          >
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Edit Module</DialogTitle>
                <DialogDescription>
                  Update the training module details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Module"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modules Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instructorModules?.map((module:any) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(module)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {module.content}
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    Created {new Date(module.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {moduleList.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No modules
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first training module.
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

// if (editingModule) {
//       // Update existing module
//       const response = await fetch("/api/modules", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: editingModule.id,
//           ...formData,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setModuleList((prev) =>
//           prev.map((module) =>
//             module.id === editingModule.id ? data.module : module
//           )
//         );
//         toast({
//           title: "Success",
//           description: "Module updated successfully",
//         });
//         setEditingModule(null);
//       } else {
//         throw new Error(data.error);
//       }
//     } else {
