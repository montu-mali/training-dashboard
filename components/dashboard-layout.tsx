"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  GitBranch,
} from "lucide-react";
import { decrypt } from "@/lib/data-fetching";
import axios from "axios";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
interface User {
  name: string;
  email: string;
  createdAt: string;
  role: "INSTRUCTOR" | "TRAINEE" | "ADMIN";
  isActive: boolean;
}
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<User>();
  const handleLogout = () => {
    // logout()
    router.push("/");
  };

  useEffect(() => {
    const tokanId = Cookies.get("instructorTokan") as string;
    if (!tokanId) {
      router.push("/login");
    }
    // setUserTokan(tokanId);
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
      }
    } catch (err) {
      console.error("something wrong", err);
    } finally {
      // setLoder(false);
    }
  };

    const UserLogOut = () => {
    Cookies.remove("instructorTokan");
    // setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    router.push("/login");
    router.refresh();
  };

  const navigation =
    profileData?.role === "INSTRUCTOR"
      ? [
          { name: "Modules", href: "/instructor", icon: BookOpen },
          { name: "Trainees", href: "/instructor/trainees", icon: Users },
          { name: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
          { name: "Process Chart", href: "/process-chart", icon: GitBranch },
        ]
      : profileData?.role === "ADMIN"
      ? [
          { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Modules", href: "/admin/modules", icon: BookOpen },
          { name: "Process Chart", href: "/process-chart", icon: GitBranch },
        ]
      : [
          { name: "My Modules", href: "/trainee", icon: BookOpen },
          // { name: "Progress", href: "/trainee/progress", icon: BarChart3 },
          { name: "Process Chart", href: "/process-chart", icon: GitBranch },
        ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">TrainingHub</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">TrainingHub</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 justify-between items-center px-4">
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {profileData?.role} Dashboard
            </h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {profileData?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profileData?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {profileData?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
