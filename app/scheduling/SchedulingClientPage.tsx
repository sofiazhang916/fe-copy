"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  Calendar,
  MessageSquare,
  FlaskRoundIcon as Flask,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"

export default function SchedulingClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializePage = async () => {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.push("/")
        return
      }

      try {
        // Refresh tokens on page load
        await refreshTokens()
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

    initializePage()
  }, [router, toast])

  const handleLogout = () => {
    // Clear all tokens
    clearTokens()
    router.push("/")
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }

    if (viewMode === "week") {
      // Get start of week (Sunday)
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

      // Get end of week (Saturday)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const startMonth = startOfWeek.toLocaleString("default", { month: "short" })
      const endMonth = endOfWeek.toLocaleString("default", { month: "short" })
      const startDay = startOfWeek.getDate()
      const endDay = endOfWeek.getDate()
      const year = endOfWeek.getFullYear()

      if (startMonth === endMonth) {
        return `${startMonth} ${startDay} – ${endDay}, ${year}`
      } else {
        return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`
      }
    } else if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", options)
    } else if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    return currentDate.toLocaleDateString("en-US", options)
  }

  const generateTimeSlots = () => {
    const timeSlots = []
    for (let hour = 0; hour < 12; hour++) {
      timeSlots.push(`${hour === 0 ? 12 : hour}:30am`)
    }
    return timeSlots
  }

  const generateWeekDays = () => {
    const days = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()) // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push({
        date: day,
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: day.getDate(),
        monthNumber: day.getMonth() + 1,
        isToday: day.toDateString() === new Date().toDateString(),
      })
    }

    return days
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading scheduling...</p>
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-[#1d1d1f] dark:text-white">Scheduling Calendar</h2>
                <Button className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </div>

              {/* Calendar controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md h-9"
                    onClick={navigatePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md h-9"
                    onClick={navigateNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md h-9"
                    onClick={navigateToday}
                  >
                    Today
                  </Button>
                </div>

                <div className="text-lg font-medium">{getDateRangeText()}</div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-md h-9 ${
                      viewMode === "month"
                        ? "bg-[#73a9e9] hover:bg-[#5a9ae6] text-white"
                        : "bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-md h-9 ${
                      viewMode === "week"
                        ? "bg-[#73a9e9] hover:bg-[#5a9ae6] text-white"
                        : "bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-md h-9 ${
                      viewMode === "day"
                        ? "bg-[#73a9e9] hover:bg-[#5a9ae6] text-white"
                        : "bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                    onClick={() => setViewMode("day")}
                  >
                    Day
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-md h-9 ${
                      viewMode === "list"
                        ? "bg-[#73a9e9] hover:bg-[#5a9ae6] text-white"
                        : "bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="bg-white dark:bg-[#2c2c2e] rounded-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] overflow-hidden">
                {/* Week view */}
                {viewMode === "week" && (
                  <div>
                    {/* Days header */}
                    <div className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                      <div className="p-3 text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                        all-day
                      </div>
                      {generateWeekDays().map((day, index) => (
                        <div
                          key={index}
                          className={`p-3 text-center ${day.isToday ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5" : ""}`}
                        >
                          <div className="text-sm font-medium">
                            {day.dayName} {day.monthNumber}/{day.dayNumber}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time slots */}
                    {generateTimeSlots().map((timeSlot, index) => (
                      <div key={index} className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                        <div className="p-3 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                          {timeSlot}
                        </div>
                        {Array(7)
                          .fill(0)
                          .map((_, dayIndex) => (
                            <div
                              key={dayIndex}
                              className={`p-1 min-h-[50px] border-r border-[#e5e5ea] dark:border-[#3a3a3c] ${
                                generateWeekDays()[dayIndex].isToday ? "bg-[#73a9e9]/5 dark:bg-[#73a9e9]/5" : ""
                              }`}
                            ></div>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
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
