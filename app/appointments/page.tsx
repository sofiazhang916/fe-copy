import type { Metadata } from "next"
import AppointmentsClientPage from "./AppointmentsClientPage"

export const metadata: Metadata = {
  title: "Atlas AI | Appointments",
  description: "Manage your appointments with Atlas AI healthcare platform",
}

export default function AppointmentsPage() {
  return <AppointmentsClientPage />
}
