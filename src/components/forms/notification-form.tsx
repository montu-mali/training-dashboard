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
import { CalendarIcon, Loader2, Bell, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/src/lib/utils"
import { useToast } from "@/src/hooks/use-toast"

interface NotificationFormData {
  userId: string
  title: string
  message: string
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  actionUrl?: string
  actionText?: string
  expiresAt?: Date
  isRead: boolean
  metadata: Record<string, any>
}

interface NotificationFormProps {
  initialData?: Partial<NotificationFormData>
  onSubmit: (data: NotificationFormData) => Promise<void>
  isLoading?: boolean
  mode: "create" | "edit"
  users?: Array<{ id: string; name: string; email: string }>
}

export function NotificationForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
  users = [],
}: NotificationFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<NotificationFormData>({
    userId: initialData?.userId || "",
    title: initialData?.title || "",
    message: initialData?.message || "",
    type: initialData?.type || "INFO",
    priority: initialData?.priority || "MEDIUM",
    actionUrl: initialData?.actionUrl || "",
    actionText: initialData?.actionText || "",
    expiresAt: initialData?.expiresAt,
    isRead: initialData?.isRead ?? false,
    metadata: initialData?.metadata || {},
  })

  const [errors, setErrors] = useState<Partial<NotificationFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<NotificationFormData> = {}

    if (!formData.userId) newErrors.userId = "User selection is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    if (formData.actionUrl && !formData.actionText) {
      newErrors.actionText = "Action text is required when action URL is provided"
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
        description: `Notification ${mode === "create" ? "created" : "updated"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} notification`,
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "INFO":
        return <Info className="h-4 w-4 text-blue-600" />
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {mode === "create" ? "Create New Notification" : "Edit Notification"}
        </CardTitle>
        <CardDescription>
          {mode === "create" ? "Send a new notification to a user" : "Update notification details and settings"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="userId">Recipient *</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, userId: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.userId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && <p className="text-sm text-red-600">{errors.userId}</p>}
          </div>

          {/* Notification Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                disabled={isLoading}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter notification title..."
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                disabled={isLoading}
                className={errors.message ? "border-red-500" : ""}
                placeholder="Enter notification message..."
              />
              {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
            </div>
          </div>

          {/* Type and Priority */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">
                    <div className="flex items-center gap-2">
                      {getTypeIcon("INFO")}
                      Information
                    </div>
                  </SelectItem>
                  <SelectItem value="SUCCESS">
                    <div className="flex items-center gap-2">
                      {getTypeIcon("SUCCESS")}
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="WARNING">
                    <div className="flex items-center gap-2">
                      {getTypeIcon("WARNING")}
                      Warning
                    </div>
                  </SelectItem>
                  <SelectItem value="ERROR">
                    <div className="flex items-center gap-2">
                      {getTypeIcon("ERROR")}
                      Error
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    <span className={getPriorityColor("LOW")}>Low Priority</span>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <span className={getPriorityColor("MEDIUM")}>Medium Priority</span>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <span className={getPriorityColor("HIGH")}>High Priority</span>
                  </SelectItem>
                  <SelectItem value="URGENT">
                    <span className={getPriorityColor("URGENT")}>Urgent</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Button */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="actionUrl">Action URL</Label>
              <Input
                id="actionUrl"
                value={formData.actionUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, actionUrl: e.target.value }))}
                disabled={isLoading}
                placeholder="https://example.com/action"
              />
              <p className="text-xs text-gray-500">Optional URL to redirect when action button is clicked</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionText">Action Button Text</Label>
              <Input
                id="actionText"
                value={formData.actionText}
                onChange={(e) => setFormData((prev) => ({ ...prev, actionText: e.target.value }))}
                disabled={isLoading}
                className={errors.actionText ? "border-red-500" : ""}
                placeholder="View Details"
              />
              {errors.actionText && <p className="text-sm text-red-600">{errors.actionText}</p>}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiresAt && "text-muted-foreground",
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiresAt ? format(formData.expiresAt, "PPP") : "No expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiresAt}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, expiresAt: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">Optional expiry date for the notification</p>
          </div>

          {/* Read Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRead"
              checked={formData.isRead}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRead: !!checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="isRead">Mark as Read</Label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Sending..." : "Updating..."}
                </>
              ) : (
                <>{mode === "create" ? "Send Notification" : "Update Notification"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
