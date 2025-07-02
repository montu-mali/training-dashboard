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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2, TrendingUp, Clock, BookOpen, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProgressFormData {
  userId: string
  moduleId: string
  completionPercentage: number
  timeSpent: number
  score?: number
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED"
  currentSection?: string
  lastAccessedAt: Date
  completedSections: string[]
  bookmarks: string[]
  notes: string[]
  feedback?: string
  isCompleted: boolean
  metadata: Record<string, any>
}

interface ProgressFormProps {
  initialData?: Partial<ProgressFormData>
  onSubmit: (data: ProgressFormData) => Promise<void>
  isLoading?: boolean
  mode: "create" | "edit"
  users?: Array<{ id: string; name: string; email: string }>
  modules?: Array<{ id: string; title: string }>
  sections?: string[]
}

export function ProgressForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
  users = [],
  modules = [],
  sections = [],
}: ProgressFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ProgressFormData>({
    userId: initialData?.userId || "",
    moduleId: initialData?.moduleId || "",
    completionPercentage: initialData?.completionPercentage || 0,
    timeSpent: initialData?.timeSpent || 0,
    score: initialData?.score,
    status: initialData?.status || "NOT_STARTED",
    currentSection: initialData?.currentSection || "",
    lastAccessedAt: initialData?.lastAccessedAt || new Date(),
    completedSections: initialData?.completedSections || [],
    bookmarks: initialData?.bookmarks || [],
    notes: initialData?.notes || [],
    feedback: initialData?.feedback || "",
    isCompleted: initialData?.isCompleted ?? false,
    metadata: initialData?.metadata || {},
  })

  const [newBookmark, setNewBookmark] = useState("")
  const [newNote, setNewNote] = useState("")
  const [errors, setErrors] = useState<Partial<ProgressFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<ProgressFormData> = {}

    if (!formData.userId) newErrors.userId = "User selection is required"
    if (!formData.moduleId) newErrors.moduleId = "Module selection is required"
    if (formData.completionPercentage < 0 || formData.completionPercentage > 100) {
      newErrors.completionPercentage = "Completion percentage must be between 0 and 100"
    }
    if (formData.timeSpent < 0) newErrors.timeSpent = "Time spent cannot be negative"
    if (formData.score !== undefined && (formData.score < 0 || formData.score > 100)) {
      newErrors.score = "Score must be between 0 and 100"
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
        description: `Progress ${mode === "create" ? "created" : "updated"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} progress`,
        variant: "destructive",
      })
    }
  }

  const addBookmark = () => {
    if (newBookmark.trim() && !formData.bookmarks.includes(newBookmark.trim())) {
      setFormData((prev) => ({
        ...prev,
        bookmarks: [...prev.bookmarks, newBookmark.trim()],
      }))
      setNewBookmark("")
    }
  }

  const removeBookmark = (bookmark: string) => {
    setFormData((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b !== bookmark),
    }))
  }

  const addNote = () => {
    if (newNote.trim() && !formData.notes.includes(newNote.trim())) {
      setFormData((prev) => ({
        ...prev,
        notes: [...prev.notes, newNote.trim()],
      }))
      setNewNote("")
    }
  }

  const removeNote = (note: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n !== note),
    }))
  }

  const toggleCompletedSection = (section: string) => {
    setFormData((prev) => ({
      ...prev,
      completedSections: prev.completedSections.includes(section)
        ? prev.completedSections.filter((s) => s !== section)
        : [...prev.completedSections, section],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "text-gray-600"
      case "IN_PROGRESS":
        return "text-blue-600"
      case "COMPLETED":
        return "text-green-600"
      case "PAUSED":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {mode === "create" ? "Create Progress Record" : "Edit Progress"}
        </CardTitle>
        <CardDescription>
          {mode === "create" ? "Create a new progress tracking record" : "Update progress information and status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User and Module Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userId">User *</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, userId: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.userId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a user" />
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

            <div className="space-y-2">
              <Label htmlFor="moduleId">Module *</Label>
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
          </div>

          {/* Progress Metrics */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Completion Percentage: {formData.completionPercentage}%</Label>
              <Slider
                value={[formData.completionPercentage]}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, completionPercentage: value[0] }))}
                max={100}
                step={1}
                disabled={isLoading}
                className="w-full"
              />
              {errors.completionPercentage && <p className="text-sm text-red-600">{errors.completionPercentage}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="timeSpent">Time Spent (minutes) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="timeSpent"
                    type="number"
                    min="0"
                    value={formData.timeSpent}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, timeSpent: Number.parseInt(e.target.value) || 0 }))
                    }
                    disabled={isLoading}
                    className={`pl-10 ${errors.timeSpent ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">Total: {formatTime(formData.timeSpent)}</p>
                {errors.timeSpent && <p className="text-sm text-red-600">{errors.timeSpent}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Score (%)</Label>
                <div className="relative">
                  <Star className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        score: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      }))
                    }
                    disabled={isLoading}
                    className={`pl-10 ${errors.score ? "border-red-500" : ""}`}
                    placeholder="No score yet"
                  />
                </div>
                {errors.score && <p className="text-sm text-red-600">{errors.score}</p>}
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
                    <SelectItem value="NOT_STARTED">
                      <span className={getStatusColor("NOT_STARTED")}>Not Started</span>
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">
                      <span className={getStatusColor("IN_PROGRESS")}>In Progress</span>
                    </SelectItem>
                    <SelectItem value="COMPLETED">
                      <span className={getStatusColor("COMPLETED")}>Completed</span>
                    </SelectItem>
                    <SelectItem value="PAUSED">
                      <span className={getStatusColor("PAUSED")}>Paused</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Current Section */}
          <div className="space-y-2">
            <Label htmlFor="currentSection">Current Section</Label>
            <Select
              value={formData.currentSection}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, currentSection: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select current section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Completed Sections */}
          {sections.length > 0 && (
            <div className="space-y-2">
              <Label>Completed Sections</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {sections.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={`section-${section}`}
                      checked={formData.completedSections.includes(section)}
                      onCheckedChange={() => toggleCompletedSection(section)}
                      disabled={isLoading}
                    />
                    <Label htmlFor={`section-${section}`} className="text-sm">
                      {section}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Bookmarks
            </Label>
            <div className="flex gap-2">
              <Input
                value={newBookmark}
                onChange={(e) => setNewBookmark(e.target.value)}
                placeholder="Add a bookmark..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBookmark())}
              />
              <Button type="button" onClick={addBookmark} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.bookmarks.map((bookmark) => (
                <Badge key={bookmark} variant="secondary" className="flex items-center gap-1">
                  {bookmark}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeBookmark(bookmark)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                disabled={isLoading}
                rows={2}
              />
              <Button
                type="button"
                onClick={addNote}
                disabled={isLoading}
                variant="outline"
                className="self-start bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{note}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500 mt-0.5" onClick={() => removeNote(note)} />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              rows={3}
              value={formData.feedback}
              onChange={(e) => setFormData((prev) => ({ ...prev, feedback: e.target.value }))}
              disabled={isLoading}
              placeholder="Instructor feedback or comments..."
            />
          </div>

          {/* Completion Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCompleted"
              checked={formData.isCompleted}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isCompleted: !!checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="isCompleted">Mark as Completed</Label>
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
                <>{mode === "create" ? "Create Progress" : "Update Progress"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
