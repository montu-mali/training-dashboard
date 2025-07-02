"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Mail, Save, Eye, EyeOff, Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"
interface CredentialData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function CredentialManager() {
  const { user } = useAuth()
  const { toast } = useToast()
    const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState<CredentialData>({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<CredentialData>>({})

 useEffect(() => {
    const tokanId = Cookies.get("userTokan") as string;
    if (!tokanId) {
      router.push("/login");
    }
    if (tokanId) {
      // getOrderData(tokanId);
      fetchAssignedModules(tokanId);
    }
  }, []);



  const validateForm = () => {
    const newErrors: Partial<CredentialData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password"
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const updateData: any = {
        userId: user?.id,
        name: formData.name,
        email: formData.email,
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your credentials have been updated successfully",
        })

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))

        // Update auth context if needed
        // You might want to refresh the user data here
      } else {
        throw new Error(data.error || "Failed to update credentials")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 25, label: "Weak" }
    if (password.length < 8) return { strength: 50, label: "Fair" }
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 75, label: "Good" }
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 100, label: "Strong" }
    }
    return { strength: 60, label: "Fair" }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-600">Manage your account credentials and security settings</p>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Role: <strong className="capitalize">{user?.role}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Password Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Password Security</CardTitle>
            </div>
            <CardDescription>Change your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Leave password fields empty if you don't want to change your password.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  disabled={isLoading}
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    disabled={isLoading}
                    className={errors.newPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.newPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Password strength</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.strength >= 75
                            ? "text-green-600"
                            : passwordStrength.strength >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.strength >= 75
                            ? "bg-green-500"
                            : passwordStrength.strength >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>At least 6 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include special characters for stronger security</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
