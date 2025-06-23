"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, MoreVertical, User2 } from "lucide-react";
import DoctorSidebar from "@/components/layouts/doctor-sidebar";
import { clearTokens } from "@/lib/token-service";
import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DoctorLayoutWrapperProps {
  children: ReactNode;
  activePage?: "calendar" | "patients" | "messages" | "profile" | "emails";
}

export default function DoctorLayoutWrapper({ children, activePage }: DoctorLayoutWrapperProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Use saved preference or default to false
    return localStorage.getItem("sidebarCollapsed") === "true"
  })
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed.toString())
  }, [sidebarCollapsed])
  
  const router = useRouter();

  const handleLogout = () => {
    clearTokens();
    const clearCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    clearCookie("accessToken");
    clearCookie("refreshToken");
    clearCookie("idToken");
    clearCookie("userRole");
    window.location.href = "/";
  };

  const navigateTo = (path: string) => router.push(path);

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        <div className="flex-1">
          <header className="h-14 flex items-center justify-between px-6 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e]">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#f2f2f2] rounded-full transition-colors"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="text-[#3b82f6]" />
                ) : (
                  <ChevronLeft className="text-[#3b82f6]" />
                )}
              </Button>

              <button
                onClick={() => navigateTo("/doctor-dashboard")}
                className="bg-transparent rounded px-2 py-1"
              >
                <img src="/logo-atlasai.png" alt="Atlas AI Logo" className="h-6" />
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-full h-10 w-10"
                onClick={() => navigateTo("/doctor-dashboard/profile")}
              >
                <User2 className="h-4 w-4" />
              </Button>

              <div className="rounded-full h-10 w-10 flex items-center justify-center">
                <ThemeToggle />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-full h-10 w-10"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex flex-1">
            <DoctorSidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
              activePage={activePage}
            />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
