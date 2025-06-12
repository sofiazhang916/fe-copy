"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OnboardingForm() {
  const router = useRouter()

  const handleDoctorSelect = () => {
    router.push("/onboard/doctor")
  }

  const handlePatientSelect = () => {
    // This is disabled for now
  }

  return (
    <div className="space-y-8 bg-white dark:bg-[#1d1d1f] p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium text-[#1d1d1f] dark:text-white">Atlas</h1>
          <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">Choose account type</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-4 pt-4">
        <p className="text-[#1d1d1f] dark:text-white text-center font-medium">I am a:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleDoctorSelect}
            className="h-32 flex flex-col justify-center items-center bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-xl"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-8 w-8 mb-2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="font-medium">Doctor</span>
          </Button>
          
          <Button
            disabled
            className="h-32 flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 text-gray-400 rounded-xl cursor-not-allowed"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-8 w-8 mb-2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="font-medium">Patient</span>
            <span className="text-xs mt-1">(Coming soon)</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 