"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, User } from "lucide-react"

interface DoctorSidebarProps {
  activePage?: "calendar" | "patients" | "messages"
}

export default function DoctorSidebar({ activePage }: DoctorSidebarProps) {
  const router = useRouter()

  return (
    <div className="w-16 min-h-screen bg-white dark:bg-[#2c2c2e] border-r border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col items-center py-6 gap-8">
      <div className="flex flex-col items-center gap-8">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-lg h-10 w-10 ${
            activePage === "calendar"
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9]"
              : "hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
          }`}
          onClick={() => router.push("/scheduling")}
        >
          <Calendar className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-lg h-10 w-10 ${
            activePage === "patients"
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9]"
              : "hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
          }`}
          onClick={() => router.push("/patients")}
        >
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-lg h-10 w-10 ${
            activePage === "messages"
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9]"
              : "hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
          }`}
          onClick={() => router.push("/messages")}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
} 