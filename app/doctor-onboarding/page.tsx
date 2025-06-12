import { ThemeProvider } from "@/components/theme-provider"
import DoctorOnboardingForm from "@/components/forms/doctor-onboarding-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atlas | Doctor Onboarding",
  description: "Complete your doctor profile on Atlas healthcare platform",
}

export default function DoctorOnboardingPage() {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] p-4">
        <div className="w-full max-w-4xl mx-auto py-8">
          <DoctorOnboardingForm />
        </div>
      </main>
    </ThemeProvider>
  )
} 