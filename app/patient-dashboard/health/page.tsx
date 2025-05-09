"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Trophy, 
  Calendar, 
  Heart, 
  Flame, 
  Clock, 
  FileText, 
  Pill, 
  Activity,
  Info,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PatientLayout from "@/app/components/patient-layout";

export default function HealthProfilePage() {
  return (
    <PatientLayout currentRoute="/patient-dashboard/health">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">My Health Profile</h1>
        <p className="text-center text-[#86868b] dark:text-[#a1a1a6] mb-8">
          Track and manage your complete health information
        </p>

        {/* Profile banner */}
        <div className="bg-purple-600 dark:bg-purple-800 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-purple-500/40 rounded-xl p-4 flex items-center justify-center">
              <User className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <div className="md:flex justify-between items-start">
                <div>
                  <p className="text-xl">Welcome back</p>
                  <div className="flex gap-3 mt-1">
                    <span className="bg-purple-500/40 text-white text-sm px-3 py-1 rounded-full">
                      Level 3
                    </span>
                    <span className="text-sm py-1">320 XP</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Profile Completeness</span>
                    <span className="text-sm">0%</span>
                  </div>
                  <Progress value={0} className="h-2 bg-purple-500/40" />
                  <p className="text-xs mt-2">Last updated: 09/05/2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center p-4 bg-white dark:bg-[#2c2c2e] border-0 shadow-sm">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg mr-4">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Health Score</p>
              <p className="text-2xl font-bold">85/100</p>
            </div>
          </Card>
          
          <Card className="flex items-center p-4 bg-white dark:bg-[#2c2c2e] border-0 shadow-sm">
            <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-3 rounded-lg mr-4">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Streak</p>
              <p className="text-2xl font-bold">12 days</p>
            </div>
          </Card>
          
          <Card className="flex items-center p-4 bg-white dark:bg-[#2c2c2e] border-0 shadow-sm">
            <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Next Checkup</p>
              <p className="text-2xl font-bold">14 days</p>
            </div>
          </Card>
        </div>

        {/* Tabs and content */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button className="flex items-center gap-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] py-2 px-4 rounded-lg text-[#73a9e9] font-medium min-w-max">
            <User className="h-4 w-4" />
            Basic Info
          </button>
          <button className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6] py-2 px-4 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] min-w-max">
            <FileText className="h-4 w-4" />
            Medical History
          </button>
          <button className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6] py-2 px-4 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] min-w-max">
            <Pill className="h-4 w-4" />
            Medications
          </button>
          <button className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6] py-2 px-4 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] min-w-max">
            <Activity className="h-4 w-4" />
            Wellness
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form section - takes up 2/3 on desktop */}
          <div className="md:col-span-2">
            <Card className="bg-white dark:bg-[#2c2c2e] border-0 shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
              <p className="text-[#86868b] dark:text-[#a1a1a6] text-sm mb-6">
                Update your personal and contact details
              </p>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-center">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <div className="relative">
                      <Input placeholder="dd/mm/yyyy" />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <Select>
                      <SelectTrigger>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Preferred Language</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="English" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <Input placeholder="e.g., 5'10&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight</label>
                    <Input placeholder="e.g., 160 lbs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <Input placeholder="your.email@example.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Preferred Communication</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Email" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Name</label>
                    <Input placeholder="Emergency contact name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white px-8">
                    Save Information
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Achievements */}
            <Card className="bg-white dark:bg-[#2c2c2e] border-0 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-[#73a9e9]" />
                <h3 className="text-lg font-medium">Achievements</h3>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Profile Champion</p>
                    <p className="font-semibold text-lg">Level 2</p>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                      Complete your profile to unlock new badges
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                    <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Health Streak</p>
                    <p className="font-semibold text-lg">12 Days</p>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                      Log health data consistently to maintain your streak
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-lg">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Doctor Visits</p>
                    <p className="font-semibold text-lg">3 Completed</p>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                      Stay on top of your scheduled appointments
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button variant="ghost" className="text-[#73a9e9]">
                  View All Achievements
                </Button>
              </div>
            </Card>

            {/* Health Tips */}
            <Card className="bg-white dark:bg-[#2c2c2e] border-0 shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4 text-center">Health Tips</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-full">
                    <Info className="h-4 w-4 text-[#73a9e9]" />
                  </div>
                  <p className="text-sm">
                    Complete your allergies section to help doctors provide safer care.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-full">
                    <Info className="h-4 w-4 text-[#73a9e9]" />
                  </div>
                  <p className="text-sm">
                    Your annual wellness visit is due in 14 days. Schedule it now for better availability.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-full">
                    <Info className="h-4 w-4 text-[#73a9e9]" />
                  </div>
                  <p className="text-sm">
                    Track your blood pressure regularly to monitor your cardiovascular health.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
