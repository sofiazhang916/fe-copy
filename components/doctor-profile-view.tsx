"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { DoctorProfile } from "@/lib/doctor-profile-service"
import { Check, MapPin, Phone, Mail, User, Award, Stethoscope, Languages, Shield, FileText } from "lucide-react"

interface DoctorProfileViewProps {
  profile: DoctorProfile
}

export function DoctorProfileView({ profile }: DoctorProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-full bg-[#f5f5f7] dark:bg-[#3a3a3c] flex items-center justify-center">
              <User className="h-16 w-16 text-[#86868b] dark:text-[#a1a1a6]" />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-medium text-[#1d1d1f] dark:text-white">{profile.doctor_name}</h3>
              <p className="text-[#86868b] dark:text-[#a1a1a6] mt-1">{profile.professional_title.join(", ")}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-white">
                  <MapPin className="h-4 w-4 text-[#73a9e9]" />
                  <span>{profile.address}</span>
                </div>

                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-white">
                  <Phone className="h-4 w-4 text-[#73a9e9]" />
                  <span>{profile.phone_number}</span>
                </div>

                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-white">
                  <Mail className="h-4 w-4 text-[#73a9e9]" />
                  <span>{profile.email}</span>
                </div>
              </div>

              {profile.online_consultation && (
                <div className="mt-4 inline-flex items-center gap-2 bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 text-[#73a9e9] px-3 py-1 rounded-full">
                  <Check className="h-4 w-4" />
                  <span>Available for Online Consultation</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">About</h3>
          <p className="text-[#1d1d1f] dark:text-white">{profile.about}</p>
        </CardContent>
      </Card>

      {/* Practice Information */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-[#1d1d1f] dark:text-white">Practice Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] mb-2">Practice Name</h4>
              <p className="text-[#1d1d1f] dark:text-white">{profile.doctor_practice_name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] mb-2">NPI Number</h4>
              <p className="text-[#1d1d1f] dark:text-white">{profile.npi_number}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] mb-2">Gender</h4>
              <p className="text-[#1d1d1f] dark:text-white capitalize">{profile.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials and Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credentials */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-[#73a9e9]" />
              <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Credentials</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.credentials.map((credential, index) => (
                <div
                  key={index}
                  className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full"
                >
                  {credential}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="h-5 w-5 text-[#73a9e9]" />
              <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Languages Spoken</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.languages_spoken.map((language, index) => (
                <div
                  key={index}
                  className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full"
                >
                  {language}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fields of Expertise */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-[#73a9e9]" />
            <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Fields of Expertise</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.fields_of_expertise.map((expertise, index) => (
              <div
                key={index}
                className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full"
              >
                {expertise}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Provided */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-[#73a9e9]" />
            <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Services Provided</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.services_provided.map((service, index) => (
              <div
                key={index}
                className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full"
              >
                {service}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Providers */}
      <Card className="bg-white dark:bg-[#2c2c2e] shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-[#73a9e9]" />
            <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Insurance Providers</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.insurance_providers.map((insurance, index) => (
              <div
                key={index}
                className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full"
              >
                {insurance}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
