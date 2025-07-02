"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, ClipboardList, AlertCircle, Flag } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AssignmentFormData {
  title: string
  description: string
  instructions: string
  moduleId: string
  traineeId: string
  dueDate?: Date
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "REVIEWED" | "COMPLETED" | "OVERDUE"
  maxAttempts: number
  passingScore: number
  timeLimit?: number
  allowLateSubmission: boolean
  isActive: boolean
  metadata: Record<string, any>
}

interface AssignmentFormProps {
  initialData?: Partial<AssignmentFormData>
  onSubmit: (data: AssignmentFormData) => Promise<void>
  isLoading?: boolean
  mode: "create" | "edit"
  modules?: Array<{ id: string; title: string }>
  trainees?: Array<{ id: string; name: string; email: string }>
}

export function AssignmentForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
  modules = [],
  trainees = [],
}: AssignmentFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    instructions: initialData?.instructions || "",
    moduleId: initialData?.moduleId || "",
    traineeId: initialData?.traineeId || "",
    dueDate: initialData?.dueDate,
    priority: initialData?.priority || "MEDIUM",
    status: initialData?.status || "PENDING",
    maxAttempts: initialData?.maxAttempts || 3,
    passingScore: initialData?.passingScore || 70,
    timeLimit: initialData?.timeLimit,
    allowLateSubmission: initialData?.allowLateSubmission ?? true,
    isActive: initialData?.isActive ?? true,
    metadata: initialData?.metadata || {},
  })

  const [errors, setErrors] = useState<Partial<AssignmentFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<AssignmentFormData> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.moduleId) newErrors.moduleId = "Module selection is required"
    if (!formData.traineeId) newErrors.traineeId = "Trainee selection is required"
    if (formData.maxAttempts <= 0) newErrors.maxAttempts = "Max attempts must be greater than 0"
    if (formData.passingScore < 0 || formData.passingScore > 100) {
      newErrors.passingScore = "Passing score must be between 0 and 100"
    }
    if (formData.timeLimit && formData.timeLimit <= 0) {
      newErrors.timeLimit = "Time limit must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      toast({
        title: "Success",
        description: `Assignment ${mode === "create" ? "created" : "updated"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} assignment`,
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "text-green-600"
      case "MEDIUM":
        return "text-yellow-600"
      case "HIGH":
        return "text-orange-600"
      case "URGENT":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-gray-600"
      case "IN_PROGRESS":
        return "text-blue-600"
      case "SUBMITTED":
        return "text-purple-600"
      case "REVIEWED":
        return "text-indigo-600"
      case "COMPLETED":
        return "text-green-600"
      case "OVERDUE":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          {mode === "create" ? "Create New Assignment" : "Edit Assignment"}
        </CardTitle>
        <CardDescription>
          {mode === "create" ? "Create a new assignment for trainees" : "Update assignment details and settings"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                disabled={isLoading}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter assignment title..."
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                disabled={isLoading}
                className={errors.description ? "border-red-500" : ""}
                placeholder="Brief description of the assignment..."
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                rows={5}
                value={formData.instructions}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                disabled={isLoading}
                placeholder="Detailed instructions for completing the assignment..."
              />
            </div>
          </div>

          {/* Module and Trainee Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="moduleId">Training Module *</Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, moduleId: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.moduleId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.moduleId && <p className="text-sm text-red-600">{errors.moduleId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="traineeId">Assign to Trainee *</Label>
              <Select
                value={formData.traineeId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, traineeId: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.traineeId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a trainee" />
                </SelectTrigger>
                <SelectContent>
                  {trainees.map((trainee) => (
                    <SelectItem key={trainee.id} value={trainee.id}>
                      <div>
                        <div className="font-medium">{trainee.name}</div>
                        <div className="text-sm text-gray-500">{trainee.email}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.traineeId && <p className="text-sm text-red-600">{errors.traineeId}</p>}
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <Flag className={`h-4 w-4 ${getPriorityColor("LOW")}`} />
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center gap-2">
                      <Flag className={`h-4 w-4 ${getPriorityColor("MEDIUM")}`} />
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <Flag className={`h-4 w-4 ${getPriorityColor("HIGH")}`} />
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="URGENT">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`h-4 w-4 ${getPriorityColor("URGENT")}`} />
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <span className={getStatusColor("PENDING")}>Pending</span>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    <span className={getStatusColor("IN_PROGRESS")}>In Progress</span>
                  </SelectItem>
                  <SelectItem value="SUBMITTED">
                    <span className={getStatusColor("SUBMITTED")}>Submitted</span>
                  </SelectItem>
                  <SelectItem value="REVIEWED">
                    <span className={getStatusColor("REVIEWED")}>Reviewed</span>
                  </SelectItem>
                  <SelectItem value="COMPLETED">
                    <span className={getStatusColor("COMPLETED")}>Completed</span>
                  </SelectItem>
                  <SelectItem value="OVERDUE">
                    <span className={getStatusColor("OVERDUE")}>Overdue</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignment Settings */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Max Attempts *</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                value={formData.maxAttempts}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, maxAttempts: Number.parseInt(e.target.value) || 1 }))
                }
                disabled={isLoading}
                className={errors.maxAttempts ? "border-red-500" : ""}
              />
              {errors.maxAttempts && <p className="text-sm text-red-600">{errors.maxAttempts}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%) *</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, passingScore: Number.parseInt(e.target.value) || 0 }))
                }
                disabled={isLoading}
                className={errors.passingScore ? "border-red-500" : ""}
              />
              {errors.passingScore && <p className="text-sm text-red-600">{errors.passingScore}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={formData.timeLimit || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeLimit: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
                disabled={isLoading}
                className={errors.timeLimit ? "border-red-500" : ""}
                placeholder="No limit"
              />
              {errors.timeLimit && <p className="text-sm text-red-600">{errors.timeLimit}</p>}
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowLateSubmission"
                checked={formData.allowLateSubmission}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowLateSubmission: !!checked }))}
                disabled={isLoading}
              />
              <Label htmlFor="allowLateSubmission">Allow Late Submission</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: !!checked }))}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">Active Assignment</Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>{mode === "create" ? "Create Assignment" : "Update Assignment"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
