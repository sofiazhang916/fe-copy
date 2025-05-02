import type { Metadata } from "next"
import PatientClientPage from "./PatientClientPage"

export const metadata: Metadata = {
  title: "Atlas | Patient Portal",
  description: "Manage your healthcare journey with Atlas",
}

export default function PatientPage() {
  return <PatientClientPage />
}
