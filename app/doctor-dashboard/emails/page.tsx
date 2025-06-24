"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Calendar, MessageSquare, Mail, User, Search, Send, Paperclip, X, Plus } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import DoctorLayoutWrapper from "@/components/layouts/doctor-layout"

interface EmailTemplate {
    id: number;
    subject: string;
    body: string;
    preview: string;
}

interface Attachment {
    id: string;
    name: string;
    size: number;
    type: string;
}

// Mock email templates
const emailTemplates: EmailTemplate[] = [
    {
        id: 1,
        subject: "Follow-up Appointment Reminder",
        body: `Dear [Patient Name],

I hope this email finds you well. This is a friendly reminder about your upcoming follow-up appointment scheduled for [Appointment Date] at [Appointment Time].

Appointment Details:
- Date: [Appointment Date]
- Time: [Appointment Time]
- Location: [Clinic/Hospital Name]
- Doctor: Dr. [Doctor Name]
- Purpose: Follow-up consultation

Please arrive 15 minutes before your scheduled time to complete any necessary paperwork. If you need to reschedule, please contact our office at least 24 hours in advance.

What to Bring:
- Your insurance card
- List of current medications
- Any recent test results
- Questions or concerns you'd like to discuss

If you have any questions or need to make changes to your appointment, please don't hesitate to contact us at [Phone Number] or reply to this email.

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Follow-up appointment reminder with detailed instructions and preparation checklist..."
    },
    {
        id: 2,
        subject: "Test Results Available - Important Update",
        body: `Dear [Patient Name],

I am writing to inform you that your recent test results are now available for review. We have received and analyzed the results from your [Test Name] conducted on [Test Date].

Test Results Summary:
- Test Type: [Test Name]
- Date Conducted: [Test Date]
- Status: [Normal/Abnormal/Requires Review]

Next Steps:
1. Please schedule a follow-up appointment to discuss these results in detail
2. You can view your results through our patient portal
3. If you have any immediate concerns, please contact our office

Important Notes:
- These results are confidential and for your information only
- Please keep a copy for your records
- If you notice any significant changes in your condition, contact us immediately

To schedule a follow-up appointment or if you have any questions, please:
- Call us at: [Phone Number]
- Email us at: [Email Address]
- Use our online scheduling system: [Portal Link]

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Detailed test results notification with next steps and important notes..."
    },
    {
        id: 3,
        subject: "Medication Refill Reminder and Instructions",
        body: `Dear [Patient Name],

This is a reminder that your prescription for [Medication Name] is due for a refill. Based on our records, your current supply will run out on approximately [Refill Date].

Medication Details:
- Medication: [Medication Name]
- Dosage: [Dosage Information]
- Frequency: [How often to take]
- Remaining Refills: [Number of refills]

Important Instructions:
1. Please take your medication as prescribed
2. Do not stop taking your medication without consulting your doctor
3. Report any side effects immediately
4. Keep track of your medication supply

To request a refill, you can:
- Use our online prescription refill system
- Call our pharmacy at [Pharmacy Phone]
- Send a secure message through the patient portal
- Contact our office directly

If you have any questions about your medication or need to discuss any concerns, please don't hesitate to contact us.

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Comprehensive medication refill reminder with detailed instructions..."
    },
    {
        id: 4,
        subject: "Welcome to Our Practice - New Patient Information",
        body: `Dear [Patient Name],

Welcome to [Clinic/Hospital Name]! We're pleased to have you as a new patient and look forward to providing you with the best possible healthcare.

To help us serve you better, please review the following information:

Before Your First Visit:
1. Complete the new patient forms available on our website
2. Bring your insurance card and photo ID
3. Prepare a list of current medications
4. Gather any relevant medical records
5. Arrive 30 minutes before your appointment

What to Expect:
- Initial consultation with your doctor
- Comprehensive health assessment
- Discussion of your medical history
- Development of a personalized care plan

Our Services:
- Primary Care
- Preventive Health Screenings
- Chronic Disease Management
- Telehealth Consultations
- 24/7 Emergency Support

Patient Portal Access:
- Website: [Portal URL]
- Username: [Username]
- Temporary Password: [Password]
(Please change your password upon first login)

If you have any questions or need assistance, our staff is here to help. You can reach us at:
- Phone: [Phone Number]
- Email: [Email Address]
- Emergency: [Emergency Contact]

We look forward to meeting you and being a part of your healthcare journey.

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Comprehensive welcome letter for new patients with setup instructions..."
    },
    {
        id: 5,
        subject: "Post-Procedure Care Instructions",
        body: `Dear [Patient Name],

I hope you're recovering well from your recent [Procedure Name]. This email contains important post-procedure care instructions to ensure optimal recovery.

Procedure Summary:
- Date: [Procedure Date]
- Type: [Procedure Name]
- Surgeon: Dr. [Doctor Name]

Immediate Care Instructions:
1. Wound Care:
   - Keep the area clean and dry
   - Change dressings as instructed
   - Watch for signs of infection
   - Avoid strenuous activities

2. Medication Schedule:
   - [Medication 1]: [Dosage and frequency]
   - [Medication 2]: [Dosage and frequency]
   - Pain management: [Instructions]

3. Activity Restrictions:
   - Avoid [specific activities]
   - Resume normal activities: [Date]
   - Exercise restrictions: [Details]

Warning Signs to Watch For:
- Fever above 101°F
- Increased pain or swelling
- Unusual discharge
- Difficulty breathing
- [Other specific symptoms]

Follow-up Appointment:
- Date: [Follow-up Date]
- Time: [Follow-up Time]
- Purpose: [Post-procedure check]

Emergency Contact:
- Office: [Phone Number]
- After Hours: [Emergency Number]
- Hospital: [Hospital Name and Number]

Please don't hesitate to contact us if you:
- Have any questions about your recovery
- Experience any concerning symptoms
- Need to reschedule your follow-up
- Require additional information

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Detailed post-procedure care instructions with recovery guidelines..."
    },
    {
        id: 6,
        subject: "Appointment Cancellation/Rescheduling Request",
        body: `Dear [Patient Name],

I hope this email finds you well. I am writing regarding your upcoming appointment scheduled for [Original Appointment Date] at [Original Appointment Time].

We understand that circumstances may arise that require changes to your appointment. To help us better assist you, please review the following information:

Current Appointment Details:
- Date: [Original Appointment Date]
- Time: [Original Appointment Time]
- Doctor: Dr. [Doctor Name]
- Type: [Appointment Type]

Options Available:
1. Reschedule your appointment
2. Cancel your appointment
3. Convert to a telehealth consultation

To proceed with any of these options, please:
- Call our office at: [Phone Number]
- Reply to this email
- Use our online scheduling system: [Portal Link]

Important Notes:
- Please provide at least 24 hours' notice for any changes
- Emergency appointments are available if needed
- No-show fees may apply for late cancellations
- We can help find a more convenient time that works for you

If you need to reschedule, we recommend doing so as soon as possible to ensure availability of your preferred time slot.

For any urgent medical concerns, please don't hesitate to contact us immediately.

Best regards,
[Doctor Name]
[Clinic/Hospital Name]`,
        preview: "Professional template for handling appointment changes with clear options and instructions..."
    }
];

export default function EmailsClientPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
    const [emailSubject, setEmailSubject] = useState("")
    const [emailBody, setEmailBody] = useState("")
    const [recipientEmail, setRecipientEmail] = useState("")
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { toast } = useToast()
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null)
    const [deleteTemplate, setDeleteTemplate] = useState<EmailTemplate | null>(null)
    const [newTemplateName, setNewTemplateName] = useState("")
    const [newTemplateDescription, setNewTemplateDescription] = useState("")
    const [newTemplateSubject, setNewTemplateSubject] = useState("")
    const [newTemplateBody, setNewTemplateBody] = useState("")
    const [templates, setTemplates] = useState(emailTemplates)

    useEffect(() => {
        const initializePage = async () => {
            if (!isAuthenticated()) {
                router.push("/")
                return
            }

            try {
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

    const handleLogout = () => {
        clearTokens()
        router.push("/")
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        const newAttachments: Attachment[] = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type
        }))

        setAttachments(prev => [...prev, ...newAttachments])
        // Reset the input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveAttachment = (attachmentId: string) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailBody.trim() || !recipientEmail.trim()) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        try {
            const formData = new FormData()
            // Match Postman's form-data keys exactly
            formData.append('email_to', recipientEmail.trim())
            formData.append('email_subject', emailSubject.trim())
            formData.append('email_body', emailBody.trim())

            // Add attachments to formData if any
            if (attachments.length > 0) {
                attachments.forEach((attachment, index) => {
                    const fileInput = fileInputRef.current?.files?.[index]
                    if (fileInput) {
                        formData.append('attachments', fileInput) // Use 'attachments' as the key if that's what Postman uses
                    }
                })
            }

            const response = await fetch("/api/sendEmail", {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Server response:", errorData)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            // Clear the form
            setEmailSubject("")
            setEmailBody("")
            setRecipientEmail("")
            setSelectedTemplate(null)
            setAttachments([])

            toast({
                title: "Email sent",
                description: "Your email has been sent successfully.",
            })
        } catch (error) {
            console.error("Error sending email:", error)
            toast({
                title: "Error",
                description: "Failed to send email. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleSelectTemplate = (template: EmailTemplate) => {
        setSelectedTemplate(template)
        setEmailSubject(template.subject)
        setEmailBody(template.body)
    }

    // Add filtered templates computation
    const filteredTemplates = templates.filter(template => {
        const searchLower = searchQuery.toLowerCase()
        return (
            template.subject.toLowerCase().includes(searchLower) ||
            (template.preview || "").toLowerCase().includes(searchLower) ||
            (template.body || "").toLowerCase().includes(searchLower)
        )
    })

    if (isLoading) {
        return (
            <ThemeProvider>
                <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
                        <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading emails...</p>
                    </div>
                </main>
            </ThemeProvider>
        )
    }

    return (
        <DoctorLayoutWrapper activePage="emails">
            <div className="flex">
                {/* Main content */}
                <div className="flex-1">
                    <div className="p-6">
                        <h2 className="text-xl font-medium mb-2 text-[#1d1d1f] dark:text-white">Email Communication</h2>
                        <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-6">
                            Send emails to patients using pre-defined templates or create custom messages.
                        </p>

                        <div className="flex h-[calc(100vh-240px)]">
                            {/* Email templates */}
                            <div className="w-1/3 bg-white dark:bg-[#2c2c2e] rounded-l-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] border-r-0 overflow-hidden h-full flex flex-col">
                                {/* Top: Header, description, search (fixed) */}
                                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e] z-10">
                                    <h3 className="text-lg font-medium mb-2">Email Templates</h3>
                                    <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-4">Building Templates for easy access</p>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                                        <Input
                                            type="text"
                                            placeholder="Search templates..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </div>
                                </div>

                                {/* Middle: Template list (scrollable) */}
                                <div className="flex-1 overflow-y-auto">
                                    {filteredTemplates.length === 0 ? (
                                        <div className="p-4 text-center text-[#86868b] dark:text-[#a1a1a6]">
                                            <p>No templates found matching "{searchQuery}"</p>
                                            <p className="text-sm mt-2">Try different search terms or create a new template</p>
                                        </div>
                                    ) : (
                                        templates.filter(template => {
                                            const searchLower = searchQuery.toLowerCase()
                                            return (
                                                template.subject.toLowerCase().includes(searchLower) ||
                                                (template.preview || "").toLowerCase().includes(searchLower) ||
                                                (template.body || "").toLowerCase().includes(searchLower)
                                            )
                                        }).map((template) => (
                                            <div
                                                key={template.id}
                                                className={`p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] ${selectedTemplate?.id === template.id ? "bg-[#f5f5f7] dark:bg-[#3a3a3c]" : ""
                                                    }`}
                                            >
                                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelectTemplate(template)}>
                                                    <h4 className="font-medium text-[#1d1d1f] dark:text-white truncate">
                                                        {template.subject}
                                                    </h4>
                                                    <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] truncate">
                                                        {template.preview}
                                                    </p>
                                                    {searchQuery && (
                                                        <div className="mt-1 text-xs text-[#73a9e9]">
                                                            {template.subject.toLowerCase().includes(searchQuery.toLowerCase()) && (
                                                                <span className="mr-2">Subject match</span>
                                                            )}
                                                            {(template.preview || "").toLowerCase().includes(searchQuery.toLowerCase()) && (
                                                                <span>Preview match</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-end mt-1">
                                                    <span
                                                        className="text-[#73a9e9] text-sm font-medium cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setEditTemplate(template)
                                                            setNewTemplateName(template.subject)
                                                            setNewTemplateDescription(template.preview || "")
                                                            setNewTemplateSubject(template.subject)
                                                            setNewTemplateBody(template.body)
                                                            setShowEditModal(true)
                                                        }}
                                                    >
                                                        Edit
                                                    </span>
                                                    <span
                                                        className="text-[#e53e3e] text-sm font-medium cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setDeleteTemplate(template)
                                                            setShowDeleteModal(true)
                                                        }}
                                                    >
                                                        Delete
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Bottom: Create New Template button (fixed) */}
                                <div className="p-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e] z-10 flex flex-col items-center">
                                    <Button
                                        className="w-3/4 bg-[#f5f5f7] hover:bg-[#e5e5ea] dark:bg-[#3a3a3c] dark:hover:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white rounded-lg h-10"
                                        onClick={() => setShowTemplateModal(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> CREATE NEW TEMPLATE
                                    </Button>
                                </div>
                            </div>

                            {/* Email composition */}
                            <div className="w-2/3 bg-white dark:bg-[#2c2c2e] rounded-r-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col">
                                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                                    <Input
                                        type="email"
                                        placeholder="Recipient Email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        className="h-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 mb-4"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Subject"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        className="h-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>

                                <div className="flex-1 p-4">
                                    <textarea
                                        placeholder="Write your email..."
                                        value={emailBody}
                                        onChange={(e) => setEmailBody(e.target.value)}
                                        className="w-full h-[calc(100%-80px)] bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 p-4 resize-none"
                                    />

                                    {/* Attachments section */}
                                    {attachments.length > 0 && (
                                        <div className="mt-4 p-3 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg">
                                            <h4 className="text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Attachments</h4>
                                            <div className="space-y-2">
                                                {attachments.map((attachment) => (
                                                    <div
                                                        key={attachment.id}
                                                        className="flex items-center justify-between p-2 bg-white dark:bg-[#2c2c2e] rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Paperclip className="h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                                                            <span className="text-sm text-[#1d1d1f] dark:text-white truncate max-w-[200px]">
                                                                {attachment.name}
                                                            </span>
                                                            <span className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                                                                ({formatFileSize(attachment.size)})
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                                                            onClick={() => handleRemoveAttachment(attachment.id)}
                                                        >
                                                            <X className="h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-[#e5e5ea] dark:border-[#3a3a3c] flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            multiple
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <Button
                                            variant="outline"
                                            className="h-10 px-4 border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Paperclip className="mr-2 h-4 w-4" /> Add Attachment
                                        </Button>
                                    </div>
                                    <Button
                                        className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg h-10 px-6"
                                        onClick={handleSendEmail}
                                    >
                                        <Send className="mr-2 h-5 w-5" /> Send Email
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
            </div>

            {/* Modal for creating a new template */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-[#232326] rounded-xl shadow-lg w-full max-w-2xl p-8 relative">
                        <button
                            className="absolute top-4 right-4 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                            onClick={() => setShowTemplateModal(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-semibold mb-6 text-[#1d1d1f] dark:text-white">Create New Email Template</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Template Name</label>
                            <Input
                                type="text"
                                value={newTemplateName}
                                onChange={e => setNewTemplateName(e.target.value)}
                                placeholder="Enter template name"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Template Description</label>
                            <Input
                                type="text"
                                value={newTemplateDescription}
                                onChange={e => setNewTemplateDescription(e.target.value)}
                                placeholder="Enter template description"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Email Subject</label>
                            <Input
                                type="text"
                                value={newTemplateSubject}
                                onChange={e => setNewTemplateSubject(e.target.value)}
                                placeholder="Enter subject"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Email Body</label>
                            <textarea
                                value={newTemplateBody}
                                onChange={e => setNewTemplateBody(e.target.value)}
                                placeholder="Enter email body"
                                className="w-full min-h-[220px] bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 p-4 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                className="rounded-lg px-6"
                                onClick={() => {
                                    setShowTemplateModal(false)
                                    setNewTemplateName("")
                                    setNewTemplateDescription("")
                                    setNewTemplateSubject("")
                                    setNewTemplateBody("")
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg px-6"
                                onClick={() => {
                                    // You can add logic to save the template here
                                    setShowTemplateModal(false)
                                    setNewTemplateName("")
                                    setNewTemplateDescription("")
                                    setNewTemplateSubject("")
                                    setNewTemplateBody("")
                                    toast({
                                        title: "Template saved (demo)",
                                        description: "Your new template was saved (not persisted in this demo)."
                                    })
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing a template */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-[#232326] rounded-xl shadow-lg w-full max-w-2xl p-8 relative">
                        <button
                            className="absolute top-4 right-4 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                            onClick={() => setShowEditModal(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-semibold mb-6 text-[#1d1d1f] dark:text-white">Edit Email Template</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Template Name</label>
                            <Input
                                type="text"
                                value={newTemplateName}
                                onChange={e => setNewTemplateName(e.target.value)}
                                placeholder="Enter template name"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Template Description</label>
                            <Input
                                type="text"
                                value={newTemplateDescription}
                                onChange={e => setNewTemplateDescription(e.target.value)}
                                placeholder="Enter template description"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Email Subject</label>
                            <Input
                                type="text"
                                value={newTemplateSubject}
                                onChange={e => setNewTemplateSubject(e.target.value)}
                                placeholder="Enter subject"
                                className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-[#1d1d1f] dark:text-white">Email Body</label>
                            <textarea
                                value={newTemplateBody}
                                onChange={e => setNewTemplateBody(e.target.value)}
                                placeholder="Enter email body"
                                className="w-full min-h-[220px] bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 p-4 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                className="rounded-lg px-6"
                                onClick={() => {
                                    setShowEditModal(false)
                                    setEditTemplate(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#73a9e9] hover:bg-[#5a9ae6] text-white rounded-lg px-6"
                                onClick={() => {
                                    if (editTemplate) {
                                        setTemplates(prev => prev.map(t => t.id === editTemplate.id ? {
                                            ...editTemplate,
                                            subject: newTemplateSubject,
                                            preview: newTemplateDescription,
                                            body: newTemplateBody
                                        } : t))
                                    }
                                    setShowEditModal(false)
                                    setEditTemplate(null)
                                    toast({
                                        title: "Template updated",
                                        description: "Your template was updated successfully."
                                    })
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-[#232326] rounded-xl shadow-lg w-full max-w-md p-8 relative">
                        <button
                            className="absolute top-4 right-4 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-semibold mb-6 text-[#1d1d1f] dark:text-white">Delete Template</h2>
                        <p className="mb-6 text-[#86868b] dark:text-[#a1a1a6]">Are you sure you want to delete this template?</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                className="rounded-lg px-6"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#e53e3e] hover:bg-[#c53030] text-white rounded-lg px-6"
                                onClick={() => {
                                    if (deleteTemplate) {
                                        setTemplates(prev => prev.filter(t => t.id !== deleteTemplate.id))
                                    }
                                    setShowDeleteModal(false)
                                    setDeleteTemplate(null)
                                    toast({
                                        title: "Template deleted",
                                        description: "The template was deleted successfully."
                                    })
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayoutWrapper>
    )
} 
