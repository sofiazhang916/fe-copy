import { getTokens } from "@/lib/token-service"

// Types
export interface Appointment {
  patient_id: string
  patient_name: string
  appointment_time: string
  insurance_provider: string
  reason_for_visit: string[]
  age: number
  gender: string
  appointment_id?: string
  appointment_status?: string
  location?: string
  date?: string
}

export interface DailyCalendarResponse {
  message: string
  data: {
    date: string
    appointments: Appointment[]
  }
}

export interface WeeklyCalendarResponse {
  message: string
  data: {
    weekly_calendar: Array<{
      date: string
      appointments: Appointment[]
    }>
  }
}

export interface MonthlyCalendarResponse {
  message: string
  data: {
    month: number
    year: number
    monthly_calendar: Array<{
      date: string
      appointments: Appointment[]
    }>
  }
}

export interface PendingAppointmentsResponse {
  appointments: Array<Appointment>
  pagination: {
    next_cursor: string | null
    has_more: boolean
  }
}

const API_BASE_URL = "http://ec2-54-177-213-58.us-west-1.compute.amazonaws.com/profile-service/api/v1"

// Format date to yyyy-mm-dd
const formatDateParam = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Format date to yyyy/mm/dd
const formatDateSlashParam = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

// Get the doctor's daily calendar
export async function getDailyCalendar(date: Date): Promise<DailyCalendarResponse> {
  try {
    const doctorId = localStorage.getItem("doctorId")
    if (!doctorId) {
      throw new Error("Doctor ID not found")
    }

    const formattedDate = formatDateParam(date)
    const queryParams = new URLSearchParams({
      doctor_id: doctorId,
      date: formattedDate
    })

    const response = await fetch(
      `${API_BASE_URL}/calendar/view-daily-calendar/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch daily calendar")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching daily calendar:", error)
    
    // Return mock data for development purposes
    return {
      message: "Daily appointments listed successfully",
      data: {
        date: formatDateParam(date),
        appointments: []
      }
    }
  }
}

// Get the doctor's weekly calendar
export async function getWeeklyCalendar(startDate: Date, endDate: Date): Promise<WeeklyCalendarResponse> {
  try {
    const doctorId = localStorage.getItem("doctorId")
    if (!doctorId) {
      throw new Error("Doctor ID not found")
    }

    const formattedStartDate = formatDateSlashParam(startDate)
    const formattedEndDate = formatDateSlashParam(endDate)
    const queryParams = new URLSearchParams({
      doctor_id: doctorId,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    })

    const response = await fetch(
      `${API_BASE_URL}/calendar/view-weekly-calendar/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch weekly calendar")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching weekly calendar:", error)
    
    // Return mock data for development purposes
    const weeklyCalendar = []
    let currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      weeklyCalendar.push({
        date: formatDateParam(currentDate),
        appointments: []
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return {
      message: "Weekly appointments listed successfully",
      data: {
        weekly_calendar: weeklyCalendar
      }
    }
  }
}

// Get the doctor's monthly calendar
export async function getMonthlyCalendar(month: number, year: number): Promise<MonthlyCalendarResponse> {
  try {
    const doctorId = localStorage.getItem("doctorId")
    if (!doctorId) {
      throw new Error("Doctor ID not found")
    }

    const queryParams = new URLSearchParams({
      doctor_id: doctorId,
      month: month.toString(),
      year: year.toString()
    })

    const response = await fetch(
      `${API_BASE_URL}/calendar/view-monthly-calendar/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch monthly calendar")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching monthly calendar:", error)
    
    // Return mock data for development purposes
    const daysInMonth = new Date(year, month, 0).getDate()
    const monthlyCalendar = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      monthlyCalendar.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        appointments: []
      })
    }
    
    return {
      message: "Monthly appointments listed successfully",
      data: {
        month,
        year,
        monthly_calendar: monthlyCalendar
      }
    }
  }
}

// Get pending appointments (patient queue)
export async function getPendingAppointments(cursor?: string): Promise<PendingAppointmentsResponse> {
  try {
    const doctorId = localStorage.getItem("doctorId")
    if (!doctorId) {
      throw new Error("Doctor ID not found")
    }

    let url = `${API_BASE_URL}/appointment/view-pending-appointments/${doctorId}`
    
    if (cursor) {
      url += `?cursor=${cursor}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch pending appointments")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching pending appointments:", error)
    
    // Return mock data for development purposes
    return {
      appointments: [],
      pagination: {
        next_cursor: null,
        has_more: false
      }
    }
  }
} 