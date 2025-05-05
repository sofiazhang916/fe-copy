"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, X } from "lucide-react"
import type { DoctorProfile } from "@/lib/doctor-profile-service"
import { PhoneInput } from "@/components/phone-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DoctorProfileFormProps {
  profile: DoctorProfile
  onSave: (profile: DoctorProfile) => void
  isSaving: boolean
}

export function DoctorProfileForm({ profile, onSave, isSaving }: DoctorProfileFormProps) {
  const [formData, setFormData] = useState<DoctorProfile>({
    ...profile,
  })

  // For handling array inputs
  const [newCredential, setNewCredential] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newInsurance, setNewInsurance] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [newService, setNewService] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone_number: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleOnlineConsultationChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, online_consultation: checked }))
  }

  // Array field handlers
  const addArrayItem = (field: keyof DoctorProfile, value: string, setValue: (value: string) => void) => {
    if (!value.trim()) return

    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }))
    setValue("")
  }

  const removeArrayItem = (field: keyof DoctorProfile, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Full Name</Label>
                <Input
                  id="doctor_name"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  required
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
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
                  required
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
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
                  required
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="dr.smith@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <PhoneInput value={formData.phone_number} onChange={handlePhoneChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
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
                  required
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="1234567890"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="3480 Granada Avenue, Santa Clara, California 95051"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                  className="min-h-[120px] bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 py-3 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Dr. Smith has been practicing family medicine for over 15 years..."
                />
              </div>

              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="online_consultation"
                    checked={formData.online_consultation}
                    onCheckedChange={handleOnlineConsultationChange}
                  />
                  <Label htmlFor="online_consultation">Available for Online Consultation</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Credentials</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.credentials.map((credential, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{credential}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("credentials", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newCredential}
                  onChange={(e) => setNewCredential(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add credential (e.g., MD, PhD)"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("credentials", newCredential, setNewCredential)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Titles */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Professional Titles</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.professional_title.map((title, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{title}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("professional_title", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add professional title"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("professional_title", newTitle, setNewTitle)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Languages Spoken</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.languages_spoken.map((language, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{language}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("languages_spoken", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add language"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("languages_spoken", newLanguage, setNewLanguage)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Providers */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Insurance Providers</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.insurance_providers.map((insurance, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{insurance}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("insurance_providers", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newInsurance}
                  onChange={(e) => setNewInsurance(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add insurance provider"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("insurance_providers", newInsurance, setNewInsurance)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fields of Expertise */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Fields of Expertise</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.fields_of_expertise.map((expertise, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{expertise}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("fields_of_expertise", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add field of expertise"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("fields_of_expertise", newExpertise, setNewExpertise)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Provided */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Services Provided</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.services_provided.map((service, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("services_provided", index)}
                      className="text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] rounded-lg px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  placeholder="Add service provided"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem("services_provided", newService, setNewService)}
                  className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-11 px-6 text-sm font-medium"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
