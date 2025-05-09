"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Bell, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, toggleUserRole } from "@/lib/token-service"

export default function PatientHeader() {
  const router = useRouter()

  const handleLogout = () => {
    clearTokens()
    router.push("/")
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e]">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            const newRole = toggleUserRole()
            if (newRole === "provider") {
              router.push("/dashboard")
            } else {
              router.push("/patient-dashboard")
            }
          }}
          className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] rounded-lg h-9 px-4 text-sm font-medium"
        >
          Switch to Provider View
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-10 w-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 bg-[#73a9e9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        <ThemeToggle />
        <Button
          onClick={handleLogout}
          className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] rounded-lg h-9 px-4 text-sm font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </header>
  )
} 