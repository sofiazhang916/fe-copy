import type { Metadata } from "next"
import PatientDashboardClientPage from "./PatientDashboardClientPage"

export const metadata: Metadata = {
  title: "Atlas | Patient Dashboard",
  description: "Manage your healthcare journey with Atlas",
}

export default function PatientDashboardPage() {
  return <PatientDashboardClientPage />
}
