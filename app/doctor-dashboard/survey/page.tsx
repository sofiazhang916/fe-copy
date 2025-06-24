"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Calendar, MessageSquare, FlaskRoundIcon as Flask, User, Search, Send, Mail, Star, ChevronDown, Plus, Trash2, Settings, GripVertical } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { clearTokens, isAuthenticated, refreshTokens } from "@/lib/token-service"
import DoctorLayoutWrapper from "@/components/layouts/doctor-layout"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  DialogDescription,
} from "@/components/ui/dialog"

// Define types for our reviews and templates
interface Review {
  id: number;
  patientName: string | null; // null for anonymous feedback
  rating: number;
  feedback: string;
  timestamp: string;
  template: string;
  fieldResponses: {
    fieldName: string;
    fieldReference: string;
    value: string | number | boolean | string[] | null;
  }[];
}

interface Template {
  id: number;
  name: string;
  description: string;
  responseRate: number;
  averageRating: number;
  fields: {
    name: string;
    type: FormField['type'];
    required: boolean;
    fieldReference: string;
  }[];
}

// Update the FormField interface
interface FormField {
  id: string;
  type: 'short_text' | 'long_text' | 'number' | 'yes_no' | 'multiple_choice' | 'dropdown' | 'rating' | 'email' | 'phone';
  label: string;
  fieldReference: string; // New field reference attribute
  required: boolean;
  description?: string;
  constraints?: {
    // Short Text constraints
    max_length?: number;
    // Number constraints
    min_value?: number;
    max_value?: number;
    // Multiple Choice constraints
    min_choices?: number;
    allow_multiple?: boolean;
    randomize?: boolean;
    options?: string[];
    // Dropdown constraints
    alphabetical_order?: boolean;
    // Rating constraints
    steps?: number;
  };
}

// Mock data
const templates: Template[] = [
  {
    id: 1,
    name: "Post-Visit Satisfaction",
    description: "Automated survey sent after each appointment",
    responseRate: 64,
    averageRating: 4.2,
    fields: [
      {
        name: "Patient Name",
        type: "short_text",
        required: true,
        fieldReference: "patient_name"
      },
      {
        name: "Appointment Date",
        type: "short_text",
        required: true,
        fieldReference: "appointment_date"
      },
      {
        name: "Rating",
        type: "rating",
        required: true,
        fieldReference: "visit_rating"
      },
      {
        name: "Feedback",
        type: "long_text",
        required: false,
        fieldReference: "visit_feedback"
      }
    ]
  },
  {
    id: 2,
    name: "Quarterly Patient Experience",
    description: "Comprehensive quarterly feedback on overall experience",
    responseRate: 48,
    averageRating: 3.8,
    fields: [
      {
        name: "Patient Name",
        type: "short_text",
        required: true,
        fieldReference: "patient_name"
      },
      {
        name: "Quarter",
        type: "dropdown",
        required: true,
        fieldReference: "quarter"
      },
      {
        name: "Overall Rating",
        type: "rating",
        required: true,
        fieldReference: "overall_rating"
      },
      {
        name: "Detailed Feedback",
        type: "long_text",
        required: false,
        fieldReference: "detailed_feedback"
      }
    ]
  },
  {
    id: 3,
    name: "Telehealth Experience",
    description: "Feedback specific to virtual appointment experience",
    responseRate: 72,
    averageRating: 4.5,
    fields: [
      {
        name: "Patient Name",
        type: "short_text",
        required: true,
        fieldReference: "patient_name"
      },
      {
        name: "Visit Date",
        type: "short_text",
        required: true,
        fieldReference: "visit_date"
      },
      {
        name: "Platform Rating",
        type: "rating",
        required: true,
        fieldReference: "platform_rating"
      },
      {
        name: "Technical Issues",
        type: "multiple_choice",
        required: false,
        fieldReference: "technical_issues"
      },
      {
        name: "Feedback",
        type: "long_text",
        required: false,
        fieldReference: "visit_feedback"
      }
    ]
  }
];

const reviews: Review[] = [
  {
    id: 1,
    patientName: "John Smith",
    rating: 5,
    feedback: "Excellent service and very professional staff. The doctor was very thorough and explained everything clearly.",
    timestamp: "2024-05-21T15:30:00",
    template: "Post-Visit Satisfaction",
    fieldResponses: [
      {
        fieldName: "Patient Name",
        fieldReference: "patient_name",
        value: "John Smith"
      },
      {
        fieldName: "Appointment Date",
        fieldReference: "appointment_date",
        value: "2024-05-21"
      },
      {
        fieldName: "Rating",
        fieldReference: "visit_rating",
        value: 5
      },
      {
        fieldName: "Feedback",
        fieldReference: "visit_feedback",
        value: "Excellent service and very professional staff. The doctor was very thorough and explained everything clearly."
      }
    ]
  },
  {
    id: 2,
    patientName: null,
    rating: 4,
    feedback: "Good experience overall. The wait time was a bit long, but the doctor was very attentive.",
    timestamp: "2024-05-20T10:15:00",
    template: "Telehealth Experience",
    fieldResponses: [
      {
        fieldName: "Patient Name",
        fieldReference: "patient_name",
        value: null
      },
      {
        fieldName: "Visit Date",
        fieldReference: "visit_date",
        value: "2024-05-20"
      },
      {
        fieldName: "Platform Rating",
        fieldReference: "platform_rating",
        value: 4
      },
      {
        fieldName: "Technical Issues",
        fieldReference: "technical_issues",
        value: ["None"]
      },
      {
        fieldName: "Feedback",
        fieldReference: "visit_feedback",
        value: "Good experience overall. The wait time was a bit long, but the doctor was very attentive."
      }
    ]
  },
  {
    id: 3,
    patientName: "Sarah Johnson",
    rating: 5,
    feedback: "The virtual consultation was smooth and efficient. The doctor was very helpful and addressed all my concerns.",
    timestamp: "2024-05-19T14:45:00",
    template: "Telehealth Experience",
    fieldResponses: [
      {
        fieldName: "Patient Name",
        fieldReference: "patient_name",
        value: "Sarah Johnson"
      },
      {
        fieldName: "Visit Date",
        fieldReference: "visit_date",
        value: "2024-05-19"
      },
      {
        fieldName: "Platform Rating",
        fieldReference: "platform_rating",
        value: 5
      },
      {
        fieldName: "Technical Issues",
        fieldReference: "technical_issues",
        value: ["Audio delay", "Fixed after 2 minutes"]
      },
      {
        fieldName: "Feedback",
        fieldReference: "visit_feedback",
        value: "The virtual consultation was smooth and efficient. The doctor was very helpful and addressed all my concerns."
      }
    ]
  }
];

// Add a helper function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export default function ReviewPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [templatesList, setTemplatesList] = useState<Template[]>(templates)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates)
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false)
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [surveyName, setSurveyName] = useState("")
  const [surveyDescription, setSurveyDescription] = useState("")
  const [selectedFieldType, setSelectedFieldType] = useState<FormField['type']>('short_text')
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldDescription, setNewFieldDescription] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const [constraints, setConstraints] = useState<FormField['constraints']>({})
  const [newFieldReference, setNewFieldReference] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [selectedResponse, setSelectedResponse] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isSendSurveyOpen, setIsSendSurveyOpen] = useState(false);
  const [isEditSurveyOpen, setIsEditSurveyOpen] = useState(false);
  const [isDeleteSurveyOpen, setIsDeleteSurveyOpen] = useState(false);
  const [emailToSend, setEmailToSend] = useState("");
  const [surveyLink, setSurveyLink] = useState(""); // This would typically come from your backend
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  // Filter templates based on search query
  useEffect(() => {
    const filtered = templatesList.filter((template) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.fields.some(field => field.name.toLowerCase().includes(searchLower))
      )
    })
    setFilteredTemplates(filtered)

    // If the selected template is filtered out, select the first available template
    if (filtered.length > 0 && !filtered.find(t => t.id === selectedTemplate.id)) {
      setSelectedTemplate(filtered[0])
    }
  }, [searchQuery, templatesList, selectedTemplate.id])

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const addNewField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedFieldType,
      label: newFieldLabel,
      fieldReference: newFieldReference,
      required: isRequired,
      description: newFieldDescription,
      constraints: ['long_text', 'email', 'phone'].includes(selectedFieldType) ? undefined : constraints
    };
    setFormFields([...formFields, newField]);
    // Reset field inputs
    setNewFieldLabel("");
    setNewFieldReference("");
    setNewFieldDescription("");
    setIsRequired(false);
    setConstraints({});
  };

  const removeField = (fieldId: string) => {
    const fieldToRemove = formFields.find(field => field.id === fieldId);
    if (!fieldToRemove) return;

    // Remove from formFields
    setFormFields(formFields.filter(field => field.id !== fieldId));

    // Update the selected template's fields
    const updatedTemplate = {
      ...selectedTemplate,
      fields: selectedTemplate.fields.filter(field =>
        field.fieldReference !== fieldToRemove.fieldReference
      )
    };

    // Update templates list
    setTemplatesList(templatesList.map(template =>
      template.id === selectedTemplate.id ? updatedTemplate : template
    ));
    setFilteredTemplates(filteredTemplates.map(template =>
      template.id === selectedTemplate.id ? updatedTemplate : template
    ));
    setSelectedTemplate(updatedTemplate);

    // Update any responses that reference this field
    const updatedReviews = reviews.map(review => {
      if (review.template === selectedTemplate.name) {
        return {
          ...review,
          fieldResponses: review.fieldResponses.filter(response =>
            response.fieldReference !== fieldToRemove.fieldReference
          )
        };
      }
      return review;
    });

    // Show success message
    toast({
      title: "Field removed",
      description: "The field has been removed from all views",
    });
  };

  const handleSendSurvey = () => {
    if (!emailToSend.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the survey",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to send the survey
    console.log("Sending survey to:", emailToSend);
    toast({
      title: "Survey sent",
      description: `Survey has been sent to ${emailToSend}`,
    });
    setIsSendSurveyOpen(false);
    setEmailToSend("");
  };

  const handleEditSurvey = () => {
    // Here you would typically load the existing survey data
    setSurveyName(selectedTemplate.name);
    setSurveyDescription(selectedTemplate.description);
    setFormFields(selectedTemplate.fields.map(field => ({
      id: Math.random().toString(36).substr(2, 9),
      type: field.type,
      label: field.name,
      fieldReference: field.fieldReference,
      required: field.required,
    })));
    setIsEditSurveyOpen(true);
    setEmailSubject(`Fill out survey: ${selectedTemplate.name}`);
    setEmailBody(`Hello,

Please take a moment to fill out our survey. Your feedback is valuable to us.

Click the link below to access the survey:
https://atlas-ai.com/survey/example

Thank you for your time.`);
  };

  const handleDeleteSurvey = () => {
    // Remove the template from the list
    const updatedTemplates = templatesList.filter(t => t.id !== selectedTemplate.id);
    setTemplatesList(updatedTemplates);

    // Update filtered templates
    setFilteredTemplates(updatedTemplates);

    // Select the first available template if there are any left
    if (updatedTemplates.length > 0) {
      setSelectedTemplate(updatedTemplates[0]);
    }

    toast({
      title: "Survey deleted",
      description: "The survey has been deleted successfully",
    });
    setIsDeleteSurveyOpen(false);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setSelectedFieldType(field.type);
    setNewFieldLabel(field.label);
    setNewFieldReference(field.fieldReference);
    setNewFieldDescription(field.description || '');
    setIsRequired(field.required);
    setConstraints(field.constraints || {});
    setIsEditFieldOpen(true);
  };

  const saveEditedField = () => {
    if (!editingField || !newFieldLabel.trim()) return;

    const updatedField: FormField = {
      ...editingField,
      type: selectedFieldType,
      label: newFieldLabel,
      fieldReference: newFieldReference,
      required: isRequired,
      description: newFieldDescription,
      constraints: ['long_text', 'email', 'phone'].includes(selectedFieldType) ? undefined : constraints
    };

    // Update formFields
    setFormFields(formFields.map(field =>
      field.id === editingField.id ? updatedField : field
    ));

    // Update the selected template's fields
    const updatedTemplate = {
      ...selectedTemplate,
      fields: selectedTemplate.fields.map(field => {
        if (field.fieldReference === editingField.fieldReference) {
          return {
            ...field,
            name: updatedField.label,
            type: updatedField.type,
            required: updatedField.required,
            fieldReference: updatedField.fieldReference
          };
        }
        return field;
      })
    };

    // Update templates list
    setTemplatesList(templatesList.map(template =>
      template.id === selectedTemplate.id ? updatedTemplate : template
    ));
    setFilteredTemplates(filteredTemplates.map(template =>
      template.id === selectedTemplate.id ? updatedTemplate : template
    ));
    setSelectedTemplate(updatedTemplate);

    // Update any responses that reference this field
    const updatedReviews = reviews.map(review => {
      if (review.template === selectedTemplate.name) {
        return {
          ...review,
          fieldResponses: review.fieldResponses.map(response => {
            if (response.fieldReference === editingField.fieldReference) {
              return {
                ...response,
                fieldName: updatedField.label,
                fieldReference: updatedField.fieldReference
              };
            }
            return response;
          })
        };
      }
      return review;
    });

    // Reset form
    setEditingField(null);
    setSelectedFieldType('short_text');
    setNewFieldLabel('');
    setNewFieldReference('');
    setNewFieldDescription('');
    setIsRequired(false);
    setConstraints({});
    setIsEditFieldOpen(false);

    // Show success message
    toast({
      title: "Field updated",
      description: "The field has been updated successfully across all views",
    });
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#73a9e9]"></div>
            <p className="mt-4 text-[#86868b] dark:text-[#a1a1a6]">Loading reviews...</p>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <DoctorLayoutWrapper activePage="survey">
      <main className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white">
        <div className="flex-1">

          <div className="p-6">
            <h2 className="text-xl font-medium mb-2 text-[#1d1d1f] dark:text-white">Patient Reviews</h2>
            <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-6">
              Manage and analyze patient feedback, track satisfaction metrics, and improve care quality through comprehensive review management.
            </p>

            <div className="flex h-[calc(100vh-190px)]">
              {/* Templates list */}
              <div className="w-1/3 bg-white dark:bg-[#2c2c2e] rounded-l-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] border-r-0 flex flex-col">
                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] flex-shrink-0">
                  <h3 className="text-lg font-medium mb-2">Survey Templates</h3>
                  <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mb-4">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                  </p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b] dark:text-[#a1a1a6]" />
                    <Input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 pr-8 h-10 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-[#1d1d1f] dark:text-white focus-visible:ring-1 focus-visible:ring-[#73a9e9]"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredTemplates.length === 0 ? (
                    <div className="p-4 text-center text-[#86868b] dark:text-[#a1a1a6]">
                      No templates found matching "{searchQuery}"
                    </div>
                  ) : (
                    <>
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] cursor-pointer hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] ${selectedTemplate.id === template.id ? "bg-[#f5f5f7] dark:bg-[#3a3a3c]" : ""
                            }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="flex flex-col gap-2">
                            <h4 className="font-medium text-[#1d1d1f] dark:text-white">
                              {template.name}
                            </h4>
                            <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                              {template.description}
                            </p>
                            {/* <div className="flex items-center gap-4 text-sm text-[#86868b] dark:text-[#a1a1a6]">
                                <span>Response Rate: {template.responseRate}%</span>
                                <span className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  {template.averageRating}
                                </span>
                              </div> */}
                          </div>
                        </div>
                      ))}
                      <div className="p-4 flex justify-center">
                        <Dialog open={isCreateSurveyOpen} onOpenChange={setIsCreateSurveyOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-64 bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-10 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0">
                              <Plus className="mr-2 h-4 w-4" /> Create New Survey
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-semibold">Create New Survey</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              {/* Survey Basic Info */}
                              <div className="space-y-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="surveyName" className="text-base font-medium">
                                    Survey Name
                                  </Label>
                                  <Input
                                    id="surveyName"
                                    placeholder="Enter survey name"
                                    value={surveyName}
                                    onChange={(e) => setSurveyName(e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="surveyDescription" className="text-base font-medium">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="surveyDescription"
                                    placeholder="Enter survey description"
                                    value={surveyDescription}
                                    onChange={(e) => setSurveyDescription(e.target.value)}
                                    className="w-full min-h-[100px]"
                                  />
                                </div>
                              </div>

                              {/* Form Fields List */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Survey Fields</h3>
                                {formFields.map((field, index) => (
                                  <div key={field.id} className="p-4 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <GripVertical className="h-4 w-4 text-[#86868b]" />
                                          <h4 className="font-medium">{field.label}</h4>
                                          {field.required && (
                                            <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                                              Required
                                            </span>
                                          )}
                                          <span className="text-xs px-2 py-1 bg-[#e5e5ea] dark:bg-[#4a4a4c] rounded">
                                            {field.type.replace('_', ' ').toUpperCase()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-[#86868b] mt-1">{field.description}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditField(field)}
                                          className="h-8 w-8 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                          title="Edit Field"
                                        >
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeField(field.id)}
                                          className="h-8 w-8 text-[#86868b] hover:text-red-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                          title="Remove Field"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Add New Field Form */}
                              <div className="space-y-4 border-t pt-4">
                                <h3 className="text-lg font-medium">Add New Field</h3>
                                <div className="grid gap-4">
                                  <div className="grid gap-2">
                                    <Label>Field Type</Label>
                                    <Select
                                      value={selectedFieldType}
                                      onValueChange={(value: FormField['type']) => {
                                        setSelectedFieldType(value);
                                        // Reset constraints when field type changes
                                        setConstraints({});
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select field type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="short_text">Short Text</SelectItem>
                                        <SelectItem value="long_text">Long Text</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="yes_no">Yes/No</SelectItem>
                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                        <SelectItem value="dropdown">Dropdown</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="phone">Phone Number</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label>Field Label</Label>
                                    <Input
                                      placeholder="Enter field label"
                                      value={newFieldLabel}
                                      onChange={(e) => setNewFieldLabel(e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label>Field Reference</Label>
                                    <Input
                                      placeholder="Enter field reference (e.g., patient_name, visit_date)"
                                      value={newFieldReference}
                                      onChange={(e) => setNewFieldReference(e.target.value)}
                                    />
                                    <p className="text-xs text-[#86868b]">Use lowercase with underscores (e.g., patient_name)</p>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label>Description (Optional)</Label>
                                    <Input
                                      placeholder="Enter field description"
                                      value={newFieldDescription}
                                      onChange={(e) => setNewFieldDescription(e.target.value)}
                                    />
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="required"
                                      checked={isRequired}
                                      onCheckedChange={setIsRequired}
                                    />
                                    <Label htmlFor="required">Required Field</Label>
                                  </div>

                                  {/* Field Type Specific Constraints */}
                                  {selectedFieldType === 'short_text' && (
                                    <div className="grid gap-2">
                                      <Label>Maximum Length</Label>
                                      <Input
                                        type="number"
                                        placeholder="Max length (max 999)"
                                        value={constraints?.max_length ?? ''}
                                        onChange={(e) => {
                                          const value = Math.min(Math.max(Number(e.target.value), 1), 999);
                                          setConstraints({ ...constraints ?? {}, max_length: value });
                                        }}
                                      />
                                      <p className="text-xs text-[#86868b]">Maximum length: 1-999 characters</p>
                                    </div>
                                  )}

                                  {selectedFieldType === 'number' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label>Minimum Value</Label>
                                        <Input
                                          type="number"
                                          placeholder="Min value"
                                          value={constraints?.min_value ?? ''}
                                          onChange={(e) => setConstraints({ ...constraints ?? {}, min_value: Number(e.target.value) })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label>Maximum Value</Label>
                                        <Input
                                          type="number"
                                          placeholder="Max value"
                                          value={constraints?.max_value ?? ''}
                                          onChange={(e) => setConstraints({ ...constraints ?? {}, max_value: Number(e.target.value) })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {(selectedFieldType === 'multiple_choice' || selectedFieldType === 'dropdown') && (
                                    <>
                                      <div className="grid gap-2">
                                        <Label>Options (minimum 2 choices, one per line)</Label>
                                        <Textarea
                                          placeholder="Enter options"
                                          value={constraints?.options?.join('\n') ?? ''}
                                          onChange={(e) => {
                                            const options = e.target.value.split('\n').filter(opt => opt.trim());
                                            setConstraints({
                                              ...constraints ?? {},
                                              options: options.length >= 2 ? options : constraints?.options
                                            });
                                          }}
                                          className="min-h-[100px]"
                                        />
                                        {constraints?.options && constraints.options.length < 2 && (
                                          <p className="text-sm text-red-500">Minimum 2 choices required</p>
                                        )}
                                      </div>

                                      {selectedFieldType === 'multiple_choice' && (
                                        <div className="space-y-4">
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              id="allow_multiple"
                                              checked={constraints?.allow_multiple ?? false}
                                              onCheckedChange={(checked) => setConstraints({
                                                ...constraints ?? {},
                                                allow_multiple: checked
                                              })}
                                            />
                                            <Label htmlFor="allow_multiple">Allow Multiple Selections</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              id="randomize"
                                              checked={constraints?.randomize ?? false}
                                              onCheckedChange={(checked) => setConstraints({
                                                ...constraints ?? {},
                                                randomize: checked
                                              })}
                                            />
                                            <Label htmlFor="randomize">Randomize Choices</Label>
                                          </div>
                                        </div>
                                      )}

                                      {selectedFieldType === 'dropdown' && (
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="alphabetical_order"
                                            checked={constraints?.alphabetical_order ?? false}
                                            onCheckedChange={(checked) => setConstraints({
                                              ...constraints ?? {},
                                              alphabetical_order: checked
                                            })}
                                          />
                                          <Label htmlFor="alphabetical_order">Display in Alphabetical Order</Label>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {selectedFieldType === 'rating' && (
                                    <div className="grid gap-2">
                                      <Label>Steps (2-10)</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of steps"
                                        value={constraints?.steps ?? ''}
                                        onChange={(e) => {
                                          const value = Math.min(Math.max(Number(e.target.value), 2), 10);
                                          setConstraints({ ...constraints ?? {}, steps: value });
                                        }}
                                      />
                                      <p className="text-xs text-[#86868b]">Number of steps: 2-10</p>
                                    </div>
                                  )}

                                  <Button
                                    onClick={addNewField}
                                    className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-10 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                    disabled={!newFieldLabel}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Add Field
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsCreateSurveyOpen(false);
                                  setFormFields([]);
                                  setSurveyName("");
                                  setSurveyDescription("");
                                  setNewFieldLabel("");
                                  setNewFieldReference("");
                                  setNewFieldDescription("");
                                  setIsRequired(false);
                                  setConstraints({});
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-10 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                onClick={() => {
                                  // Validate required fields
                                  if (!surveyName.trim()) {
                                    toast({
                                      title: "Survey name required",
                                      description: "Please enter a name for your survey",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  if (formFields.length === 0) {
                                    toast({
                                      title: "No fields added",
                                      description: "Please add at least one field to your survey",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  // Validate field references
                                  const invalidFields = formFields.filter(field => !field.fieldReference.trim());
                                  if (invalidFields.length > 0) {
                                    toast({
                                      title: "Missing field references",
                                      description: `Please add field references for: ${invalidFields.map(f => f.label).join(', ')}`,
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  // Create survey logic here
                                  console.log({
                                    name: surveyName,
                                    description: surveyDescription,
                                    fields: formFields
                                  });

                                  // Show success message
                                  toast({
                                    title: "Survey created",
                                    description: "Your survey has been created successfully",
                                  });

                                  // Reset form and close modal
                                  setIsCreateSurveyOpen(false);
                                  setFormFields([]);
                                  setSurveyName("");
                                  setSurveyDescription("");
                                  setNewFieldLabel("");
                                  setNewFieldReference("");
                                  setNewFieldDescription("");
                                  setIsRequired(false);
                                  setConstraints({});
                                }}
                                disabled={!surveyName.trim() || formFields.length === 0}
                              >
                                Create Survey
                              </Button>
                            </div>

                            {/* Add validation feedback */}
                            {!surveyName.trim() && (
                              <p className="text-sm text-red-500 mt-2">Please enter a survey name</p>
                            )}
                            {formFields.length === 0 && (
                              <p className="text-sm text-red-500 mt-2">Please add at least one field to your survey</p>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Reviews and Template Details */}
              <div className="w-2/3 bg-white dark:bg-[#2c2c2e] rounded-r-lg shadow-sm border border-[#e5e5ea] dark:border-[#3a3a3c] flex flex-col">
                {/* Template header */}
                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] flex-shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-[#1d1d1f] dark:text-white text-lg mb-2">
                        {selectedTemplate.name}
                      </h4>
                      <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                        {selectedTemplate.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsSendSurveyOpen(true)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                        title="Send Survey"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleEditSurvey}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                        title="Edit Survey"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setIsDeleteSurveyOpen(true)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]"
                        title="Delete Survey"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#3a3a3c] flex-shrink-0">
                  <h5 className="font-medium text-[#1d1d1f] dark:text-white mb-3">Template Statistics</h5>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="text-sm font-medium text-[#1d1d1f] dark:text-white">Total Sent</h6>
                        <Mail className="h-4 w-4 text-[#73a9e9]" />
                      </div>
                      <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">1,234</p>
                      <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">Last 30 days</p>
                    </div>
                    <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="text-sm font-medium text-[#1d1d1f] dark:text-white">Responses</h6>
                        <MessageSquare className="h-4 w-4 text-[#73a9e9]" />
                      </div>
                      <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">789</p>
                      <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">Last 30 days</p>
                    </div>
                    {/* Response Rate and Rating Cards */}
                    {/* <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="text-sm font-medium text-[#1d1d1f] dark:text-white">Response Rate</h6>
                          <Flask className="h-4 w-4 text-[#73a9e9]" />
                        </div>
                        <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">{selectedTemplate.responseRate}%</p>
                        <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">Overall</p>
                      </div>
                      <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="text-sm font-medium text-[#1d1d1f] dark:text-white">Average Rating</h6>
                          <Star className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">{selectedTemplate.averageRating}</p>
                          <p className="text-sm text-[#86868b] dark:text-[#a1a1a6]">/ 5</p>
                        </div>
                        <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">Overall</p>
                      </div> */}
                  </div>
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                  {/* Template fields */}
                  <div className="border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
                    <Collapsible>
                      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] transition-colors">
                        <h5 className="font-medium text-[#1d1d1f] dark:text-white">Template Fields</h5>
                        <ChevronDown className="h-4 w-4 text-[#86868b] dark:text-[#a1a1a6] transition-transform duration-200 data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0">
                        <div className="space-y-3">
                          {selectedTemplate.fields.map((field, index) => (
                            <div
                              key={index}
                              className="p-4 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h6 className="font-medium text-[#1d1d1f] dark:text-white">
                                      {field.name}
                                    </h6>
                                    {field.required && (
                                      <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                                        Required
                                      </span>
                                    )}
                                    <span className="text-xs px-2 py-1 bg-[#e5e5ea] dark:bg-[#4a4a4c] rounded">
                                      {field.type.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Recent responses */}
                  <div className="border-t border-[#e5e5ea] dark:border-[#3a3a3c]">
                    <Collapsible>
                      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] transition-colors">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-[#1d1d1f] dark:text-white">Recent Responses</h5>
                          <span className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                            ({reviews.filter(review => review.template === selectedTemplate.name).length})
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-[#86868b] dark:text-[#a1a1a6] transition-transform duration-200 data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0">
                        <div className="space-y-4">
                          {reviews
                            .filter(review => review.template === selectedTemplate.name)
                            .map((review) => (
                              <div
                                key={review.id}
                                className="p-4 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg cursor-pointer hover:bg-[#e5e5ea] dark:hover:bg-[#4a4a4c] transition-colors"
                                onClick={() => {
                                  setSelectedResponse(review);
                                  setIsResponseDialogOpen(true);
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <h6 className="font-medium text-[#1d1d1f] dark:text-white">
                                    {review.patientName || "Anonymous Feedback"}
                                  </h6>
                                  <span className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                                    {formatDate(review.timestamp)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
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
      </main>

      {/* Response Detail Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Response Details
            </DialogTitle>
            <div className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
              {selectedResponse?.template} • {formatDate(selectedResponse?.timestamp ?? '')}
            </div>
          </DialogHeader>

          {selectedResponse && (
            <div className="space-y-4 py-4">
              {selectedResponse.fieldResponses.map((response, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                      {response.fieldName}
                    </Label>
                    <span className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                      {response.fieldReference}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg">
                    {Array.isArray(response.value) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {response.value.map((item, i) => (
                          <li key={i} className="text-sm text-[#1d1d1f] dark:text-white">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#1d1d1f] dark:text-white">
                        {response.value?.toString() ?? 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Survey Dialog */}
      <Dialog
        open={isSendSurveyOpen}
        onOpenChange={(open) => {
          if (open) {
            // Set default content when dialog opens
            const defaultSubject = `Fill out survey: ${selectedTemplate.name}`;
            const defaultBody = `Hello,

Please take a moment to fill out our survey. Your feedback is valuable to us.

Click the link below to access the survey:
https://atlas-ai.com/survey/example

Thank you for your time.`;
            setEmailSubject(defaultSubject);
            setEmailBody(defaultBody);
          } else {
            // Reset content when dialog closes
            setEmailToSend("");
            setEmailSubject("");
            setEmailBody("");
          }
          setIsSendSurveyOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Send Survey</DialogTitle>
            <DialogDescription>
              Send this survey to a patient or colleague
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={emailToSend}
                onChange={(e) => setEmailToSend(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={`Fill out survey: ${selectedTemplate.name}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[150px] font-normal focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                placeholder={`Hello,

Please take a moment to fill out our survey. Your feedback is valuable to us.

Click the link below to access the survey:
https://atlas-ai.com/survey/example

Thank you for your time.`}
              />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="font-medium">To: </span>
                  {emailToSend || "recipient@example.com"}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Subject: </span>
                  {emailSubject || `Fill out survey: ${selectedTemplate.name}`}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {emailBody || `Hello,

Please take a moment to fill out our survey. Your feedback is valuable to us.

Click the link below to access the survey:
https://atlas-ai.com/survey/example

Thank you for your time.`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsSendSurveyOpen(false);
                setEmailToSend("");
                setEmailSubject("");
                setEmailBody("");
              }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!emailToSend.trim()) {
                  toast({
                    title: "Email required",
                    description: "Please enter an email address to send the survey",
                    variant: "destructive",
                  });
                  return;
                }
                if (!emailSubject.trim()) {
                  toast({
                    title: "Subject required",
                    description: "Please enter an email subject",
                    variant: "destructive",
                  });
                  return;
                }
                if (!emailBody.trim()) {
                  toast({
                    title: "Body required",
                    description: "Please enter an email body",
                    variant: "destructive",
                  });
                  return;
                }

                // Here you would typically make an API call to send the survey
                console.log("Sending survey to:", emailToSend);
                toast({
                  title: "Survey sent",
                  description: `Survey has been sent to ${emailToSend}`,
                });
                setIsSendSurveyOpen(false);
                setEmailToSend("");
                setEmailSubject("");
                setEmailBody("");
              }}
              className="bg-[#73a9e9] hover:bg-[#5d8fd1] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Send Survey
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Survey Dialog */}
      <Dialog open={isEditSurveyOpen} onOpenChange={setIsEditSurveyOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Survey</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Survey Basic Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="surveyName" className="text-base font-medium">
                  Survey Name
                </Label>
                <Input
                  id="surveyName"
                  placeholder="Enter survey name"
                  value={surveyName}
                  onChange={(e) => setSurveyName(e.target.value)}
                  className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surveyDescription" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="surveyDescription"
                  placeholder="Enter survey description"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  className="w-full min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                />
              </div>
            </div>

            {/* Form Fields List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Survey Fields</h3>
              {formFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-[#86868b]" />
                        <h4 className="font-medium">{field.label}</h4>
                        {field.required && (
                          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded">
                            Required
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-[#e5e5ea] dark:bg-[#4a4a4c] rounded">
                          {field.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-[#86868b] mt-1">{field.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditField(field)}
                        className="h-8 w-8 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        title="Edit Field"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field.id)}
                        className="h-8 w-8 text-[#86868b] hover:text-red-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                        title="Remove Field"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Field Form */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Add New Field</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Field Type</Label>
                  <Select
                    value={selectedFieldType}
                    onValueChange={(value: FormField['type']) => {
                      setSelectedFieldType(value);
                      // Reset constraints when field type changes
                      setConstraints({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_text">Short Text</SelectItem>
                      <SelectItem value="long_text">Long Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="yes_no">Yes/No</SelectItem>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Field Label</Label>
                  <Input
                    placeholder="Enter field label"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Field Reference</Label>
                  <Input
                    placeholder="Enter field reference (e.g., patient_name, visit_date)"
                    value={newFieldReference}
                    onChange={(e) => setNewFieldReference(e.target.value)}
                  />
                  <p className="text-xs text-[#86868b]">Use lowercase with underscores (e.g., patient_name)</p>
                </div>

                <div className="grid gap-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    placeholder="Enter field description"
                    value={newFieldDescription}
                    onChange={(e) => setNewFieldDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={isRequired}
                    onCheckedChange={setIsRequired}
                  />
                  <Label htmlFor="required">Required Field</Label>
                </div>

                {/* Field Type Specific Constraints */}
                {selectedFieldType === 'short_text' && (
                  <div className="grid gap-2">
                    <Label>Maximum Length</Label>
                    <Input
                      type="number"
                      placeholder="Max length (max 999)"
                      value={constraints?.max_length ?? ''}
                      onChange={(e) => {
                        const value = Math.min(Math.max(Number(e.target.value), 1), 999);
                        setConstraints({ ...constraints ?? {}, max_length: value });
                      }}
                    />
                    <p className="text-xs text-[#86868b]">Maximum length: 1-999 characters</p>
                  </div>
                )}

                {selectedFieldType === 'number' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Minimum Value</Label>
                      <Input
                        type="number"
                        placeholder="Min value"
                        value={constraints?.min_value ?? ''}
                        onChange={(e) => setConstraints({ ...constraints ?? {}, min_value: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Maximum Value</Label>
                      <Input
                        type="number"
                        placeholder="Max value"
                        value={constraints?.max_value ?? ''}
                        onChange={(e) => setConstraints({ ...constraints ?? {}, max_value: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                {(selectedFieldType === 'multiple_choice' || selectedFieldType === 'dropdown') && (
                  <>
                    <div className="grid gap-2">
                      <Label>Options (minimum 2 choices, one per line)</Label>
                      <Textarea
                        placeholder="Enter options"
                        value={constraints?.options?.join('\n') ?? ''}
                        onChange={(e) => {
                          const options = e.target.value.split('\n').filter(opt => opt.trim());
                          setConstraints({
                            ...constraints ?? {},
                            options: options.length >= 2 ? options : constraints?.options
                          });
                        }}
                        className="min-h-[100px]"
                      />
                      {constraints?.options && constraints.options.length < 2 && (
                        <p className="text-sm text-red-500">Minimum 2 choices required</p>
                      )}
                    </div>

                    {selectedFieldType === 'multiple_choice' && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="allow_multiple"
                            checked={constraints?.allow_multiple ?? false}
                            onCheckedChange={(checked) => setConstraints({
                              ...constraints ?? {},
                              allow_multiple: checked
                            })}
                          />
                          <Label htmlFor="allow_multiple">Allow Multiple Selections</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="randomize"
                            checked={constraints?.randomize ?? false}
                            onCheckedChange={(checked) => setConstraints({
                              ...constraints ?? {},
                              randomize: checked
                            })}
                          />
                          <Label htmlFor="randomize">Randomize Choices</Label>
                        </div>
                      </div>
                    )}

                    {selectedFieldType === 'dropdown' && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="alphabetical_order"
                          checked={constraints?.alphabetical_order ?? false}
                          onCheckedChange={(checked) => setConstraints({
                            ...constraints ?? {},
                            alphabetical_order: checked
                          })}
                        />
                        <Label htmlFor="alphabetical_order">Display in Alphabetical Order</Label>
                      </div>
                    )}
                  </>
                )}

                {selectedFieldType === 'rating' && (
                  <div className="grid gap-2">
                    <Label>Steps (2-10)</Label>
                    <Input
                      type="number"
                      placeholder="Number of steps"
                      value={constraints?.steps ?? ''}
                      onChange={(e) => {
                        const value = Math.min(Math.max(Number(e.target.value), 2), 10);
                        setConstraints({ ...constraints ?? {}, steps: value });
                      }}
                    />
                    <p className="text-xs text-[#86868b]">Number of steps: 2-10</p>
                  </div>
                )}

                <Button
                  onClick={addNewField}
                  className="w-full bg-[#f5f5f7] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] rounded-lg h-10 text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={!newFieldLabel}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Field
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditSurveyOpen(false);
                // Reset form state
                setFormFields([]);
                setSurveyName("");
                setSurveyDescription("");
              }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Validate and save changes
                if (!surveyName.trim()) {
                  toast({
                    title: "Survey name required",
                    description: "Please enter a name for your survey",
                    variant: "destructive",
                  });
                  return;
                }

                // Here you would typically make an API call to update the survey
                toast({
                  title: "Survey updated",
                  description: "Your changes have been saved successfully",
                });
                setIsEditSurveyOpen(false);
              }}
              className="bg-[#73a9e9] hover:bg-[#5d8fd1] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={isEditFieldOpen} onOpenChange={setIsEditFieldOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Field Type</Label>
              <Select
                value={selectedFieldType}
                onValueChange={(value: FormField['type']) => {
                  setSelectedFieldType(value);
                  // Reset constraints when field type changes
                  setConstraints({});
                }}
              >
                <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short_text">Short Text</SelectItem>
                  <SelectItem value="long_text">Long Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="yes_no">Yes/No</SelectItem>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Field Label</Label>
              <Input
                placeholder="Enter field label"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid gap-2">
              <Label>Field Reference</Label>
              <Input
                placeholder="Enter field reference (e.g., patient_name, visit_date)"
                value={newFieldReference}
                onChange={(e) => setNewFieldReference(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-xs text-[#86868b]">Use lowercase with underscores (e.g., patient_name)</p>
            </div>

            <div className="grid gap-2">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="Enter field description"
                value={newFieldDescription}
                onChange={(e) => setNewFieldDescription(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={isRequired}
                onCheckedChange={setIsRequired}
              />
              <Label htmlFor="required">Required Field</Label>
            </div>

            {/* Field Type Specific Constraints */}
            {selectedFieldType === 'short_text' && (
              <div className="grid gap-2">
                <Label>Maximum Length</Label>
                <Input
                  type="number"
                  placeholder="Max length (max 999)"
                  value={constraints?.max_length ?? ''}
                  onChange={(e) => {
                    const value = Math.min(Math.max(Number(e.target.value), 1), 999);
                    setConstraints({ ...constraints ?? {}, max_length: value });
                  }}
                />
                <p className="text-xs text-[#86868b]">Maximum length: 1-999 characters</p>
              </div>
            )}

            {selectedFieldType === 'number' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Minimum Value</Label>
                  <Input
                    type="number"
                    placeholder="Min value"
                    value={constraints?.min_value ?? ''}
                    onChange={(e) => setConstraints({ ...constraints ?? {}, min_value: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Maximum Value</Label>
                  <Input
                    type="number"
                    placeholder="Max value"
                    value={constraints?.max_value ?? ''}
                    onChange={(e) => setConstraints({ ...constraints ?? {}, max_value: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {(selectedFieldType === 'multiple_choice' || selectedFieldType === 'dropdown') && (
              <>
                <div className="grid gap-2">
                  <Label>Options (minimum 2 choices, one per line)</Label>
                  <Textarea
                    placeholder="Enter options"
                    value={constraints?.options?.join('\n') ?? ''}
                    onChange={(e) => {
                      const options = e.target.value.split('\n').filter(opt => opt.trim());
                      setConstraints({
                        ...constraints ?? {},
                        options: options.length >= 2 ? options : constraints?.options
                      });
                    }}
                    className="min-h-[100px]"
                  />
                  {constraints?.options && constraints.options.length < 2 && (
                    <p className="text-sm text-red-500">Minimum 2 choices required</p>
                  )}
                </div>

                {selectedFieldType === 'multiple_choice' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow_multiple"
                        checked={constraints?.allow_multiple ?? false}
                        onCheckedChange={(checked) => setConstraints({
                          ...constraints ?? {},
                          allow_multiple: checked
                        })}
                      />
                      <Label htmlFor="allow_multiple">Allow Multiple Selections</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomize"
                        checked={constraints?.randomize ?? false}
                        onCheckedChange={(checked) => setConstraints({
                          ...constraints ?? {},
                          randomize: checked
                        })}
                      />
                      <Label htmlFor="randomize">Randomize Choices</Label>
                    </div>
                  </div>
                )}

                {selectedFieldType === 'dropdown' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alphabetical_order"
                      checked={constraints?.alphabetical_order ?? false}
                      onCheckedChange={(checked) => setConstraints({
                        ...constraints ?? {},
                        alphabetical_order: checked
                      })}
                    />
                    <Label htmlFor="alphabetical_order">Display in Alphabetical Order</Label>
                  </div>
                )}
              </>
            )}

            {selectedFieldType === 'rating' && (
              <div className="grid gap-2">
                <Label>Steps (2-10)</Label>
                <Input
                  type="number"
                  placeholder="Number of steps"
                  value={constraints?.steps ?? ''}
                  onChange={(e) => {
                    const value = Math.min(Math.max(Number(e.target.value), 2), 10);
                    setConstraints({ ...constraints ?? {}, steps: value });
                  }}
                />
                <p className="text-xs text-[#86868b]">Number of steps: 2-10</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditFieldOpen(false);
                  // Reset form state
                  setEditingField(null);
                  setSelectedFieldType('short_text');
                  setNewFieldLabel('');
                  setNewFieldReference('');
                  setNewFieldDescription('');
                  setIsRequired(false);
                  setConstraints({});
                }}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEditedField}
                disabled={!newFieldLabel.trim()}
                className="bg-[#73a9e9] hover:bg-[#5d8fd1] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Survey Confirmation Dialog */}
      <Dialog open={isDeleteSurveyOpen} onOpenChange={setIsDeleteSurveyOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Survey</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteSurveyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSurvey}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Survey
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </DoctorLayoutWrapper >
  )
} 