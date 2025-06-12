"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PhoneInput } from "@/components/phone-input"
import { checkPasswordStrength, hashPassword } from "@/lib/password-utils"
import { Progress } from "@/components/ui/progress"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    practice_name: "",
    phone_number: "+1",
  })
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "#f87171",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Check password strength when password changes
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone_number: value }))
  }

  // Validate phone number format (E.164 format)
  const isValidPhoneNumber = (phone: string) => {
    // Basic E.164 format validation: + followed by digits only, minimum length of 8
    const phoneRegex = /^\+[0-9]{8,15}$/
    return phoneRegex.test(phone)
  }

  const validateForm = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address")
      return false
    }

    // Validate password strength
    if (passwordStrength.score < 3) {
      setErrorMessage("Please create a stronger password. " + passwordStrength.feedback)
      return false
    }

    // Validate name
    if (formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name")
      return false
    }

    // Validate practice name
    if (formData.practice_name.trim().length < 2) {
      setErrorMessage("Please enter your practice name")
      return false
    }

    // Validate phone number in E.164 format
    if (!isValidPhoneNumber(formData.phone_number)) {
      setErrorMessage("Please enter a valid phone number")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // No longer hashing password
      console.log("Calling signup API with data:", {
        action: "signup",
        account_details: {
          email: formData.email,
          password: "[REDACTED]", // Don't log actual password
          name: formData.name,
          practice_name: formData.practice_name,
          phone_number: formData.phone_number,
        },
      })

      const response = await fetch("https://8qgxh9alt4.execute-api.us-west-1.amazonaws.com/dev/doctor/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          account_details: {
            email: formData.email,
            password: formData.password, // Send plain password
            name: formData.name,
            practice_name: formData.practice_name,
            phone_number: formData.phone_number,
          },
        }),
      })

      console.log("Signup API response status:", response.status)
      const responseData = await response.json()
      console.log("Signup API response data:", responseData)

      // Check if the response contains an error message despite a 200 status
      if (responseData.statusCode === 400 ) {
        // Try to parse the body if it's a string
        let errorBody = responseData.body;
        if (typeof responseData.body === 'string') {
          try {
            errorBody = JSON.parse(responseData.body);
          } catch (e) {
            console.error("Failed to parse error body:", e);
          }
        }
        
        const message = errorBody?.message || "Signup failed";
        setErrorMessage(message);
        throw new Error(message);
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Signup failed")
      }

      // Store email for verification page immediately
      localStorage.setItem("verificationEmail", formData.email)
      
      // Force immediate navigation - use replace instead of push for more immediate effect
      window.location.href = "/verify";
      return; // Stop execution here
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
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
          <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">Create your account</p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="Dr. John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="doctor@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="••••••••"
          />
          {formData.password && (
            <div className="mt-2 space-y-1">
              <Progress
                value={passwordStrength.score * 20}
                className="h-1"
                indicatorClassName={`bg-current`}
                style={{ color: passwordStrength.color }}
              />
              <p className="text-xs" style={{ color: passwordStrength.color }}>
                {passwordStrength.feedback ||
                  "Password strength: " +
                    (passwordStrength.score >= 4 ? "Strong" : passwordStrength.score >= 3 ? "Good" : "Weak")}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="practice_name" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Practice Name
          </label>
          <Input
            id="practice_name"
            name="practice_name"
            value={formData.practice_name}
            onChange={handleChange}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="ABC Health Care"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone_number" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
            Phone Number
          </label>
          <PhoneInput value={formData.phone_number} onChange={handlePhoneChange} required />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#73a9e9] hover:bg-[#5a9ae6] text-white font-medium text-sm mt-4 rounded-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
        
        {errorMessage && (
          <div className="mt-2 text-center">
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        )}
      </form>

      <div className="pt-2 text-center">
        <p className="text-[#86868b] dark:text-[#a1a1a6] text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-[#73a9e9] hover:text-[#5a9ae6]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
