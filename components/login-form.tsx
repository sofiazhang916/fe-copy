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
import { storeTokens } from "@/lib/token-service"
import { hashPassword } from "@/lib/password-utils"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Hash password before sending to API
      const hashedPassword = hashPassword(password)

      console.log("Calling login API with:", { email, password: "[HASHED]" })

      const response = await fetch("https://8qgxh9alt4.execute-api.us-west-1.amazonaws.com/dev/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          credentials: {
            email,
            password: hashedPassword,
          },
        }),
      })

      console.log("Login API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login API error:", errorData)
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      console.log("Login successful, received tokens")

      // Store tokens in localStorage
      storeTokens(data.access_token, data.refresh_token, data.id_token)

      // Store email for token refresh
      localStorage.setItem("userEmail", email)

      toast({
        title: "Login successful",
        description: "Welcome back to your dashboard",
      })

      // For now, we'll redirect to the dashboard
      // In a real app, we would check the user role
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
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
          <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">Access your medical dashboard</p>
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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#1d1d1f] dark:text-white">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-[#73a9e9] hover:text-[#5a9ae6]">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#73a9e9] hover:bg-[#5a9ae6] text-white font-medium text-sm mt-4 rounded-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="pt-2 text-center">
        <p className="text-[#86868b] dark:text-[#a1a1a6] text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#73a9e9] hover:text-[#5a9ae6]">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
