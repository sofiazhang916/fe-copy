"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  Calendar,
  MessageSquare,
  User,
  Home,
  Search,
  CreditCard,
  Settings,
  Bell,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { clearTokens, isAuthenticated, refreshTokens, toggleUserRole } from "@/lib/token-service"

export default function PatientDashboardClientPage() {
  const [isLoading, setIsLoading] = useState(true)
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
        // Refresh tokens on page load
        const refreshResult = await refreshTokens()

        // If refresh failed but we still have a token, we can continue
        // This prevents unnecessary redirects when refresh token fails
        if (!refreshResult && !isAuthenticated()) {
          throw new Error("Authentication failed")
        }
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
              onClick={() => setShowDemoNotice(false)}
            >
              DISMISS
            </Button>
          </div>
        )}

        <div className="flex">
          {/* Sidebar */}
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
                className="w-full justify-start px-6 py-2.5 h-auto rounded-none bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9] font-medium"
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
              >
                <Search className="h-5 w-5 mr-3" />
                Find a Doctor
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium relative"
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
              >
                <User className="h-5 w-5 mr-3" />
                Health Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium relative"
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
              >
                <CreditCard className="h-5 w-5 mr-3" />
                Payment & Insurance
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-6 py-2.5 h-auto rounded-none text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] font-medium"
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

          {/* Main content */}
          <div className="flex-1">
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

            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-medium text-[#1d1d1f] dark:text-white mb-2">Your Health Dashboard</h1>
                <p className="text-[#86868b] dark:text-[#a1a1a6]">
                  Take control of your health journey with personalized insights and resources.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden h-full">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-medium text-[#1d1d1f] dark:text-white mb-4 text-center">
                        Welcome to Your Health Journey
                      </h2>
                      <p className="text-center text-[#86868b] dark:text-[#a1a1a6] mb-8">
                        We'll help you find the right doctor who is perfectly aligned with your health needs and goals.
                      </p>

                      <div className="space-y-8">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#1d1d1f] dark:text-white">Personalized Doctor Matching</h3>
                            <p className="text-[#86868b] dark:text-[#a1a1a6]">
                              Find doctors who specialize in your specific health needs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#1d1d1f] dark:text-white">Seamless Booking</h3>
                            <p className="text-[#86868b] dark:text-[#a1a1a6]">
                              Schedule appointments with just a few clicks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-3 flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-[#73a9e9]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#1d1d1f] dark:text-white">Hassle-Free Payments</h3>
                            <p className="text-[#86868b] dark:text-[#a1a1a6]">
                              Convenient copay collection and insurance verification
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-center">
                        <Button className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-full h-11 px-6 text-sm font-medium">
                          Start Your Health Profile <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden h-full">
                    <CardContent className="p-0">
                      <img
                        src="/placeholder.svg?key=416gy"
                        alt="Doctor with patient"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center">
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                  © 2025 Atlas • <span className="hover:underline cursor-pointer">Help</span> •
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
