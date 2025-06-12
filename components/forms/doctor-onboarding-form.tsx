"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, PlusCircle, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PhoneInput } from "@/components/phone-input"
import { getTokens, isAuthenticated } from "@/lib/token-service"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function DoctorOnboardingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isProfileLoaded, setIsProfileLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [newCredential, setNewCredential] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newInsurance, setNewInsurance] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [newService, setNewService] = useState("")
  const [newTitle, setNewTitle] = useState("")
  
  const [formData, setFormData] = useState({
    doctor_id: "",
    doctor_name: "",
    doctor_practice_name: "",
    email: "",
    phone_number: "+1",
    address: "",
    credentials: [] as string[],
    professional_title: [] as string[],
    about: "",
    gender: "",
    languages_spoken: [] as string[],
    npi_number: "",
    insurance_providers: [] as string[],
    fields_of_expertise: [] as string[],
    services_provided: [] as string[],
    online_consultation: true,
    profile_picture: null
  })
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true)
      
      // Check if user is logged in
      if (!isAuthenticated()) {
        toast({
          title: "Not authenticated",
          description: "Please log in first",
          variant: "destructive",
        })
        router.push("/")
        return
      }
      
      try {
        // Get user's access token
        const { accessToken } = getTokens()
        if (!accessToken) {
          throw new Error("No access token found")
        }
        
        // Try to fetch existing profile
        const response = await fetch("http://127.0.0.1:3008/registration_api/v1/doctor/view-profile/123e4567-e89b-12d3-a456-426614174000", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            // Pre-fill form with existing data
            setFormData(prevData => ({
              ...prevData,
              ...result.data
            }))
            setIsProfileLoaded(true)
            toast({
              title: "Profile loaded",
              description: "Your existing profile data has been loaded",
            })
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        // If this fails, we'll just start with an empty form
      } finally {
        setIsLoading(false)
      }
    }
    
    initializePage()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone_number: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, online_consultation: checked }))
  }

  const addItem = (field: keyof typeof formData, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return
    
    if (Array.isArray(formData[field])) {
      // Check for duplicates
      if (!(formData[field] as string[]).includes(value)) {
        setFormData(prev => ({
          ...prev,
          [field]: [...(prev[field] as string[]), value.trim()]
        }))
      }
    }
    
    // Clear the input
    setter("")
  }

  const removeItem = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }))
    }
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.doctor_name.trim()) {
      setErrorMessage("Please enter your name")
      return false
    }
    
    if (!formData.doctor_practice_name.trim()) {
      setErrorMessage("Please enter your practice name")
      return false
    }
    
    if (!formData.phone_number || formData.phone_number === "+1") {
      setErrorMessage("Please enter your phone number")
      return false
    }
    
    if (!formData.address.trim()) {
      setErrorMessage("Please enter your address")
      return false
    }
    
    if (formData.credentials.length === 0) {
      setErrorMessage("Please add at least one credential")
      return false
    }
    
    if (!formData.about.trim()) {
      setErrorMessage("Please enter information about yourself")
      return false
    }
    
    if (!formData.npi_number.trim()) {
      setErrorMessage("Please enter your NPI number")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    
    if (!validateForm()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Get user's access token
      const { accessToken } = getTokens()
      if (!accessToken) {
        throw new Error("No access token found")
      }
      
      // Set a fake doctor_id for now since we're using a mock API
      if (!formData.doctor_id) {
        setFormData(prev => ({
          ...prev,
          doctor_id: "123e4567-e89b-12d3-a456-426614174000"
        }))
      }
      
      const endpoint = isProfileLoaded 
        ? "http://127.0.0.1:3008/registration_api/v1/doctor/update-profile"
        : "http://127.0.0.1:3008/registration_api/v1/doctor/register-profile"
      
      const method = isProfileLoaded ? "PATCH" : "POST"
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save profile")
      }
      
      const result = await response.json()
      
      toast({
        title: isProfileLoaded ? "Profile updated" : "Profile created",
        description: result.message || "Your profile has been saved successfully",
      })
      
      // Navigate to the dashboard or another page
      router.push("/doctor-dashboard")
    } catch (error) {
      console.error("Error saving profile:", error)
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while saving your profile")
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 bg-white dark:bg-[#1d1d1f] p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#73a9e9] mx-auto" />
          <p className="mt-4 text-[#1d1d1f] dark:text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-white dark:bg-[#1d1d1f] p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => router.push("/onboarding")} 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full text-[#1d1d1f] dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-[#1d1d1f] dark:text-white">
              {isProfileLoaded ? "Update Your Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1 text-sm">
              {isProfileLoaded ? "Update your doctor information" : "Fill in your doctor information to get started"}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Basic Information</h2>
            
            <div className="space-y-2">
              <Label htmlFor="doctor_name">Full Name</Label>
              <Input
                id="doctor_name"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                placeholder="Dr. Jane Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor_practice_name">Practice Name</Label>
              <Input
                id="doctor_practice_name"
                name="doctor_practice_name"
                value={formData.doctor_practice_name}
                onChange={handleChange}
                className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                placeholder="Smith Family Medicine"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f]/60 dark:text-white/60"
                placeholder="dr.smith@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <PhoneInput 
                value={formData.phone_number} 
                onChange={handlePhoneChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                placeholder="3480 Granada Avenue, Santa Clara, CA 95051"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange(value, "gender")} defaultValue={formData.gender}>
                <SelectTrigger className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="npi_number">NPI Number</Label>
              <Input
                id="npi_number"
                name="npi_number"
                value={formData.npi_number}
                onChange={handleChange}
                className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                placeholder="1234567890"
              />
            </div>
          </div>
          
          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Professional Information</h2>
            
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="min-h-32 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 py-3 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                placeholder="Tell us about your experience and background"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Credentials</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.credentials.map((credential, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {credential}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("credentials", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCredential}
                  onChange={(e) => setNewCredential(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="MD, Board Certified, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("credentials", newCredential, setNewCredential)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Professional Titles</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.professional_title.map((title, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {title}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("professional_title", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Family Physician, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("professional_title", newTitle, setNewTitle)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Languages Spoken</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages_spoken.map((language, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {language}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("languages_spoken", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="English, Spanish, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("languages_spoken", newLanguage, setNewLanguage)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="grid grid-cols-1 gap-6 pt-4">
          <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Insurance Providers</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.insurance_providers.map((insurance, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {insurance}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("insurance_providers", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newInsurance}
                  onChange={(e) => setNewInsurance(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Blue Cross, Aetna, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("insurance_providers", newInsurance, setNewInsurance)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Fields of Expertise</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.fields_of_expertise.map((expertise, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {expertise}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("fields_of_expertise", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Family Medicine, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("fields_of_expertise", newExpertise, setNewExpertise)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Services Provided</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.services_provided.map((service, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {service}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeItem("services_provided", index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="h-10 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Annual Check-ups, etc."
                />
                <Button 
                  type="button" 
                  size="sm" 
                  className="h-10 bg-[#73a9e9] hover:bg-[#5a9ae6]" 
                  onClick={() => addItem("services_provided", newService, setNewService)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="online_consultation" className="mb-2 block">Online Consultation</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="online_consultation" 
                  checked={formData.online_consultation} 
                  onCheckedChange={handleSwitchChange} 
                />
                <Label htmlFor="online_consultation">
                  {formData.online_consultation ? "Available for online consultations" : "Not available for online consultations"}
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {errorMessage && (
          <div className="mt-2">
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="h-11 bg-[#73a9e9] hover:bg-[#5a9ae6] text-white font-medium px-8 rounded-lg transition-all"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              isProfileLoaded ? "Update Profile" : "Complete Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 