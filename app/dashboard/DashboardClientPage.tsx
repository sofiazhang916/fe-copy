"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Calendar, MessageSquare, CheckCircle, FlaskRoundIcon as Flask, User, Plus, Clock } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"

export default function DashboardClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.push("/")
        return
      }

      try {
        setIsRefreshing(true)
        // Refresh tokens on page load
        await refreshTokens()
        setIsRefreshing(false)
      } catch (error) {
        console.error("Failed to refresh tokens:", error)
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        })
        clearTokens()
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    initializeDashboard()
  }, [router, toast])

  const handleLogout = () => {
    // Clear all tokens
    clearTokens()
    router.push("/")
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading dashboard...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        {showDemoNotice && (
          <div className="w-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 py-3 px-6 flex justify-between items-center">
            <p className="text-sm text-[#1d1d1f] dark:text-white">
              This is a demo environment of Atlas. We've pre-populated the platform with Mock Data to comply with HIPAA.
            </p>
            <Button
              className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium"
              onClick={() =>
                toast({
                  title: "Connect with us",
                  description: "Our team will reach out to you shortly.",
                })
              }
            >
              CONNECT WITH US!
            </Button>
          </div>
        )}

        <div className="flex">
          {/* Sidebar */}
          <div className="w-16 min-h-screen bg-white dark:bg-[#2c2c2e] border-r border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col items-center py-6 gap-8">
            <div className="flex flex-col items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9]"
                onClick={() => router.push("/scheduling")}
              >
                <Calendar className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                onClick={() => router.push("/patients")}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                onClick={() => router.push("/messages")}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
              >
                <Flask className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <header className="flex justify-between items-center px-6 py-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
              <h1 className="text-2xl font-medium text-[#1d1d1f] dark:text-white">Atlas AI</h1>
              <div className="flex gap-4 items-center">
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  className="bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-9 px-4 text-sm font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </div>
            </header>

            <div className="p-6">
              <h2 className="text-xl font-medium mb-6 text-[#1d1d1f] dark:text-white">DASHBOARD</h2>

              {/* Metric cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card
                  className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/scheduling")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                        <Calendar className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Upcoming</h3>
                        <p className="text-3xl font-bold mt-1 text-[#1d1d1f] dark:text-white">8</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Appointments Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/messages")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                        <MessageSquare className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Messages</h3>
                        <p className="text-3xl font-bold mt-1 text-[#1d1d1f] dark:text-white">5</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Unread Messages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                        <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Tasks</h3>
                        <p className="text-3xl font-bold mt-1 text-[#1d1d1f] dark:text-white">3</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Due Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3">
                        <Flask className="h-5 w-5 text-[#73a9e9]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Lab Results</h3>
                        <p className="text-3xl font-bold mt-1 text-[#1d1d1f] dark:text-white">2</p>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">Pending review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity and Quick Links */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden h-full">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white mb-4">Recent Activity</h3>

                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-[#73a9e9]" />
                          </div>
                          <div>
                            <p className="text-[#1d1d1f] dark:text-white font-medium">
                              New Patient 'Jane Doe' registered.
                            </p>
                            <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> 1 hour ago
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-[#73a9e9]" />
                          </div>
                          <div>
                            <p className="text-[#1d1d1f] dark:text-white font-medium">
                              Appointment confirmed: Bob Johnson
                            </p>
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
                  <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden h-full">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white mb-4">Quick Links</h3>
                      <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-4">Links to common tasks...</p>

                      <div className="flex flex-col gap-3">
                        <Button
                          className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] rounded-lg h-10 px-4 text-sm font-medium justify-start"
                          onClick={() => router.push("/patients")}
                        >
                          <Plus className="h-4 w-4 mr-2" /> ADD PATIENT
                        </Button>
                        <Button
                          className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] rounded-lg h-10 px-4 text-sm font-medium justify-start"
                          onClick={() => router.push("/messages")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" /> NEW MESSAGE
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer */}
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
        </div>
      </main>
    </ThemeProvider>
  )
}
