import { ThemeProvider } from "@/components/theme-provider"
import OnboardingForm from "@/components/forms/onboarding-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atlas | Choose Account Type",
  description: "Choose your account type on Atlas healthcare platform",
}

export default function OnboardingPage() {
  return (
    <ThemeProvider>
      <main className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#1d1d1f] p-4">
        <div className="w-full max-w-md">
          <OnboardingForm />
        </div>
      </main>
    </ThemeProvider>
  )
} 