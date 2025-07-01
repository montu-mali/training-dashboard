"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Award, Shield, Link } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CertificateFormData {
  userId: string
  moduleId: string
  certificateName: string
  description?: string
  issueDate: Date
  expiryDate?: Date
  certificateUrl?: string
  score: number
  status: "ACTIVE" | "EXPIRED" | "REVOKED"
  metadata: Record<string, any>
}

interface CertificateFormProps {
  initialData?: Partial<CertificateFormData>
  onSubmit: (data: CertificateFormData) => Promise<void>
  isLoading?: boolean
  mode: "create" | "edit"
  users?: Array<{ id: string; name: string; email: string }>
  modules?: Array<{ id: string; title: string }>
}

export function CertificateForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
  users = [],
  modules = [],
}: CertificateFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<CertificateFormData>({
    userId: initialData?.userId || "",
    moduleId: initialData?.moduleId || "",
    certificateName: initialData?.certificateName || "",
    description: initialData?.description || "",
    issueDate: initialData?.issueDate || new Date(),
    expiryDate: initialData?.expiryDate,
    certificateUrl: initialData?.certificateUrl || "",
    score: initialData?.score || 0,
    status: initialData?.status || "ACTIVE",
    metadata: initialData?.metadata || {},
  })

  const [errors, setErrors] = useState<Partial<CertificateFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<CertificateFormData> = {}

    if (!formData.userId) newErrors.userId = "User selection is required"
    if (!formData.moduleId) newErrors.moduleId = "Module selection is required"
    if (!formData.certificateName.trim()) newErrors.certificateName = "Certificate name is required"
    if (formData.score < 0 || formData.score > 100) {
      newErrors.score = "Score must be between 0 and 100"
    }
    if (formData.expiryDate && formData.expiryDate <= formData.issueDate) {
      newErrors.expiryDate = "Expiry date must be after issue date"
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
        description: `Certificate ${mode === "create" ? "created" : "updated"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} certificate`,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600"
      case "EXPIRED":
        return "text-yellow-600"
      case "REVOKED":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          {mode === "create" ? "Issue New Certificate" : "Edit Certificate"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Issue a new certificate for completed training"
            : "Update certificate information and status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User and Module Selection */}
          <div className="grid gap-4 md:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="moduleId">Training Module *</Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, moduleId: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.moduleId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select module" />
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

          {/* Certificate Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificateName">Certificate Name *</Label>
              <Input
                id="certificateName"
                value={formData.certificateName}
                onChange={(e) => setFormData((prev) => ({ ...prev, certificateName: e.target.value }))}
                disabled={isLoading}
                className={errors.certificateName ? "border-red-500" : ""}
                placeholder="e.g., Certificate of Completion - Safety Training"
              />
              {errors.certificateName && <p className="text-sm text-red-600">{errors.certificateName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                disabled={isLoading}
                placeholder="Brief description of the certificate..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground",
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issueDate ? format(formData.issueDate, "PPP") : "Select issue date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, issueDate: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground",
                      errors.expiryDate && "border-red-500",
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : "No expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, expiryDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Score and Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="score">Final Score (%) *</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => setFormData((prev) => ({ ...prev, score: Number.parseInt(e.target.value) || 0 }))}
                disabled={isLoading}
                className={errors.score ? "border-red-500" : ""}
              />
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
                  <SelectItem value="ACTIVE">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${getStatusColor("ACTIVE")}`} />
                      <span className={getStatusColor("ACTIVE")}>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EXPIRED">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${getStatusColor("EXPIRED")}`} />
                      <span className={getStatusColor("EXPIRED")}>Expired</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="REVOKED">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${getStatusColor("REVOKED")}`} />
                      <span className={getStatusColor("REVOKED")}>Revoked</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certificate URL */}
          <div className="space-y-2">
            <Label htmlFor="certificateUrl">Certificate URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="certificateUrl"
                value={formData.certificateUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, certificateUrl: e.target.value }))}
                disabled={isLoading}
                className="pl-10"
                placeholder="https://example.com/certificates/cert-123.pdf"
              />
            </div>
            <p className="text-xs text-gray-500">URL to the generated certificate document (PDF, image, etc.)</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Issuing..." : "Updating..."}
                </>
              ) : (
                <>{mode === "create" ? "Issue Certificate" : "Update Certificate"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
