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
  AlertCircle,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import DoctorSidebar from "@/components/ui/DoctorSidebar"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import { 
  getDailyCalendar, 
  getWeeklyCalendar, 
  getMonthlyCalendar,
  getPendingAppointments,
  Appointment
} from "@/lib/calendar-service"

export default function AppointmentsClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [weeklyAppointments, setWeeklyAppointments] = useState<{[date: string]: Appointment[]}>({})
  const [monthlyAppointments, setMonthlyAppointments] = useState<{[date: string]: Appointment[]}>({})
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Ensure doctorId is set for demo - would normally come from auth
  useEffect(() => {
    if (!localStorage.getItem("doctorId")) {
      localStorage.setItem("doctorId", "123e4567-e89b-12d3-a456-426614174000")
    }
  }, [])

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

  // Load appointments when date or view mode changes
  useEffect(() => {
    if (isLoading) return

    const fetchAppointments = async () => {
      setIsAppointmentsLoading(true)
      try {
        if (viewMode === "day") {
          const result = await getDailyCalendar(currentDate)
          setAppointments(result.data.appointments)
        } else if (viewMode === "week") {
          // Get start of week (Sunday)
          const startOfWeek = new Date(currentDate)
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

          // Get end of week (Saturday)
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)

          const result = await getWeeklyCalendar(startOfWeek, endOfWeek)
          
          // Convert to a map for easier lookup
          const appointmentMap: {[date: string]: Appointment[]} = {}
          result.data.weekly_calendar.forEach(day => {
            appointmentMap[day.date] = day.appointments
          })
          
          setWeeklyAppointments(appointmentMap)
        } else if (viewMode === "month") {
          const month = currentDate.getMonth() + 1 // API expects 1-12
          const year = currentDate.getFullYear()
          
          const result = await getMonthlyCalendar(month, year)
          
          // Convert to a map for easier lookup
          const appointmentMap: {[date: string]: Appointment[]} = {}
          result.data.monthly_calendar.forEach(day => {
            appointmentMap[day.date] = day.appointments
          })
          
          setMonthlyAppointments(appointmentMap)
        } else if (viewMode === "list") {
          const result = await getPendingAppointments()
          setPendingAppointments(result.appointments)
          setNextCursor(result.pagination.next_cursor)
          setHasMore(result.pagination.has_more)
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        })
      } finally {
        setIsAppointmentsLoading(false)
      }
    }

    fetchAppointments()
  }, [currentDate, viewMode, isLoading, toast])

  const loadMorePendingAppointments = async () => {
    if (!nextCursor || !hasMore) return
    
    try {
      setIsAppointmentsLoading(true)
      const result = await getPendingAppointments(nextCursor)
      setPendingAppointments([...pendingAppointments, ...result.appointments])
      setNextCursor(result.pagination.next_cursor)
      setHasMore(result.pagination.has_more)
    } catch (error) {
      console.error("Error fetching more appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load more appointments",
        variant: "destructive",
      })
    } finally {
      setIsAppointmentsLoading(false)
    }
  }

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
    } else if (viewMode === "list") {
      return "Patient Queue"
    }

    return currentDate.toLocaleDateString("en-US", options)
  }

  const generateTimeSlots = () => {
    const timeSlots = []
    for (let hour = 9; hour < 18; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
      const amPm = hour < 12 ? 'am' : 'pm'
      timeSlots.push(`${hourFormatted}:00${amPm}`)
      timeSlots.push(`${hourFormatted}:30${amPm}`)
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
        formattedDate: day.toISOString().split('T')[0], // YYYY-MM-DD format for API
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: day.getDate(),
        monthNumber: day.getMonth() + 1,
        isToday: day.toDateString() === new Date().toDateString(),
      })
    }

    return days
  }

  const renderWeekView = () => {
    const timeSlots = generateTimeSlots()
    const weekDays = generateWeekDays()
    
    return (
      <div className="overflow-x-auto">
        <div>
          {/* Days header */}
          <div className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
            <div className="p-3 text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
              all-day
            </div>
            {weekDays.map((day, index) => (
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
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
              <div className="p-3 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                {timeSlot}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayAppointments = weeklyAppointments[day.formattedDate]?.filter(appointment => {
                  return appointment.appointment_time === timeSlot.replace('am', '').replace('pm', '')
                }) || []
                
                return (
                  <div
                    key={dayIndex}
                    className={`p-1 min-h-[50px] border-r border-[#e5e5ea] dark:border-[#3a3a3c] ${
                      day.isToday ? "bg-[#73a9e9]/5 dark:bg-[#73a9e9]/5" : ""
                    } relative group`}
                  >
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((appointment, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#73a9e9]/10 dark:bg-[#73a9e9]/20 p-1 rounded-md mb-1 cursor-pointer hover:bg-[#73a9e9]/20 dark:hover:bg-[#73a9e9]/30 text-xs"
                        >
                          <div className="font-medium truncate">{appointment.patient_name}</div>
                          <div className="truncate text-[#86868b] dark:text-[#a1a1a6]">
                            {appointment.reason_for_visit.join(", ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full w-full opacity-0 group-hover:opacity-100 flex justify-center">
                        <button className="text-xs text-[#73a9e9] hover:text-[#5a9ae6] mt-2">+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    // Get first day of month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Get days in month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    
    // Calculate previous month days to show
    const prevMonthDays = startingDayOfWeek
    
    // Generate day cells
    const dayCells = []
    let dayCounter = 1
    const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7
    
    // Add previous month days
    for (let i = 0; i < prevMonthDays; i++) {
      dayCells.push({ day: null, inMonth: false })
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      const formattedDate = date.toISOString().split('T')[0]
      const isToday = date.toDateString() === new Date().toDateString()
      dayCells.push({ 
        day: i, 
        inMonth: true, 
        date: formattedDate, 
        isToday,
        appointments: monthlyAppointments[formattedDate] || [] 
      })
    }
    
    // Add next month days
    const remainingCells = totalCells - dayCells.length
    for (let i = 1; i <= remainingCells; i++) {
      dayCells.push({ day: i, inMonth: false })
    }
    
    // Create rows (weeks)
    const rows = []
    for (let i = 0; i < dayCells.length; i += 7) {
      rows.push(dayCells.slice(i, i + 7))
    }
    
    return (
      <div className="overflow-auto">
        <div className="grid grid-cols-7 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="p-3 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {rows.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
            {week.map((cell, dayIndex) => (
              <div 
                key={dayIndex} 
                className={`p-1 min-h-[120px] border-r border-[#e5e5ea] dark:border-[#3a3a3c] ${
                  !cell.inMonth ? 'opacity-40' : ''
                } ${
                  cell.isToday ? 'bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5' : ''
                } relative`}
              >
                <div className="text-right p-1 text-sm">{cell.day}</div>
                {cell.inMonth && cell.appointments && cell.appointments.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {cell.appointments.map((appointment, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#73a9e9]/10 dark:bg-[#73a9e9]/20 p-1 rounded-md text-xs cursor-pointer hover:bg-[#73a9e9]/20 dark:hover:bg-[#73a9e9]/30"
                      >
                        <div className="font-medium truncate">{appointment.appointment_time} • {appointment.patient_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const renderListView = () => {
    return (
      <div className="overflow-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Patient Queue</h3>
          {pendingAppointments.length === 0 && !isAppointmentsLoading ? (
            <div className="bg-white dark:bg-[#2c2c2e] rounded-lg p-6 text-center border border-[#e5e5ea] dark:border-[#3a3a3c]">
              <AlertCircle className="h-8 w-8 mx-auto text-[#86868b] dark:text-[#a1a1a6] mb-2" />
              <p className="text-[#86868b] dark:text-[#a1a1a6]">No pending appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAppointments.map((appointment, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-[#2c2c2e] rounded-lg p-4 border border-[#e5e5ea] dark:border-[#3a3a3c] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.patient_name}</h4>
                      <div className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                        {appointment.age} • {appointment.gender} • {appointment.insurance_provider}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Reason:</span> {appointment.reason_for_visit.join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-[#73a9e9]/10 dark:bg-[#73a9e9]/20 text-[#73a9e9] py-1 px-2 rounded-md text-sm font-medium">
                        {appointment.date} • {appointment.appointment_time}
                      </div>
                      <div className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">
                        {appointment.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-[#e5e5ea] dark:border-[#3a3a3c] flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white dark:bg-transparent text-[#1d1d1f] dark:text-white border-[#e5e5ea] dark:border-[#3a3a3c]"
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <div className="text-center pt-2">
                  <Button 
                    variant="outline" 
                    onClick={loadMorePendingAppointments}
                    disabled={isAppointmentsLoading}
                    className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white"
                  >
                    {isAppointmentsLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    // Implementation of renderDayView
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading appointments...</p>
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
          <DoctorSidebar activePage="calendar" />

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
                <h2 className="text-xl font-medium text-[#1d1d1f] dark:text-white">Appointments Calendar</h2>
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

              {/* Loading state */}
              {isAppointmentsLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1d1d1f]/50 z-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
                </div>
              )}

              {/* Calendar grid */}
              <div className="bg-white dark:bg-[#2c2c2e] rounded-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] overflow-hidden">
                {viewMode === "day" && renderDayView()}
                {viewMode === "week" && renderWeekView()}
                {viewMode === "month" && renderMonthView()}
                {viewMode === "list" && renderListView()}
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
