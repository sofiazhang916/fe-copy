import type { Metadata } from "next"
import PatientsClientPage from "./PatientsClientPage"

export const metadata: Metadata = {
  title: "Atlas AI | Patients",
  description: "Manage your patients with Atlas AI healthcare platform",
}

export default function PatientsPage() {
  return <PatientsClientPage />
}
