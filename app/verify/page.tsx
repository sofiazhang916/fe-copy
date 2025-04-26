import VerificationForm from "@/components/verification-form"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atlas | Verify Account",
  description: "Verify your Atlas healthcare platform account",
}

export default function VerifyPage() {
  return (
    <ThemeProvider>
      <main className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#1d1d1f] p-4">
        <div className="w-full max-w-md">
          <VerificationForm />
        </div>
      </main>
    </ThemeProvider>
  )
}
