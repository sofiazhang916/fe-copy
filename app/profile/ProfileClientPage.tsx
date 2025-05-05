"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Calendar, MessageSquare, FlaskRoundIcon as Flask, User, Edit, X } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import {
  type DoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  createDoctorProfile,
} from "@/lib/doctor-profile-service"
import { DoctorProfileForm } from "@/components/doctor-profile-form"
import { DoctorProfileView } from "@/components/doctor-profile-view"

// Mock doctor ID - in a real app, this would come from authentication
const MOCK_DOCTOR_ID = "123e4567-e89b-12d3-a456-426614174000"

export default function ProfileClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializePage = async () => {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.push("/")
        return
      }

      try {
        // Refresh tokens on page load
        try {
          await refreshTokens()
        } catch (error) {
          console.warn("Token refresh failed, continuing in demo mode:", error)

          // Show toast about demo mode
          toast({
            title: "Demo Mode Active",
            description: "Using demo mode due to connection issues with the authentication server.",
          })
        }

        // Fetch doctor profile
        try {
          const response = await getDoctorProfile(MOCK_DOCTOR_ID)
          if (response.data) {
            setDoctorProfile(response.data)
            setHasProfile(true)
          }
        } catch (error) {
          console.error("Failed to fetch doctor profile:", error)

          // If we're in demo mode or the profile doesn't exist, create a mock profile
          toast({
            title: "Demo Profile",
            description: "Using a demo profile for testing purposes.",
          })

          // Create a mock profile for demo purposes
          setHasProfile(false)
          setIsEditing(true)
          setDoctorProfile({
            doctor_id: MOCK_DOCTOR_ID,
            doctor_name: "Dr. Jane Smith",
            doctor_practice_name: "Smith Family Medicine",
            email: "dr.smith@example.com",
            phone_number: "+14155552671",
            address: "3480 Granada Avenue, Santa Clara, California 95051",
            credentials: ["MD", "Board Certified in Family Medicine"],
            professional_title: ["Family Physician", "Primary Care Doctor"],
            about:
              "Dr. Smith has been practicing family medicine for over 15 years, providing comprehensive care to patients of all ages. She is dedicated to preventive care and chronic disease management.",
            gender: "female",
            languages_spoken: ["English", "Spanish"],
            npi_number: "1234567890",
            insurance_providers: ["Blue Cross", "Aetna", "Medicare"],
            fields_of_expertise: ["Family Medicine", "Preventive Care"],
            services_provided: ["Annual Check-ups", "Vaccinations", "Chronic Disease Management"],
            online_consultation: true,
          })
        }
      } catch (error) {
        console.error("Failed to initialize page:", error)

        // Check if we're in a demo environment
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.includes("vercel.app")
        ) {
          toast({
            title: "Demo Mode Active",
            description: "Using demo mode due to connection issues with the authentication server.",
          })
        } else {
          toast({
            title: "Session expired",
            description: "Please log in again",
            variant: "destructive",
          })
          clearTokens()
          router.push("/")
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [router, toast])

  const handleLogout = () => {
    // Clear all tokens
    clearTokens()
    router.push("/")
  }

  const handleSaveProfile = async (profile: DoctorProfile) => {
    setIsSaving(true)
    try {
      if (hasProfile) {
        // Update existing profile
        await updateDoctorProfile(profile)
        toast({
          title: "Profile updated",
          description: "Your doctor profile has been updated successfully",
        })
      } else {
        // Create new profile
        await createDoctorProfile(profile)
        setHasProfile(true)
        toast({
          title: "Profile created",
          description: "Your doctor profile has been created successfully",
        })
      }
      setDoctorProfile(profile)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast({
        title: "Failed to save profile",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading profile...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        {showDemoNotice && (
          <div className="w-full bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 py-3 px-6 flex justify-between items-center">
            <p className="text-sm text-[#1d1d1f] dark:text-white">
              This is a demo environment of Atlas AI. We've pre-populated the platform with Mock Data to comply with
              HIPAA and privacy standards. To see the full functionality, connect with the team.
            </p>
            <Button
              className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium"
              onClick={() => setShowDemoNotice(false)}
            >
              DISMISS
            </Button>
          </div>
        )}

        <div className="flex">
          {/* Sidebar */}
          <div className="w-16 min-h-screen bg-white dark:bg-[#2c2c2e] border-r border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col items-center py-6 gap-8">
            <div className="flex flex-col items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                onClick={() => router.push("/scheduling")}
              >
                <Calendar className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                onClick={() => router.push("/patients")}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                onClick={() => router.push("/messages")}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-10 w-10 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
              >
                <Flask className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <header className="flex justify-between items-center px-6 py-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
              <h1 className="text-2xl font-medium text-[#1d1d1f] dark:text-white">Atlas AI</h1>
              <div className="flex gap-4 items-center">
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  className="bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-9 px-4 text-sm font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </div>
            </header>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-[#1d1d1f] dark:text-white">Doctor Profile</h2>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-lg"
                        onClick={() => {
                          if (hasProfile) {
                            setIsEditing(false)
                          } else {
                            router.push("/dashboard")
                          }
                        }}
                        disabled={isSaving}
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-9 px-4 text-sm font-medium"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {doctorProfile && (
                <>
                  {isEditing ? (
                    <DoctorProfileForm profile={doctorProfile} onSave={handleSaveProfile} isSaving={isSaving} />
                  ) : (
                    <DoctorProfileView profile={doctorProfile} />
                  )}
                </>
              )}

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center">
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                  © 2025 Atlas AI • <span className="hover:underline cursor-pointer">Help</span> •
                  <span className="hover:underline cursor-pointer"> Terms</span> •
                  <span className="hover:underline cursor-pointer"> Privacy</span> •
                  <span className="text-[#73a9e9]"> (v1.0.0)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
