"use client"

import LoginForm from "@/components/forms/login-form"
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
  const [isDoctor, setIsDoctor] = useState(false)

  return (
    <ThemeProvider>
      <main className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#1d1d1f] transition-colors duration-300",
        isDoctor && "bg-[#f0f7ff] dark:bg-[#1a1a2e]"
      )}>
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white/50 dark:bg-[#2c2c2e]/50 backdrop-blur-sm rounded-xl p-1.5 shadow-lg">
            <div className="flex">
              <button
                onClick={() => setIsDoctor(false)}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200",
                  !isDoctor
                    ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm"
                    : "text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                )}
              >
                Patient Login
              </button>
              <button
                onClick={() => setIsDoctor(true)}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200",
                  isDoctor
                    ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm"
                    : "text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                )}
              >
                Doctor Login
              </button>
            </div>
          </div>
          <LoginForm isDoctor={isDoctor} />
        </div>
      </main>
    </ThemeProvider>
  )
}
