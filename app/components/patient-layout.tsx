"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import PatientSidebar from "@/app/components/patient-sidebar"
import PatientHeader from "@/app/components/patient-header"

interface PatientLayoutProps {
  children: React.ReactNode
  currentRoute: string
}

export default function PatientLayout({ children, currentRoute }: PatientLayoutProps) {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        <div className="flex">
          {/* Sidebar */}
          <PatientSidebar currentRoute={currentRoute} />
          
          {/* Main content */}
          <div className="flex-1">
            <PatientHeader />
            
            <div className="p-6">
              {children}
              
              {/* Footer */}
              <div className="mt-12 pt-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center">
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                  © 2025 Atlas • <span className="hover:underline cursor-pointer">Help</span> •
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