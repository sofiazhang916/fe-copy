"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent } from "@/components/ui/card"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import PatientLayout from "../components/patient-layout"

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
    <>
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

      <PatientLayout currentRoute="/patient-dashboard">
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
            <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=600&h=500&auto=format&fit=crop"
                  alt="Doctor with patient"
                  className="w-full h-full object-cover rounded-xl"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </PatientLayout>
    </>
  )
}
