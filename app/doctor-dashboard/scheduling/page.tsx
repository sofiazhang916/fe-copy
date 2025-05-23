import type { Metadata } from "next"
import SchedulingClientPage from "./SchedulingClientPage"

export const metadata: Metadata = {
  title: "Atlas AI | Scheduling",
  description: "Manage your scheduling with Atlas AI healthcare platform",
}

export default function SchedulingPage() {
  return <SchedulingClientPage />
}
