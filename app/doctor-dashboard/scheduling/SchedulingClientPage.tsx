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
  User2,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import DoctorSidebar from "@/components/ui/DoctorSidebar"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"

export default function SchedulingClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  // const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [showEventModal, setAddEventModal] = useState(false)
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
    clearTokens()
    router.push("/")
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") newDate.setDate(newDate.getDate() - 7)
    else if (viewMode === "day") newDate.setDate(newDate.getDate() - 1)
    else if (viewMode === "month") newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") newDate.setDate(newDate.getDate() + 7)
    else if (viewMode === "day") newDate.setDate(newDate.getDate() + 1)
    else if (viewMode === "month") newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const navigateToday = () => setCurrentDate(new Date())

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    if (viewMode === "week") {
      const startMonth = startOfWeek.toLocaleString("default", { month: "short" })
      const endMonth = endOfWeek.toLocaleString("default", { month: "short" })
      const startDay = startOfWeek.getDate()
      const endDay = endOfWeek.getDate()
      const year = endOfWeek.getFullYear()
      return startMonth === endMonth
        ? `${startMonth} ${startDay} – ${endDay}, ${year}`
        : `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`
    } else if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", options)
    } else if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    return currentDate.toLocaleDateString("en-US", options)
  }

  /* month */
  const generateMonthGrid = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    const startDay = start.getDay()
    const totalDays = end.getDate()

    const days: (Date | null)[] = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i))
    while (days.length % 7 !== 0) days.push(null)

    return days
  }

  /* week */
  const generateWeekDays = () => {
    const days = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  /* day */
  const generateDayTimeSlots = () => {
    const timeSlots = []
    for (let hour = 0; hour < 24; hour++) {
      const label = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
      timeSlots.push(label)
    }
    return timeSlots
  }

  // genenrate some dummy appointments for testing
  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      reason: "Check-up",
      insurance: "Medicare Advantage - Blue Cross",
      date: new Date(), // today
      hour: 9,
    },
    {
      id: 2,
      patient: "Jane Smith",
      reason: "Consultation",
      insurance: "Private Insurance - Aetna",
      date: new Date(), // today
      hour: 14,
    },
    {
      id: 3,
      patient: "Alex Johnson",
      reason: "Annual Physical",
      insurance: "UnitedHealthcare PPO",
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() + 2) // 2 days from today
        return d
      })(),
      hour: 11,
    },
    {
      id: 4,
      patient: "Emily Lee",
      reason: "Flu Symptoms",
      insurance: "Cigna Health Plan",
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() - 2) // 2 days before today
        return d
      })(),
      hour: 16,
    },
  ]

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
        {/* {showDemoNotice && (
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
            <DoctorSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(prev => !prev)} activePage="calendar" />

            {/* Main content */}
            <div className="flex-1">

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-[#1d1d1f] dark:text-white">Scheduling Calendar</h2>
                  <Button onClick={() => setAddEventModal(true)} className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                  </Button>
                </div>

                {/* Add new Appointment  */}
                {showEventModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#2c2c2e] p-6 rounded-lg shadow-xl w-[500px] max-w-full">
                      <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
                      <input type="text" placeholder="Title" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3" />
                      <input type="datetime-local" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3" />
                      <input type="datetime-local" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3" />
                      <textarea placeholder="Description" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3"></textarea>
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-[#86868b] dark:text-[#a1a1a6] mr-2">Color</span>
                        <input type="color" className="h-2 w-full" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddEventModal(false)}>Cancel</Button>
                        <Button className="bg-[#73a9e9] text-white">+ Add</Button>
                      </div>
                    </div>
                  </div>
                )}

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
                      className={`rounded-md h-9 ${viewMode === "month"
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
                      className={`rounded-md h-9 ${viewMode === "week"
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
                      className={`rounded-md h-9 ${viewMode === "day"
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
                      className={`rounded-md h-9 ${viewMode === "list"
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
                  {/* Month view */}
                  {viewMode === "month" && (
                    <div className="grid grid-cols-7 text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="p-2 text-sm font-medium border-b border-[#e5e5ea] dark:border-[#3a3a3c]">{day}</div>
                      ))}
                      {generateMonthGrid().map((day, index) => (
                        <div
                          key={index}
                          className={`h-24 p-2 border-b border-r border-[#e5e5ea] dark:border-[#3a3a3c] relative text-right pr-2 ${day?.toDateString() === new Date().toDateString()
                            ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/10 text-[#73a9e9] font-semibold"
                            : ""
                            }`}
                        >
                          <span className={`${day?.getMonth() !== currentDate.getMonth() ? "text-gray-400" : ""}`}>
                            {day?.getDate()}
                          </span>

                          {day &&
                            appointments
                              .filter(a => a.date.toDateString() === day.toDateString())
                              .map(a => (
                                <div
                                  key={a.id}
                                  className="bg-[#73a9e9] text-white text-xs mt-1 px-1 py-0.5 rounded text-left truncate"
                                >
                                  {a.patient}
                                </div>
                              ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Week view */}
                  {viewMode === "week" && (
                    <div>
                      <div className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                        <div className="p-2 text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] border-r">Time</div>
                        {generateWeekDays().map((day, index) => {
                          const isToday = day.toDateString() === new Date().toDateString()
                          return (
                            <div
                              key={index}
                              className={`p-2 text-sm text-center border-r ${isToday ? "bg-[#e6f0fb] text-[#73a9e9] font-semibold" : ""
                                }`}
                            >
                              {day.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" })}
                            </div>
                          )
                        })}
                      </div>

                      {/* All-day row
                      <div className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-[#f5f5f7] dark:bg-[#3a3a3c]">
                        <div className="p-2 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r">all-day</div>
                        {generateWeekDays().map((day, i) => {
                          const isToday = day.toDateString() === new Date().toDateString()
                          return (
                            <div key={i} className={`border-r h-12 ${isToday ? "bg-[#e6f0fb]" : ""}`}></div>
                          )
                        })}
                      </div> */}

                      {/* Time slots */}
                      {generateDayTimeSlots().map((slot, hourIndex) => (
                        <div key={hourIndex} className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                          <div className="p-2 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r">{slot}</div>
                          {generateWeekDays().map((day, i) => {
                            const isToday = day.toDateString() === new Date().toDateString()
                            const appointment = appointments.find(
                              (a) =>
                                a.date.toDateString() === day.toDateString() && a.hour === hourIndex
                            )
                            return (
                              <div key={i} className={`border-r h-12 relative ${isToday ? "bg-[#e6f0fb]" : ""}`}>
                                {appointment && (
                                  <div className="absolute inset-1 bg-[#73a9e9] text-white text-xs px-1 py-0.5 rounded">
                                    {appointment.patient} - {appointment.reason}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Day view */}
                  {viewMode === "day" && (
                    <div className="grid" style={{ gridTemplateColumns: "80px 1fr" }}>
                      <div className="col-span-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-center text-sm font-medium py-2 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                        {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
                      </div>
                      <div className="text-xs text-[#86868b] dark:text-[#a1a1a6] px-2 py-2 border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                        all-day
                      </div>
                      <div className="border-b border-[#e5e5ea] dark:border-[#3a3a3c] h-12"></div>
                      {generateDayTimeSlots().map((slot, index) => {
                        const appointment = appointments.find(
                          a => a.date.toDateString() === currentDate.toDateString() && a.hour === index
                        )
                        return (
                          <div key={`row-${index}`} className="contents">
                            <div className="p-2 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                              {slot}
                            </div>
                            <div className="border-b border-[#e5e5ea] dark:border-[#3a3a3c] h-10">
                              {appointment && (
                                <div className="bg-[#73a9e9] text-white text-xs px-2 py-1 rounded-md">
                                  {appointment.patient} – {appointment.reason} ({appointment.insurance})
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* List view */}
                  {viewMode === "list" && (
                    appointments.length === 0 ? (
                      <div className="p-10 text-center text-[#86868b] dark:text-[#a1a1a6] text-sm">
                        No events to display
                      </div>
                    ) : (
                      <div className="divide-y divide-[#e5e5ea] dark:divide-[#3a3a3c]">
                        {appointments
                          .slice() // create a shallow copy to avoid mutating original
                          .sort((a, b) => a.date.getTime() - b.date.getTime()) // sort by date ascending
                          .map(appt => (
                            <div key={appt.id} className="p-4">
                              <div className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{appt.patient}</div>
                              <div className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </div>
                              <div className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">
                                Reason: {appt.reason}
                              </div>
                              <div className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                                Insurance: {appt.insurance}
                              </div>
                            </div>
                          ))}
                      </div>
                    )
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
        </div>
      </main>
    </ThemeProvider>
  )
}
