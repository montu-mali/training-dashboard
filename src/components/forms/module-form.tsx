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
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2, BookOpen, Target, Clock, Star } from "lucide-react"
import { useToast } from "@/src/hooks/use-toast"

interface ModuleFormData {
  title: string
  description: string
  content: string
  category: string
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  estimatedDuration: number
  objectives: string[]
  prerequisites: string[]
  tags: string[]
  thumbnailUrl?: string
  videoUrls: string[]
  documentUrls: string[]
  isActive: boolean
  isPublished: boolean
  version: string
}

interface ModuleFormProps {
  initialData?: Partial<ModuleFormData>
  onSubmit: (data: ModuleFormData) => Promise<void>
  isLoading?: boolean
  mode: "create" | "edit"
}

export function ModuleForm({ initialData, onSubmit, isLoading = false, mode }: ModuleFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ModuleFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    difficulty: initialData?.difficulty || "BEGINNER",
    estimatedDuration: initialData?.estimatedDuration || 60,
    objectives: initialData?.objectives || [],
    prerequisites: initialData?.prerequisites || [],
    tags: initialData?.tags || [],
    thumbnailUrl: initialData?.thumbnailUrl || "",
    videoUrls: initialData?.videoUrls || [],
    documentUrls: initialData?.documentUrls || [],
    isActive: initialData?.isActive ?? true,
    isPublished: initialData?.isPublished ?? false,
    version: initialData?.version || "1.0.0",
  })

  const [newObjective, setNewObjective] = useState("")
  const [newPrerequisite, setNewPrerequisite] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [newDocumentUrl, setNewDocumentUrl] = useState("")
  const [errors, setErrors] = useState<Partial<ModuleFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<ModuleFormData> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (formData.estimatedDuration <= 0) newErrors.estimatedDuration = "Duration must be greater than 0"

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
        description: `Module ${mode === "create" ? "created" : "updated"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} module`,
        variant: "destructive",
      })
    }
  }

  const addObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }))
      setNewObjective("")
    }
  }

  const removeObjective = (objective: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((obj) => obj !== objective),
    }))
  }

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }))
      setNewPrerequisite("")
    }
  }

  const removePrerequisite = (prerequisite: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((req) => req !== prerequisite),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addVideoUrl = () => {
    if (newVideoUrl.trim() && !formData.videoUrls.includes(newVideoUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        videoUrls: [...prev.videoUrls, newVideoUrl.trim()],
      }))
      setNewVideoUrl("")
    }
  }

  const removeVideoUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((u) => u !== url),
    }))
  }

  const addDocumentUrl = () => {
    if (newDocumentUrl.trim() && !formData.documentUrls.includes(newDocumentUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        documentUrls: [...prev.documentUrls, newDocumentUrl.trim()],
      }))
      setNewDocumentUrl("")
    }
  }

  const removeDocumentUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: prev.documentUrls.filter((u) => u !== url),
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {mode === "create" ? "Create New Module" : "Edit Module"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Create a new training module with content and resources"
            : "Update module information and content"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Module Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                disabled={isLoading}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter module title..."
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
                placeholder="Brief description of the module..."
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                disabled={isLoading}
                className={errors.content ? "border-red-500" : ""}
                placeholder="Detailed module content..."
              />
              {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
            </div>
          </div>

          {/* Module Properties */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                disabled={isLoading}
                className={errors.category ? "border-red-500" : ""}
                placeholder="e.g., Safety, Technical, Soft Skills"
              />
              {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-green-500 text-green-500" />
                      Beginner
                    </div>
                  </SelectItem>
                  <SelectItem value="INTERMEDIATE">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      Intermediate
                    </div>
                  </SelectItem>
                  <SelectItem value="ADVANCED">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      Advanced
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Duration (minutes) *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="1"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, estimatedDuration: Number.parseInt(e.target.value) || 0 }))
                  }
                  disabled={isLoading}
                  className={`pl-10 ${errors.estimatedDuration ? "border-red-500" : ""}`}
                />
              </div>
              {errors.estimatedDuration && <p className="text-sm text-red-600">{errors.estimatedDuration}</p>}
            </div>
          </div>

          {/* Version and Thumbnail */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                disabled={isLoading}
                placeholder="1.0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                disabled={isLoading}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Learning Objectives
            </Label>
            <div className="flex gap-2">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add a learning objective..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
              />
              <Button type="button" onClick={addObjective} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.objectives.map((objective) => (
                <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                  {objective}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeObjective(objective)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <div className="flex gap-2">
              <Input
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                placeholder="Add a prerequisite..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
              />
              <Button type="button" onClick={addPrerequisite} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.prerequisites.map((prerequisite) => (
                <Badge key={prerequisite} variant="outline" className="flex items-center gap-1">
                  {prerequisite}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removePrerequisite(prerequisite)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Video URLs */}
          <div className="space-y-2">
            <Label>Video Resources</Label>
            <div className="flex gap-2">
              <Input
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Add video URL..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
              />
              <Button type="button" onClick={addVideoUrl} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.videoUrls.map((url) => (
                <div key={url} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm truncate">{url}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeVideoUrl(url)} />
                </div>
              ))}
            </div>
          </div>

          {/* Document URLs */}
          <div className="space-y-2">
            <Label>Document Resources</Label>
            <div className="flex gap-2">
              <Input
                value={newDocumentUrl}
                onChange={(e) => setNewDocumentUrl(e.target.value)}
                placeholder="Add document URL..."
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDocumentUrl())}
              />
              <Button type="button" onClick={addDocumentUrl} disabled={isLoading} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.documentUrls.map((url) => (
                <div key={url} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm truncate">{url}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeDocumentUrl(url)} />
                </div>
              ))}
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: !!checked }))}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: !!checked }))}
                disabled={isLoading}
              />
              <Label htmlFor="isPublished">Published</Label>
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
                <>{mode === "create" ? "Create Module" : "Update Module"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
