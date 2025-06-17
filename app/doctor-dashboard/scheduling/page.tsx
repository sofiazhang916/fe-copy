"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DoctorLayoutWrapper from "@/components/layouts/doctor-layout"
import { useToast } from "@/hooks/use-toast"
import {
  FlaskRoundIcon as Flask,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
const DOCTOR_ID = "b979d98e-8011-7080-ec48-3e9d0ce6908f"

export default function SchedulingClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("viewMode") as "month" | "week" | "day" | "list") || "week"
    }
    return "week"
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEventModal, setAddEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEventStart, setNewEventStart] = useState("")
  const [newEventColor, setNewEventColor] = useState("#73a9e9")
  const colorInputRef = useRef<HTMLInputElement>(null)
  const openColorPicker = () => {
    colorInputRef.current?.click()
  }
  const [appointments, setAppointments] = useState<any[]>([])

  const router = useRouter()
  const { toast } = useToast()
  const handleChangeViewMode = (mode: "month" | "week" | "day" | "list") => {
    setViewMode(mode)
    localStorage.setItem("viewMode", mode)
  }
  const [searchQuery, setSearchQuery] = useState("")

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


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let url = ""
        const yyyy = currentDate.getFullYear()
        const mm = currentDate.getMonth() + 1
        const dd = currentDate.getDate()

        if (viewMode === "day") {
          const dayStr = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`
          url = `https://sales.getatlasai.co/profile-service/api/v1/calendar/view-daily-calendar/?doctor_id=${DOCTOR_ID}&date=${dayStr}`

        } else if (viewMode === "week") {
          const startOfWeek = new Date(currentDate)
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)

          const startStr = `${startOfWeek.getFullYear()}/${String(startOfWeek.getMonth() + 1).padStart(2, "0")}/${String(startOfWeek.getDate()).padStart(2, "0")}`
          const endStr = `${endOfWeek.getFullYear()}/${String(endOfWeek.getMonth() + 1).padStart(2, "0")}/${String(endOfWeek.getDate()).padStart(2, "0")}`

          url = `https://sales.getatlasai.co/profile-service/api/v1/calendar/view-weekly-calendar/?doctor_id=${DOCTOR_ID}&start_date=${startStr}&end_date=${endStr}`

        } else if (viewMode === "month") {
          url = `https://sales.getatlasai.co/profile-service/api/v1/calendar/view-monthly-calendar/?doctor_id=${DOCTOR_ID}&month=${mm}&year=${yyyy}`

        } else if (viewMode === "list") {
          url = `https://sales.getatlasai.co/profile-service/api/v1/appointment/view-appointments-list/${DOCTOR_ID}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()
        const appts = (data.appointments || data.data?.appointments
          || data.data?.weekly_calendar?.flatMap((d: { date: string; appointments: any[] }) =>
            d.appointments.map(a => ({ ...a, date: d.date }))
          )
          || data.data?.monthly_calendar?.flatMap((d: { date: string; appointments: any[] }) =>
            d.appointments.map(a => ({ ...a, date: d.date }))
          ) || [])

        const parsed = appts.map((a: any, index: number) => {
          const [hourStr, minStr] = (a.appointment_time).split(":")
          const hour = parseInt(hourStr)
          const minute = parseInt(minStr)

          const rawDate = a.date || data.data?.date || `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`
          const [year, month, day] = rawDate.split("-").map(Number)
          const date = new Date(year, month - 1, day, hour, minute)

          return {
            id: a.appointment_id || index,
            patient: a.patient_name,
            reason: a.reason_for_visit?.join(", ") || "General",
            date,
            hour,
            minute,
          }
        })

        setAppointments(parsed)
      } catch (err) {
        console.error("Error loading appointments:", err)
      }
    }

    fetchAppointments()
  }, [viewMode, currentDate])

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
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const labelHour = hour % 12 === 0 ? 12 : hour % 12
        const labelMin = minute === 0 ? "" : ":30"
        const period = hour < 12 ? "AM" : "PM"
        slots.push({ hour, minute, label: `${labelHour}${labelMin} ${period}` })
      }
    }
    return slots
  }

  const filteredAppointments = appointments.filter(a =>
    a.patient.toLowerCase().includes(searchQuery.toLowerCase())
  )


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

  function formatAsDatetimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  return (
    <DoctorLayoutWrapper activePage="calendar">
      {/* Main content */}
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium mb-6 text-[#1d1d1f] dark:text-white">Scheduling Calendar</h2>
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
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3"
                  value={newEventStart}
                  onChange={(e) => setNewEventStart(e.target.value)}
                />
                <input type="datetime-local" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3" />
                <textarea placeholder="Description" className="w-full border border-gray-300 dark:border-[#3a3a3c] rounded px-3 py-2 mb-3"></textarea>

                {/* Color picker section */}
                <div className="mb-4">
                  <label className="text-sm text-[#86868b] dark:text-[#a1a1a6] block mb-2">Color</label>
                  {/* Hidden native color input */}
                  <input
                    type="color"
                    ref={colorInputRef}
                    value={newEventColor}
                    onChange={(e) => setNewEventColor(e.target.value)}
                    className="hidden"
                  />
                  {/* Clickable color bar */}
                  <div
                    onClick={openColorPicker}
                    className="w-full h-10 rounded-md border border-[#e5e5ea] dark:border-[#3a3a3c] cursor-pointer"
                    style={{ backgroundColor: newEventColor }}
                  />
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
                onClick={() => handleChangeViewMode("month")}
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
                onClick={() => handleChangeViewMode("week")}
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
                onClick={() => handleChangeViewMode("day")}
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
                onClick={() => handleChangeViewMode("list")}
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
                    className={`h-32 p-2 border-b border-r relative text-right pr-2 cursor-pointer hover:bg-[#f0f4ff] dark:hover:bg-[#2e2e30] 
                      ${day?.toDateString() === new Date().toDateString()
                        ? "bg-[#73a9e9]/10 dark:bg-[#73a9e9]/10 text-[#73a9e9] font-semibold"
                        : ""
                      }`}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(day)
                        setNewEventStart(formatAsDatetimeLocal(day))
                        setAddEventModal(true)
                      }
                    }}
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

                {/* All-day row */}
                {/* <div className="grid grid-cols-8 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-[#f5f5f7] dark:bg-[#3a3a3c]">
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
                    <div className="p-2 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                      {slot.label}
                    </div>
                    {generateWeekDays().map((day, i) => {
                      const isToday = day.toDateString() === new Date().toDateString()
                      const appointment = appointments.find(
                        (a) =>
                          a.date.toDateString() === day.toDateString() &&
                          a.hour === slot.hour &&
                          a.minute === slot.minute
                      )
                      return (
                        <div
                          key={i}
                          className={`border-r h-12 relative cursor-pointer hover:bg-[#f0f4ff] dark:hover:bg-[#2e2e30]
                            ${isToday ? "bg-[#e6f0fb]" : ""}`}
                          onClick={() => {
                            const slotDate = new Date(day)
                            slotDate.setHours(hourIndex, 0, 0, 0)
                            setSelectedDate(slotDate)
                            setNewEventStart(formatAsDatetimeLocal(slotDate))
                            setAddEventModal(true)
                          }}
                        >
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

                {generateDayTimeSlots().map((slot, index) => {
                  const appointment = appointments.find(
                    (a) =>
                      a.date.toDateString() === currentDate.toDateString() &&
                      a.hour === slot.hour &&
                      a.minute === slot.minute
                  )

                  return (
                    <div key={`day-slot-${index}`} className="contents">
                      <div className="p-2 text-xs text-[#86868b] dark:text-[#a1a1a6] border-r border-[#e5e5ea] dark:border-[#3a3a3c]">
                        {slot.label}
                      </div>
                      <div
                        className="border-b border-[#e5e5ea] dark:border-[#3a3a3c] h-10 cursor-pointer hover:bg-[#f0f4ff] dark:hover:bg-[#2e2e30]"
                        onClick={() => {
                          const slotDate = new Date(currentDate)
                          slotDate.setHours(slot.hour, slot.minute, 0, 0)
                          setSelectedDate(slotDate)
                          setNewEventStart(formatAsDatetimeLocal(slotDate))
                          setAddEventModal(true)
                        }}
                      >
                        {appointment && (
                          <div className="bg-[#73a9e9] text-white text-xs px-2 py-1 rounded-md">
                            {appointment.patient} – {appointment.reason}
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
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search by patient name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded dark:bg-[#1d1d1f] dark:text-white dark:border-[#3a3a3c]"
                />

                {filteredAppointments.length === 0 ? (
                  <div className="text-center text-[#86868b] dark:text-[#a1a1a6] text-sm">
                    No matching appointments
                  </div>
                ) : (
                  <div className="divide-y divide-[#e5e5ea] dark:divide-[#3a3a3c]">
                    {filteredAppointments
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
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
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 py-12 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center flex flex-col items-center">
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
    </DoctorLayoutWrapper>
  )
}
