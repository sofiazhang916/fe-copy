"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  Search,
  Calendar,
  User,
  MessageSquare,
  CreditCard,
  Settings,
  CheckCircle,
} from "lucide-react"
import { toggleUserRole } from "@/lib/token-service"

export default function PatientSidebar({ currentRoute = "" }) {
  const router = useRouter()

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-[#2c2c2e] border-r border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-medium text-[#1d1d1f] dark:text-white">Atlas</h1>
        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Your health journey</p>
      </div>

      {/* User profile summary */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#73a9e9] flex items-center justify-center text-white font-medium">
            U
          </div>
          <div>
            <p className="font-medium">Patient</p>
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">320/500</p>
          </div>
        </div>
        <Progress value={64} className="h-1.5 bg-[#e5e5ea] dark:bg-[#3a3a3c]" />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <Button
          variant="ghost"
          className={`w-full justify-start px-6 py-2.5 h-auto rounded-none ${
            currentRoute === "/patient-dashboard" 
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9] font-medium" 
              : "text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
          }`}
          onClick={() => router.push("/patient-dashboard")}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Button>
        
        <Button
          variant="ghost"
          className={`w-full justify-start px-6 py-2.5 h-auto rounded-none ${
            currentRoute === "/patient-dashboard/find-a-doctor" 
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9] font-medium" 
              : "text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
          }`}
          onClick={() => router.push("/patient-dashboard/find-a-doctor")}
        >
          <Search className="h-5 w-5 mr-3" />
          Find a Doctor
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium relative"
          onClick={() => router.push("/patient-dashboard/appointments")}
        >
          <Calendar className="h-5 w-5 mr-3" />
          My Appointments
          <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#73a9e9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            2
          </span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
          onClick={() => router.push("/patient-dashboard/health")}
        >
          <User className="h-5 w-5 mr-3" />
          Health Profile
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium relative"
          onClick={() => router.push("/patient-dashboard/doctor-dashboard/messages")}
        >
          <MessageSquare className="h-5 w-5 mr-3" />
          Messages
          <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#73a9e9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
          onClick={() => router.push("/patient-dashboard/payment")}
        >
          <CreditCard className="h-5 w-5 mr-3" />
          Payment & Insurance
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
          onClick={() => router.push("/patient-dashboard/settings")}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </nav>

      {/* Health Quests */}
      <div className="px-6 mt-6 pt-6 border-t border-[#e5e5ea] dark:border-[#3a3a3c]">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
          <h3 className="font-medium">Health Quests</h3>
        </div>
        <div className="mb-3">
          <p className="text-sm mb-1">Fill Health Profile</p>
          <Progress value={60} className="h-1.5 bg-[#e5e5ea] dark:bg-[#3a3a3c]" />
          <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1 text-right">3/5</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Book Annual Checkup</span>
          <span className="text-[#73a9e9]">Pending</span>
        </div>
      </div>
    </div>
  )
} 