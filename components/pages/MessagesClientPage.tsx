"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  Calendar,
  MessageSquare,
  FlaskRoundIcon as Flask,
  User,
  Search,
  Send,
  User2,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import DoctorLayoutWrapper from "@/app/components/doctor-layout"

// Mock conversation data
const conversations = [
  {
    id: 1,
    patient: {
      name: "Emily Rodriguez",
      initials: "ER",
    },
    messages: [
      {
        id: 1,
        text: "Hello Dr. Williams, I've been experiencing increased fatigue lately.",
        sender: "patient",
        timestamp: "Yesterday, 2:30 PM",
      },
      {
        id: 2,
        text: "Could this be related to the new medication?",
        sender: "patient",
        timestamp: "Yesterday, 2:31 PM",
      },
      {
        id: 3,
        text: "Hi Emily, fatigue can be a side effect of the medication. Let's monitor this for a few days. Make sure you're staying hydrated and getting enough rest.",
        sender: "doctor",
        timestamp: "Yesterday, 3:15 PM",
      },
      {
        id: 4,
        text: "If the fatigue doesn't improve by the end of the week, please let me know and we might adjust your dosage.",
        sender: "doctor",
        timestamp: "Yesterday, 3:16 PM",
      },
    ],
    preview: "I had a great experience at the clinic. The staff was friendly ...",
  },
  {
    id: 2,
    patient: {
      name: "James Wilson",
      initials: "JW",
    },
    messages: [],
    preview: "When should I come back for my next appointment?",
  },
  {
    id: 3,
    patient: {
      name: "Maria Garcia",
      initials: "MG",
    },
    messages: [],
    preview: "When should I take my medicine?",
  },
  {
    id: 4,
    patient: {
      name: "Robert Chen",
      initials: "RC",
    },
    messages: [],
    preview: "I'll try to follow the diet plan you gave me. Thank you!",
  },
]

export default function MessagesClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showDemoNotice, setShowDemoNotice] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializePage = async () => {
      if (!isAuthenticated()) {
        router.push("/")
        return
      }
      try {
        await refreshTokens()
      } catch (error) {
        toast({ title: "Session expired", description: "Please log in again", variant: "destructive" })
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

  const navigateTo = (path: string) => router.push(path)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    toast({ title: "Message sent", description: "Your message has been sent to the patient." })
    setNewMessage("")
  }

  const handleSelectTemplate = (templateNumber: number) => {
    const templates = [
      "How are you feeling today?",
      "Please let me know if you have any questions about your medication.",
      "Remember to take your medication as prescribed.",
      "Would you like to schedule a follow-up appointment?",
      "Please update me on your symptoms.",
    ]
    setNewMessage(templates[templateNumber - 1] || "")
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading messages...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <DoctorLayoutWrapper activePage="messages">
      {/* Main content */}
      <div className="flex-1">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-2 text-[#1d1d1f] dark:text-white">Patient Engagement</h2>
          <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-6">
            Connect with patients through secure messaging, educational content, targeted outreach campaigns, and
            feedback management.
          </p>

          <div className="flex h-[calc(100vh-240px)]">
            {/* Patient list */}
            <div className="w-1/3 bg-white dark:bg-[#2c2c2e] rounded-l-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] border-r-0 overflow-hidden">
              <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                <h3 className="text-lg font-medium mb-2">Patients</h3>
                <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-4">Your recent patient conversations</p>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-130px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] cursor-pointer hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] ${selectedConversation.id === conversation.id ? "bg-[#f5f5f7] dark:bg-[#3a3a3c]" : ""
                      }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e5e5ea] dark:bg-[#3a3a3c] flex items-center justify-center text-[#1d1d1f] dark:text-white font-medium">
                        {conversation.patient.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#1d1d1f] dark:text-white truncate">
                          {conversation.patient.name}
                        </h4>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] truncate">
                          {conversation.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c]">
                <Button className="w-full bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-10">
                  NEW CONVERSATION
                </Button>
              </div>
            </div>

            {/* Conversation */}
            <div className="w-2/3 bg-white dark:bg-[#2c2c2e] rounded-r-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col">
              {/* Conversation header */}
              <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e5e5ea] dark:bg-[#3a3a3c] flex items-center justify-center text-[#1d1d1f] dark:text-white font-medium">
                  {selectedConversation.patient.initials}
                </div>
                <div>
                  <h4 className="font-medium text-[#1d1d1f] dark:text-white">
                    {selectedConversation.patient.name}
                  </h4>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">Patient</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 max-w-[80%] ${message.sender === "doctor" ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`p-3 rounded-lg ${message.sender === "doctor"
                        ? "bg-[#73a9e9] text-white"
                        : "bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white"
                        }`}
                    >
                      {message.text}
                    </div>
                    <div
                      className={`text-xs mt-1 ${message.sender === "doctor"
                        ? "text-right text-[#86868b] dark:text-[#a1a1a6]"
                        : "text-[#86868b] dark:text-[#a1a1a6]"
                        }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message templates */}
              <div className="p-2 border-t border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md text-xs"
                    onClick={() => handleSelectTemplate(num)}
                  >
                    Template {num}
                  </Button>
                ))}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="h-12 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  className="h-12 w-12 bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

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
    </DoctorLayoutWrapper>
  )
}
