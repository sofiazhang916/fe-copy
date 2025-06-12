"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function VerificationForm() {
  const [email, setEmail] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get email from localStorage that was stored during signup
    const storedEmail = localStorage.getItem("verificationEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email is found, redirect to signup
      router.push("/signup")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Calling verification API with:", { email, confirmationCode })

      const response = await fetch("https://8qgxh9alt4.execute-api.us-west-1.amazonaws.com/dev/doctor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "confirmation",
          account_details: {
            email,
            confirmation_code: confirmationCode,
          },
        }),
      })

      console.log("Verification API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Verification API error:", errorData)
        throw new Error(errorData.message || "Verification failed")
      }

      const responseData = await response.json()
      console.log("Verification successful:", responseData)

      toast({
        title: "Verification successful",
        description: "Your account has been verified. You can now complete your profile.",
      })

      // Clear verification email from storage
      localStorage.removeItem("verificationEmail")
      
      // Redirect to onboarding page instead of login
      router.push("/onboarding")
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 bg-white dark:bg-[#1d1d1f] p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium text-[#1d1d1f] dark:text-white">Atlas</h1>
          <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">Verify your account</p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f]/60 dark:text-white/60 focus-visible:ring-0"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmationCode" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Verification Code
          </label>
          <Input
            id="confirmationCode"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-center tracking-widest text-lg font-medium"
            placeholder="000000"
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#73a9e9] hover:bg-[#5a9ae6] text-white font-medium text-sm mt-4 rounded-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>
    </div>
  )
}
