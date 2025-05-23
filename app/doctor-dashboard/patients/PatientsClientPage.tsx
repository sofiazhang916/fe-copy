"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Calendar, MessageSquare, FlaskRoundIcon as Flask, User, Search, MapPin, Check, X, User2 } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import DoctorSidebar from "@/components/ui/DoctorSidebar"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"

// Mock patient data
const patients = [
  {
    id: 1,
    name: "Emily Rodriguez",
    age: 88,
    gender: "Female",
    matchPercentage: 99,
    conditions: ["Chronic Kidney Disease"],
    insuranceType: "Private Insurance",
    insuranceProvider: "Aetna",
    utilizerStatus: "High Utilizer",
    insuranceStatus: "Verified",
    estimatedValue: 8674,
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    name: "Thomas Chen",
    age: 72,
    gender: "Female",
    matchPercentage: 93,
    conditions: ["Heart Disease"],
    insuranceType: "Medicare Advantage",
    insuranceProvider: "Kaiser Permanente",
    utilizerStatus: "Moderate Utilizer",
    insuranceStatus: "Verified",
    estimatedValue: 6008,
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Susan Kim",
    age: 70,
    gender: "Female",
    matchPercentage: 91,
    conditions: ["Diabetes Type 2"],
    insuranceType: "Medicare Advantage",
    insuranceProvider: "Blue Cross",
    utilizerStatus: "High Utilizer",
    insuranceStatus: "Verified",
    estimatedValue: 7711,
    location: "Phoenix, AZ",
  },
  {
    id: 4,
    name: "Robert Jackson",
    age: 79,
    gender: "Male",
    matchPercentage: 88,
    conditions: ["Heart Disease"],
    insuranceType: "Medicare Advantage",
    insuranceProvider: "Blue Cross",
    utilizerStatus: "Moderate Utilizer",
    insuranceStatus: "Pending",
    estimatedValue: 6345,
    location: "Philadelphia, PA",
  },
  {
    id: 5,
    name: "Maria Gonzalez",
    age: 87,
    gender: "Female",
    matchPercentage: 85,
    conditions: ["Chronic Kidney Disease"],
    insuranceType: "Private Insurance",
    insuranceProvider: "Blue Cross",
    utilizerStatus: "High Utilizer",
    insuranceStatus: "Verified",
    estimatedValue: 8676,
    location: "San Diego, CA",
  },
]

export default function PatientsClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializePage = async () => {
      if (!isAuthenticated()) {
        router.push("/")
        return
      }
      try {
        await refreshTokens()
      } catch (error) {
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
    initializePage()
  }, [router, toast])

  const handleLogout = () => {
    clearTokens()
    router.push("/")
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading patients...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        {/* {showDemoNotice && (
          <div className="w-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 py-3 px-6 flex justify-between items-center">
            <Button
              className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium"
              onClick={() =>
                toast({ title: "Connect with us", description: "Our team will reach out to you shortly." })
              }
            >
              CONNECT WITH US!
            </Button>
          </div>
        )} */}

        <div className="flex-1">
          <header className="h-14 flex items-center justify-between px-6 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e]">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="ml-1" onClick={() => setSidebarCollapsed(prev => !prev)}>
                {sidebarCollapsed ? <span>&raquo;</span> : <span>&laquo;</span>}
              </Button>
              <button onClick={() => navigateTo("/doctor-dashboard")} className="bg-transparent rounded px-2 py-1">
                <img src="/logo-atlasai.png" alt="Atlas AI Logo" className="h-6" />
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <Button onClick={() => navigateTo("/doctor-dashboard/profile")} className="rounded-lg h-9 px-4 text-sm font-medium">
                <User2 className="mr-2 h-4 w-4" /> My Profile
              </Button>
              <ThemeToggle />
              <Button onClick={handleLogout} className="rounded-lg h-9 px-4 text-sm font-medium">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </header>

          <div className="flex flex-1">
            <DoctorSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(prev => !prev)} activePage="patients" />

            {/* Main content */}
            <div className="flex-1">
              <div className="p-6">
                <h2 className="text-xl font-medium mb-6 text-[#1d1d1f] dark:text-white">Patient Match Queue</h2>

                {/* Search bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                    <Input
                      type="text"
                      placeholder="Search by name or insurance provider or insurance status"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-[#2c2c2e] border-0 rounded-lg shadow-sm text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                    />
                  </div>
                </div>

                {/* Patient list */}
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="bg-white dark:bg-[#2c2c2e] shadow-sm border-l-4 border-l-[#73a9e9] border-t-0 border-r-0 border-b-0 rounded-lg overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          {/* Match percentage */}
                          <div
                            className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold ${patient.matchPercentage >= 95
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : patient.matchPercentage >= 90
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}
                          >
                            {patient.matchPercentage}%
                          </div>

                          {/* Patient info */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white flex items-center gap-2">
                                  {patient.name}
                                  <span className="text-sm font-normal text-[#86868b] dark:text-[#a1a1a6]">
                                    {patient.age} {patient.gender}
                                  </span>
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-1">
                                  {patient.conditions.map((condition, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-2 py-1 rounded-md"
                                    >
                                      {condition}
                                    </span>
                                  ))}
                                  <span className="text-xs bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-2 py-1 rounded-md">
                                    {patient.insuranceType}
                                  </span>
                                  <span className="text-xs bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-2 py-1 rounded-md">
                                    {patient.utilizerStatus}
                                  </span>
                                </div>

                                <div className="mt-2 text-sm">
                                  <span
                                    className={`${patient.insuranceStatus === "Verified"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                      }`}
                                  >
                                    Insurance {patient.insuranceStatus}
                                  </span>
                                  <span className="text-[#86868b] dark:text-[#a1a1a6] mx-2">|</span>
                                  <span className="text-[#86868b] dark:text-[#a1a1a6]">
                                    {patient.insuranceType} - {patient.insuranceProvider}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Est.Value:</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(patient.estimatedValue)}
                                </div>

                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-md"
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#86868b] dark:text-[#a1a1a6] hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Decline
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-2 text-sm text-[#86868b] dark:text-[#a1a1a6] flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {patient.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
        </div>
      </main>
    </ThemeProvider>
  )
}
