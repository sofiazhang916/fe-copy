import type { Metadata } from "next"
import ProfileClientPage from "./ProfileClientPage"

export const metadata: Metadata = {
  title: "Atlas | Doctor Profile",
  description: "Manage your doctor profile on Atlas healthcare platform",
}

export default function ProfilePage() {
  return <ProfileClientPage />
}
