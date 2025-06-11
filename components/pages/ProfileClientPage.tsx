"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  User2,
  Edit,
  X,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import DoctorLayoutWrapper from "@/app/components/doctor-layout"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import {
  type DoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  createDoctorProfile,
} from "@/lib/doctor-profile-service"
import { DoctorProfileForm } from "@/components/doctor-profile-form"
import { DoctorProfileView } from "@/components/doctor-profile-view"

const MOCK_DOCTOR_ID = "123e4567-e89b-12d3-a456-426614174000"

export default function ProfileClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializePage = async () => {
      if (!isAuthenticated()) {
        router.push("/")
        return
      }

      try {
        try {
          await refreshTokens()
        } catch (error) {
          console.warn("Token refresh failed, continuing in demo mode:", error)
          toast({
            title: "Demo Mode Active",
            description: "Using demo mode due to connection issues with the authentication server.",
          })
        }

        try {
          const response = await getDoctorProfile(MOCK_DOCTOR_ID)
          if (response.data) {
            setDoctorProfile(response.data)
            setHasProfile(true)
          }
        } catch {
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
            about: "Dr. Smith has been practicing family medicine for over 15 years...",
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
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        })
        clearTokens()
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [router, toast])

  const handleLogout = () => {
    clearTokens()
    router.push("/")
  }

  const handleSaveProfile = async (profile: DoctorProfile) => {
    setIsSaving(true)
    try {
      if (hasProfile) {
        await updateDoctorProfile(profile)
        toast({ title: "Profile updated", description: "Profile updated successfully" })
      } else {
        await createDoctorProfile(profile)
        setHasProfile(true)
        toast({ title: "Profile created", description: "Profile created successfully" })
      }
      setDoctorProfile(profile)
      setIsEditing(false)
    } catch (error) {
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]" />
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading profile...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <DoctorLayoutWrapper>
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-[#1d1d1f] dark:text-white">Doctor Profile</h2>
          <div className="flex gap-2">
            {isEditing ? (
              <Button
                variant="outline"
                className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-lg"
                onClick={() => hasProfile ? setIsEditing(false) : router.push("/doctor-dashboard")}
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
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

        {doctorProfile && (isEditing ? (
          <DoctorProfileForm profile={doctorProfile} onSave={handleSaveProfile} isSaving={isSaving} />
        ) : (
          <DoctorProfileView profile={doctorProfile} />
        ))}

        <div className="mt-8 pt-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center">
          <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
            © 2025 Atlas AI • <span className="hover:underline cursor-pointer">Help</span> •
            <span className="hover:underline cursor-pointer"> Terms</span> •
            <span className="hover:underline cursor-pointer"> Privacy</span> •
            <span className="text-[#73a9e9]"> (v1.0.0)</span>
          </p>
        </div>
      </div>
    </DoctorLayoutWrapper>
  )
}
