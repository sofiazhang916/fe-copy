"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import DoctorLayoutWrapper from "@/components/layouts/doctor-layout"
import { ThemeProvider } from "@/components/theme-provider"
import { LogOut, Calendar, MessageSquare, FlaskRoundIcon as Flask, User, Search, Send, Mail, Plus, X, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Define types for our messages and conversations
interface Message {
  id: number;
  text: string;
  sender: "patient" | "doctor";
  timestamp: string;
}

interface Conversation {
  id: number;
  patient: {
    name: string;
    initials: string;
  };
  messages: Message[];
  preview: string;
}

// Mock conversation data with initial empty messages array
const conversations: Conversation[] = [
  {
    id: 1,
    patient: {
      name: "Anirudh",
      initials: "AN",
    },
    messages: [], // Will be populated from API
    preview: "I had a great experience at the clinic. The staff was friendly ...",
  }
];

interface ChatResponse {
  chats: Message[];
}

// Add new interfaces for templates
interface MessageTemplate {
  id: number;
  name: string;
  message: string;
  description: string;
}

export default function MessagesClientPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [chatHistory, setChatHistory] = useState<ChatResponse | null>(null)
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: 1,
      name: "Check-in",
      message: "Hello! How are you feeling today? I'd like to check in on your progress.",
      description: "A friendly check-in message to see how the patient is feeling"
    },
    {
      id: 2,
      name: "Medication Follow-up",
      message: "I wanted to follow up about your medication. Are you experiencing any side effects or have questions about the dosage?",
      description: "Follow-up about medication and potential side effects"
    },
    {
      id: 3,
      name: "Medication Reminder",
      message: "Just a friendly reminder to take your medication as prescribed. Let me know if you need any clarification.",
      description: "A gentle reminder about medication adherence"
    },
    {
      id: 4,
      name: "Schedule Follow-up",
      message: "Would you like to schedule a follow-up appointment? I'm available next week to discuss your treatment plan.",
      description: "An invitation to schedule a follow-up appointment"
    },
    {
      id: 5,
      name: "Symptom Update",
      message: "Could you please update me on your symptoms? This will help me better understand how the treatment is working.",
      description: "A request for symptom updates to monitor treatment progress"
    },
    {
      id: 6,
      name: "Test Results",
      message: "Your recent test results are now available. Would you like to schedule a time to discuss them in detail?",
      description: "Notification about test results availability and discussion request"
    },
    {
      id: 7,
      name: "Lifestyle Check",
      message: "How are you managing with the lifestyle changes we discussed? I'm here to support you and answer any questions you might have.",
      description: "Follow-up on lifestyle modifications and offer support"
    }
  ]);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateMessage, setNewTemplateMessage] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.push("/")
        return
      }

      try {
        // Refresh tokens on page load
        await refreshTokens()
      } catch (error) {
        console.error("Failed to refresh tokens:", error)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch("/api/messages/viewConversation", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Transform the chat data to match our UI format
        const transformedMessages: Message[] = result.chats.map((chat: any, index: number) => ({
          id: index + 1,
          text: chat.body,
          sender: chat.author === 'doctor' ? 'doctor' : 'patient',
          timestamp: chat.date_created,
        }));

        // Get the last message to use as preview
        const lastMessage = transformedMessages[transformedMessages.length - 1];

        // Update the selected conversation with the messages and new preview
        setSelectedConversation(prev => ({
          ...prev,
          messages: transformedMessages,
          preview: lastMessage ? lastMessage.text : prev.preview // Use last message as preview, fallback to existing preview
        }));

        // Update the conversations array to reflect the new preview
        conversations[0] = {
          ...conversations[0],
          messages: transformedMessages,
          preview: lastMessage ? lastMessage.text : conversations[0].preview
        };

        setChatHistory(result);
        console.log("Successfully fetched and transformed chat history:", transformedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast({
          title: "Connection Error",
          description: error instanceof Error ? error.message : "Unable to fetch chat history",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = () => {
    // Clear all tokens
    clearTokens()
    router.push("/")
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages/sendMessage", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_body: newMessage.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Add the new message to the conversation immediately
      const newMessageObj: Message = {
        id: selectedConversation.messages.length + 1,
        text: newMessage.trim(),
        sender: "doctor",
        timestamp: new Date().toLocaleString()
      };

      // Update the conversation with the new message
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessageObj],
        preview: newMessage.trim() // Update preview with the new message
      }));

      // Update the conversations array
      conversations[0] = {
        ...conversations[0],
        messages: [...conversations[0].messages, newMessageObj],
        preview: newMessage.trim()
      };

      // Clear the input field
      setNewMessage("");

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add new function to handle template creation
  const handleCreateTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateMessage.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: MessageTemplate = {
      id: templates.length + 1,
      name: newTemplateName.trim(),
      message: newTemplateMessage.trim(),
      description: newTemplateDescription.trim()
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName("");
    setNewTemplateMessage("");
    setNewTemplateDescription("");
    setIsCreateTemplateOpen(false);

    toast({
      title: "Template created",
      description: "Your new message template has been created successfully",
    });
  };

  // Update handleSelectTemplate to use the new template structure
  const handleSelectTemplate = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewMessage(template.message);
    }
  };

  // Add new function to handle template deletion
  const handleDeleteTemplate = (templateId: number) => {
    setTemplateToDelete(templateId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(template => template.id !== templateToDelete));
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Template deleted",
        description: "The template has been successfully deleted",
      });
    }
  };

  // Add new function to handle template editing
  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setIsEditTemplateOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTemplate) {
      setTemplates(templates.map(template =>
        template.id === editingTemplate.id ? editingTemplate : template
      ));
      setEditingTemplate(null);
      setIsEditTemplateOpen(false);
      toast({
        title: "Template updated",
        description: "The template has been successfully updated",
      });
    }
  };

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

          <div className="flex h-[calc(100vh-180px)]">
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
            <div className="w-2/3 min-w-0 bg-white dark:bg-[#2c2c2e] rounded-r-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col overflow-hidden">
              {/* Conversation header */}
              <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] flex items-center gap-3 flex-shrink-0">
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
              <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                {selectedConversation.messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`mb-4 max-w-[80%] ${message.sender === "doctor" ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`p-3 rounded-lg break-words ${message.sender === "doctor"
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
              <div className="p-2 border-t border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-wrap gap-1 overflow-x-auto">
                {templates.map((template) => (
                  <div key={template.id} className="relative group flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] rounded-md text-xs"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      {template.name}
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTemplate(template)
                      }}
                      className="absolute -top-1 -left-1 text-[#73a9e9] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-[#5a9ae6] h-4 w-4 flex items-center justify-center"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTemplate(template.id)
                      }}
                      className="absolute -top-1 -right-1 text-[#ff3b30] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-[#ff2d55] h-4 w-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>

                  </div>
                ))}

                {/* Add Template Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white border-0 rounded-md text-xs h-8 w-8 p-0"
                    onClick={() => setIsCreateTemplateOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
          <div className="mt-8 py-12 border-t border-[#e5e5ea] dark:border-[#3a3a3c] text-center flex flex-col items-center">
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
              © 2025 Atlas AI • <span className="hover:underline cursor-pointer">Help</span> •
              <span className="hover:underline cursor-pointer"> Terms</span> •
              <span className="hover:underline cursor-pointer"> Privacy</span> •
              <span className="text-[#73a9e9]"> (v1.0.0)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new message template for quick responses
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                placeholder="Enter template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="templateMessage">Template Message *</Label>
              <Textarea
                id="templateMessage"
                placeholder="Enter template message"
                value={newTemplateMessage}
                onChange={(e) => setNewTemplateMessage(e.target.value)}
                className="min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="templateDescription">Description (Optional)</Label>
              <Input
                id="templateDescription"
                placeholder="Enter template description"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateTemplateOpen(false);
                setNewTemplateName("");
                setNewTemplateMessage("");
                setNewTemplateDescription("");
              }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={!newTemplateName.trim() || !newTemplateMessage.trim()}
            >
              Create Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Template Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setTemplateToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTemplate}
              className="bg-[#ff3b30] hover:bg-[#ff2d55]"
            >
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Edit your message template
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editTemplateName">Template Name *</Label>
              <Input
                id="editTemplateName"
                placeholder="Enter template name"
                value={editingTemplate?.name || ''}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTemplateMessage">Template Message *</Label>
              <Textarea
                id="editTemplateMessage"
                placeholder="Enter template message"
                value={editingTemplate?.message || ''}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, message: e.target.value } : null)}
                className="min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTemplateDescription">Description (Optional)</Label>
              <Input
                id="editTemplateDescription"
                placeholder="Enter template description"
                value={editingTemplate?.description || ''}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditTemplateOpen(false);
                setEditingTemplate(null);
              }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={!editingTemplate?.name.trim() || !editingTemplate?.message.trim()}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </DoctorLayoutWrapper>)
}
