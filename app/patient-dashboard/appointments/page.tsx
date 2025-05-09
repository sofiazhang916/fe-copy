"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import PatientLayout from "@/app/components/patient-layout";

export default function AppointmentsPage() {
  const pastAppointments = [
    {
      id: 1,
      type: "Annual Physical",
      date: "14/03/2025",
      time: "9:00 AM",
      doctor: {
        name: "Dr. Sarah Johnson",
        image: "/doctor-sarah.jpg",
        practice: "Boston Internal Medicine"
      },
      location: {
        specialty: "Internal Medicine, Primary Care",
        address: "123 Medical Plaza, Boston, MA 02114"
      },
      status: "scheduled"
    },
    {
      id: 2,
      type: "Cardiology Consultation",
      date: "27/02/2025",
      time: "2:00 PM",
      doctor: {
        name: "Dr. Emily Rodriguez",
        image: "/doctor-emily.jpg",
        practice: "Cardiovascular Specialists"
      },
      location: {
        specialty: "Cardiology, Internal Medicine",
        address: "789 Cardiovascular Lane, Boston, MA 02115"
      },
      status: "completed"
    }
  ];

  return (
    <PatientLayout currentRoute="/patient-dashboard/appointments">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">Upcoming</h2>
          <div className="text-center text-[#86868b] dark:text-[#a1a1a6]">
            No upcoming appointments scheduled.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Past Appointments</h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 bg-white dark:bg-[#2c2c2e] border-0 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{appointment.type}</h3>
                  <Badge variant={appointment.status === "completed" ? "secondary" : "outline"} 
                    className={`${
                      appointment.status === "completed" 
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
                        : "bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400"
                    }`}>
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row">
                  <div className="flex items-center md:w-1/2 mb-4 md:mb-0">
                    <div className="mr-4">
                      <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={appointment.doctor.image}
                          alt={appointment.doctor.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${appointment.doctor.name.replace("Dr. ", "")}&background=73a9e9&color=fff`;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{appointment.doctor.name}</h4>
                      <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">{appointment.doctor.practice}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-[#73a9e9]" />
                      <span>{appointment.date} {appointment.time}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{appointment.location.specialty}</p>
                      <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">{appointment.location.address}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PatientLayout>
  );
}
