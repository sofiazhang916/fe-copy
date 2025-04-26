import type { Metadata } from "next"
import MessagesClientPage from "./MessagesClientPage"

export const metadata: Metadata = {
  title: "Atlas AI | Messages",
  description: "Patient engagement and messaging with Atlas AI healthcare platform",
}

export default function MessagesPage() {
  return <MessagesClientPage />
}
