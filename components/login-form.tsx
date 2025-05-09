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

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      console.log("Calling login API with:", { email, password: "[REDACTED]" })

      const response = await fetch("https://8qgxh9alt4.execute-api.us-west-1.amazonaws.com/dev/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          credentials: {
            email,
            password: password, // Send plain password
          },
        }),
      })

      console.log("Login API response status:", response.status)

      const data = await response.json()
      console.log("Login API response data:", JSON.stringify(data))
      
      // If we get a 200 response, consider it a success and redirect
      if (response.status === 200) {
        console.log("Login successful, attempting to extract tokens")
        
        try {
          // Try to extract tokens if they exist
          if (data.body && data.body.tokens) {
            const { access_token, refresh_token, id_token } = data.body.tokens;
            
            if (access_token && refresh_token && id_token) {
              // Debug the actual tokens we're getting
              console.log("[LOGIN] Received tokens from API:", {
                access_token_exists: !!access_token,
                refresh_token_exists: !!refresh_token,
                id_token_exists: !!id_token
              });
              
              // Store tokens in localStorage and cookies
              storeTokens(access_token, refresh_token, id_token);
              console.log("Tokens stored successfully");
              
              // Extra verification to confirm tokens are stored correctly
              console.log("Verification - tokens stored properly:", {
                accessToken: !!localStorage.getItem("accessToken"),
                refreshToken: !!localStorage.getItem("refreshToken"),
                idToken: !!localStorage.getItem("idToken"),
                cookieToken: document.cookie.includes("accessToken")
              });
              
              // Set cookie directly as a failsafe - IMPORTANT: Use "accessToken" (camelCase) to match middleware expectations
              const setCookie = (name: string, value: string, days: number = 1) => {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                const expires = "; expires=" + date.toUTCString();
                document.cookie = name + "=" + (value || "") + expires + "; path=/";
              };
              
              // Explicitly use the camelCase name for the cookie to match middleware checks
              setCookie("accessToken", access_token);
              // Double verify cookie exists
              console.log("Cookie verification:", {
                cookieExists: document.cookie.includes("accessToken"),
                cookieValue: document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))
              });
            } else {
              console.error("Missing one or more tokens in response")
            }
          } else {
            console.error("Tokens not found in expected structure:", JSON.stringify(data))
          }
          
          // Store email for token refresh regardless
          localStorage.setItem("userEmail", email)
          
          // Show success toast
          toast({
            title: "Login successful",
            description: "Welcome back to your dashboard",
          })
          
          console.log("Redirecting to dashboard...")
          
          // Use multiple redirection methods for redundancy with longer delay
          setTimeout(() => {
            console.log("Executing redirect now")
            try {
              // For maximum reliability, use a hard redirect with window.location.href
              // This ensures a full page load and proper middleware evaluation
              window.location.href = "/dashboard";
            } catch (e) {
              console.error("Redirect failed:", e)
              // Fallback to router.push
              router.push("/dashboard")
            }
          }, 1500)
          
          return
        } catch (error) {
          console.error("Error processing successful login:", error)
          // Continue with redirect anyway
          window.location.href = "/dashboard"
          return
        }
      }

      // Only check for errors if we didn't already decide to redirect
      // Check if the response contains an error message
      if (data.statusCode === 400 || (data.body && typeof data.body === 'string' && data.body.includes('error'))) {
        // Try to parse the body if it's a string
        let errorBody = data.body;
        if (typeof data.body === 'string') {
          try {
            errorBody = JSON.parse(data.body);
          } catch (e) {
            console.error("Failed to parse error body:", e);
          }
        }
        
        const message = errorBody?.message || "Login failed";
        setErrorMessage(message);
        throw new Error(message);
      }

      if (!response.ok) {
        console.error("Login API error:", data)
        throw new Error(data.message || "Login failed")
      }

      throw new Error("Login failed: Invalid response format")
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
        
        {errorMessage && (
          <div className="mt-2 text-center">
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        )}
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
