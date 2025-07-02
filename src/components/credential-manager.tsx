"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Lock,
  Mail,
  Save,
  Eye,
  EyeOff,
  Shield,
  Loader2,
} from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import validatePassword from "@/src/lib/validatePassword";
import { decrypt } from "@/src/lib/data-fetching";
interface CredentialProData {
  name: string;
  email: string;
}
interface CredentialPassData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface User {
  name: string;
  email: string;
  createdAt: string;
  role: "INSTRUCTOR" | "TRAINEE" | "ADMIN";
  isActive: boolean;
}

export function CredentialManager() {
  const { toast } = useToast();
  const router = useRouter();
  const [profileData, setProfileData] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [userTokan, setUserTokan] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [formData, setFormData] = useState<CredentialProData>({
    name: profileData?.name || "",
    email: profileData?.email || "",
  });

  const [passData, setPassData] = useState<CredentialPassData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // const [errors, setErrors] = useState<Partial<CredentialPassData>>({});

  useEffect(() => {
    const tokanId = Cookies.get("instructorTokan") as string;
    if (!tokanId) {
      router.push("/login");
    }
    setUserTokan(tokanId);
    if (tokanId) {
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
        setFormData({
          name: response?.data?.name || "",
          email: response?.data?.email || "",
        });
      }
    } catch (err) {
      console.error("something wrong", err);
    } finally {
      // setLoder(false);
    }
  };

  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();
    setMessage("");
    if (passData.newPassword !== passData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const data = {
      userTokan,
      password: passData.currentPassword,
      newPassword: passData.newPassword,
    };

    try {
      const response = await axios.post("/api/users/update/password", data);

      if (response.data.success) {
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });

        setPassData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      if (!response.data.success) {
        setMessage(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          "There was a problem updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const updateData = {
      userId: decrypt(userTokan),
      name: formData.name,
      email: formData.email,
    };

    const response = await axios.put("/api/users/update/profile_data", updateData);

    if (response.data.success) {
      toast({
        title: "Success",
        description: "Your credentials have been updated successfully",
      });
    } else {
      setEmailMessage(response.data.error);
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to update credentials",
      variant: "destructive",
    });
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};


  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleValidation = () => {
    const message = validatePassword(passData.newPassword);
    setValidationMessage(message);
  };

  useEffect(() => {
    if (passData.newPassword !== null && passData.newPassword !== "") {
      handleValidation();
    }
  }, [passData.newPassword]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-600">
          Manage your account credentials and security settings
        </p>
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isLoading}
                  className={!formData.name ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isLoading}
                    className={`pl-10 ${emailMessage ? "border-red-500" : ""}`}
                  />
                </div>
                {emailMessage && (
                  <p className="text-sm text-red-600">{emailMessage}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Role:{" "}
                <strong className="capitalize">{profileData?.role}</strong>
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
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
          </CardFooter>
        </Card>
      </form>
      <Separator />

      {/* Password Security */}

      <form onSubmit={handlePasswordUpdate} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Password Security</CardTitle>
            </div>
            <CardDescription>
              Change your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Leave password fields empty if you don't want to change your
                password.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passData.currentPassword}
                  onChange={(e) =>
                    setPassData({
                      ...passData,
                      currentPassword: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  // className={errors.currentPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {message && <p className="text-sm text-red-600">{message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    disabled={isLoading}
                    // className={errors.newPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passData.confirmPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    // className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {validationMessage ? (
                <span className="text-red-600">{validationMessage}</span>
              ) : (
                "Password must be at least 8 characters long and include a number and a special character."
              )}
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  passData.newPassword !== passData.confirmPassword ||
                  !passData.currentPassword
                }
                className="min-w-[120px]"
              >
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
          </CardFooter>
        </Card>

        {/* Save Button */}
      </form>
    </div>
  );
}
