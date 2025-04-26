"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const countryCodes = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸/🇨🇦" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
]

export function PhoneInput({ value, onChange, required = false }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Extract phone number from full value on initial render
  React.useEffect(() => {
    if (value) {
      // Try to match a country code
      const matchedCode = countryCodes.find((c) => value.startsWith(c.code))
      if (matchedCode) {
        setCountryCode(matchedCode.code)
        setPhoneNumber(value.substring(matchedCode.code.length))
      } else {
        // Default to just setting the phone number
        setPhoneNumber(value)
      }
    }
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value
    setPhoneNumber(newPhoneNumber)
    onChange(`${countryCode}${newPhoneNumber}`)
  }

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode)
    onChange(`${newCode}${phoneNumber}`)
  }

  return (
    <div className="flex">
      <Select value={countryCode} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-[110px] h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-l-lg px-3 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm">
          <SelectValue placeholder="+1" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span>
                {country.flag} {country.code}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        required={required}
        className="h-11 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-0 rounded-r-lg rounded-l-none px-4 text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9] text-sm"
        placeholder="2135514478"
      />
    </div>
  )
}
