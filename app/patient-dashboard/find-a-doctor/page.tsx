"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PatientLayout from "@/app/components/patient-layout";

export default function FindADoctorPage() {
  return (
    <PatientLayout currentRoute="/patient-dashboard/find-a-doctor">
      <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
      <p className="text-[#86868b] dark:text-[#a1a1a6] mb-8">
        Search for healthcare providers that match your needs and preferences
      </p>

      <div className="bg-white dark:bg-[#2c2c2e] rounded-lg shadow-sm p-6 mb-12">
        <Tabs defaultValue="guided">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="guided">Guided Search</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-6">
            <div className="relative">
              <Input 
                placeholder="Search by name, specialty, condition, or symptom..." 
                className="w-full py-6 pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What are you looking for?
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="family-medicine">Family Medicine</SelectItem>
                    <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Where are you located?
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="oakland">Oakland, CA</SelectItem>
                    <SelectItem value="san-mateo">San Mateo, CA</SelectItem>
                    <SelectItem value="palo-alto">Palo Alto, CA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Insurance Provider
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Insurance</SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="blue-cross">Blue Cross</SelectItem>
                    <SelectItem value="cigna">Cigna</SelectItem>
                    <SelectItem value="kaiser">Kaiser</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Show Sample Providers
              </Button>
              <Button className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg px-4 text-sm font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Providers
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="p-4 text-center text-[#86868b] dark:text-[#a1a1a6]">
              Advanced filtering options will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8">Popular Specialties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Cardiology",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#73a9e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              ),
            },
            {
              name: "Family Medicine",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#73a9e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              ),
            },
            {
              name: "Internal Medicine",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#73a9e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              name: "Endocrinology",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#73a9e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              ),
            },
          ].map((specialty, index) => (
            <Card key={index} className="flex flex-col items-center p-6 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-[#2c2c2e] border-0">
              <div className="bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 rounded-full p-4 mb-4">
                {specialty.icon}
              </div>
              <h3 className="font-semibold mb-2">{specialty.name}</h3>
              <p className="text-sm text-[#73a9e9]">Find specialists</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">Nearby Locations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "San Francisco, CA",
            "Oakland, CA",
            "San Mateo, CA",
            "Palo Alto, CA",
          ].map((location, index) => (
            <Card key={index} className="flex flex-col items-center p-6 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-[#2c2c2e] border-0">
              <div className="bg-[#73a9e9]/10 dark:bg-[#73a9e9]/5 rounded-full p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#73a9e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{location}</h3>
              <p className="text-sm text-[#73a9e9]">Browse providers</p>
            </Card>
          ))}
        </div>
      </section>
    </PatientLayout>
  );
}
