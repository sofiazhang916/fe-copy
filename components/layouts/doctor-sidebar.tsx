"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  FlaskRound,
  Mail,
  MessageSquare,
  User,
} from "lucide-react"

interface DoctorSidebarProps {
  activePage?: "calendar" | "patients" | "messages" | "profile" | "emails" | "survey"
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function DoctorSidebar({ activePage, collapsed, onToggleCollapse }: DoctorSidebarProps) {
  const router = useRouter()

  const navItems = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendar",
      path: "/doctor-dashboard/scheduling",
      key: "calendar",
    },
    // {
    //   icon: <User className="h-5 w-5" />,
    //   label: "Patients",
    //   path: "/doctor-dashboard/patients",
    //   key: "patients",
    // },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messages",
      path: "/doctor-dashboard/messages",
      key: "messages",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Emails",
      path: "/doctor-dashboard/emails",
      key: "emails"
    },
    {
      icon: <FlaskRound className="h-5 w-5" />,
      label: "Survey",
      path: "/doctor-dashboard/survey",
      key: "survey"
    },
  ];

  return (
    <div className={`flex flex-col ${collapsed ? 'w-20' : 'w-64'} min-h-screen bg-white dark:bg-[#2c2c2e] border-r border-[#e5e5ea] dark:border-[#3a3a3c] transition-all duration-300`}>
      <div className="flex flex-col gap-4 items-center mt-6 px-2">
        {navItems.map(({ icon, label, path, key }) => (
          <Button
            key={key}
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={`w-full justify-${collapsed ? "center" : "start"} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activePage === key
              ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9]"
              : "text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
              }`}
            onClick={() => router.push(path)}
          >
            {icon}
            {!collapsed && <span className="ml-3">{label}</span>}
          </Button>
        ))}
      </div>
    </div>
  )
}