"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MessageSquare,
  CheckCircle,
  FlaskRoundIcon as Flask,
  User,
  Plus,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import DoctorLayoutWrapper from "@/app/components/doctor-layout"

// Helper: get cookie
function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  return parts.length === 2 ? parts.pop()?.split(";").shift() : null
}

export default function DashboardClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const localStorageToken = localStorage.getItem("accessToken")
      const cookieToken = getCookie("accessToken")
      return !!localStorageToken || !!cookieToken
    }

    if (!checkAuth()) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center text-center text-[#86868b] dark:text-[#a1a1a6]">
        <div>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]" />
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <DoctorLayoutWrapper activePage="calendar">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium mb-6 text-[#1d1d1f] dark:text-white">DASHBOARD</h2>
          </div>


          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card onClick={() => navigateTo("/doctor-dashboard/scheduling")} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                  <Calendar className="h-5 w-5 text-[#73a9e9]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Upcoming</h3>
                  <p className="text-3xl font-bold mt-1">8</p>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Appointments Today</p>
                </div>
              </CardContent>
            </Card>

            <Card onClick={() => navigateTo("/doctor-dashboard/messages")} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                  <MessageSquare className="h-5 w-5 text-[#73a9e9]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Messages</h3>
                  <p className="text-3xl font-bold mt-1">5</p>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Unread Messages</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                  <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Tasks</h3>
                  <p className="text-3xl font-bold mt-1">3</p>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Due Today</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                  <Flask className="h-5 w-5 text-[#73a9e9]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Lab Results</h3>
                  <p className="text-3xl font-bold mt-1">2</p>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Pending review</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity and Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 h-12 w-12 flex items-center justify-center">
                        <User className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <p className="font-medium">New Patient 'Jane Doe' registered.</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 1 hour ago
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 h-12 w-12 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <p className="font-medium">Appointment confirmed: Bob Johnson</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Yesterday
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-4">Links to common tasks...</p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigateTo("/doctor-dashboard/patients")}
                      className="bg-[#f5f5f7] dark:bg-[#3a3a3c] hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] text-sm px-4 py-2 rounded-lg flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" /> ADD PATIENT
                    </button>
                    <button
                      onClick={() => navigateTo("/doctor-dashboard/messages")}
                      className="bg-[#f5f5f7] dark:bg-[#3a3a3c] hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] text-sm px-4 py-2 rounded-lg flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" /> NEW MESSAGE
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center">
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
              © 2025 Atlas AI • <span className="hover:underline cursor-pointer">Help</span> •
              <span className="hover:underline cursor-pointer"> Terms</span> •
              <span className="hover:underline cursor-pointer"> Privacy</span> •
              <span className="text-[#73a9e9]"> (v1.0.0)</span>
            </p>
          </div>
        </div>
      </div>
    </DoctorLayoutWrapper>
  )
}
