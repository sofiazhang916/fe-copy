"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"

export default function DashboardClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
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
        <div className="max-w-7xl mx-auto p-6">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#e5e5ea] dark:border-[#3a3a3c] pb-6">
            <div>
              <h1 className="text-3xl font-medium text-[#1d1d1f] dark:text-white">Atlas</h1>
              <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">Manage your practice and patients</p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0 items-center">
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                className="bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-9 px-4 text-sm font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white mb-4">Today's Schedule</h2>
                <div className="text-[#86868b] dark:text-[#a1a1a6] text-sm">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white mb-4">Patient Overview</h2>
                <div className="text-[#86868b] dark:text-[#a1a1a6] text-sm">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white mb-4">Account Status</h2>
                <div className="text-[#86868b] dark:text-[#a1a1a6] text-sm">
                  <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <p className="text-xs">Last updated: {new Date().toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-2xl font-medium text-[#1d1d1f] dark:text-white mb-3">Welcome to Atlas</h2>
                <p className="text-[#86868b] dark:text-[#a1a1a6]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
                  sed erat molestie vehicula.
                </p>
              </div>
              <div>
                <div className="bg-white dark:bg-[#2c2c2e] p-6 rounded-xl shadow-sm flex flex-col items-center justify-center h-full">
                  <p className="text-[#1d1d1f] dark:text-white font-medium text-lg mb-3">Need help?</p>
                  <Button className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg text-sm">
                    Contact support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
