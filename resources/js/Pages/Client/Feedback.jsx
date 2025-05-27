"use client"

import { useState, useEffect } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
import { router } from "@inertiajs/react"
import axios from "axios"
import {
  Users,
  User,
  Mail,
  Phone,
  Star,
  StarHalf,
  MessageSquare,
  X,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash,
  Calendar,
  Clock,
  Check,
  Send,
  ThumbsUp,
  Award,
  Eye,
  Loader2
} from "lucide-react"

export default function Feedback() {
  const [showNewFeedbackForm, setShowNewFeedbackForm] = useState(false)
  const [showEditFeedbackForm, setShowEditFeedbackForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    feedbackType: "employee", 
    employeeName: "",
    serviceType: "room_service",
    rating: 5,
    comment: "",
    anonymous: false
  })

  const [errors, setErrors] = useState({})
  const [employees, setEmployees] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  
  // Fetch employees from the database
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        // Using the task-employees endpoint which is specifically designed for dropdown lists
        const response = await axios.get('/api/task-employees');
        if (response.data && response.data.employees) {
          setEmployees(response.data.employees);
          console.log('Employees loaded:', response.data.employees);
        } else {
          console.warn('Employee data format unexpected:', response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [])
  
  const serviceTypes = [
    { id: "room_service", name: "Room Service" },
    { id: "housekeeping", name: "Housekeeping" },
    { id: "restaurant", name: "Restaurant" },
    { id: "front_desk", name: "Front Desk" },
    { id: "concierge", name: "Concierge" },
    { id: "spa", name: "Spa & Wellness" },
    { id: "other", name: "Other Services" }
  ]

  const [feedbacks, setFeedbacks] = useState([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  
  // Fetch feedback data from the API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoadingFeedback(true);
      try {
        console.log('Fetching feedback data...');
        const response = await axios.get('/api/feedback');
        console.log('API Response:', response);
        
        if (response.data && response.data.success) {
          setFeedbacks(response.data.feedbacks);
          console.log('Feedback loaded successfully:', response.data.feedbacks);
          
          // Check if there are any hotel service feedbacks
          const hotelServiceFeedbacks = response.data.feedbacks.filter(f => f.feedback_type === 'hotel_service');
          console.log('Hotel service feedbacks:', hotelServiceFeedbacks);
        } else {
          console.warn('Feedback data format unexpected:', response.data);
          // If no data is returned, add a temporary hotel service feedback for testing
          setFeedbacks([
            {
              id: 999,
              feedback_type: 'hotel_service',
              employee_name: '',
              employee_id: null,
              service_type: 'restaurant',
              rating: 4,
              comment: 'This is a test hotel service feedback to verify display functionality.',
              anonymous: false,
              created_at: new Date().toISOString(),
              status: 'published',
              user_id: 1
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        
        // Add a temporary feedback for testing if API fails
        setFeedbacks([
          {
            id: 999,
            feedback_type: 'hotel_service',
            employee_name: '',
            employee_id: null,
            service_type: 'restaurant',
            rating: 4,
            comment: 'This is a test hotel service feedback to verify display functionality.',
            anonymous: false,
            created_at: new Date().toISOString(),
            status: 'published',
            user_id: 1
          }
        ]);
      } finally {
        setIsLoadingFeedback(false);
      }
    };

    fetchFeedbacks();
  }, [])

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Calculate days since feedback was submitted
  const calculateDaysSince = (createdAt) => {
    const start = new Date(createdAt)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays < 1 
      ? "Today" 
      : diffDays < 2
        ? "Yesterday"
        : `${Math.floor(diffDays)} days ago`
  }

  // Delete feedback
  const deleteFeedback = (id) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      axios.delete(`/api/feedback/${id}`)
        .then(response => {
          if (response.data.success) {
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
          }
        })
        .catch(error => {
          console.error('Error deleting feedback:', error);
          alert('Failed to delete feedback. Please try again.');
        });
    }
  }

  // Function to normalize feedback data from backend (snake_case) to frontend (camelCase)
  const normalizeFeedback = (feedback) => {
    // If the feedback already has camelCase properties, return it as is
    if (feedback.feedbackType) return feedback;
    
    // Convert snake_case to camelCase
    return {
      id: feedback.id,
      feedbackType: feedback.feedback_type,
      employeeName: feedback.employee_name,
      employeeId: feedback.employee_id,
      serviceType: feedback.service_type,
      rating: feedback.rating,
      comment: feedback.comment,
      anonymous: feedback.anonymous,
      createdAt: feedback.created_at,
      status: feedback.status,
      userId: feedback.user_id
    };
  };
  
  // Normalize all feedbacks
  const normalizedFeedbacks = feedbacks.map(normalizeFeedback);
  
  // Filter feedbacks based on category and search query
  const filteredFeedbacks = normalizedFeedbacks.filter((feedback) => {
    // Check if feedback type matches (all, employee, or hotel_service)
    const matchesFeedbackType = 
      filterCategory === "all" || 
      (filterCategory === "employee" && feedback.feedbackType === "employee") ||
      (filterCategory === "hotel_service" && feedback.feedbackType === "hotel_service") ||
      (feedback.feedbackType === "employee" && feedback.serviceType === filterCategory);
    
    // Check if search query matches
    const matchesSearchQuery =
      searchQuery === "" ||
      (feedback.comment && feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (feedback.employeeName && feedback.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFeedbackType && matchesSearchQuery;
  })

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Validate feedback type
    if (!['employee', 'hotel_service'].includes(formData.feedbackType)) {
      newErrors.feedbackType = "Please select a valid feedback type"
    }
    
    // Employee validation (only if feedback type is employee)
    if (formData.feedbackType === "employee" && !formData.employeeName?.trim()) {
      newErrors.employeeName = "Please select an employee"
    }
    
    // Service type validation
    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service type"
    }
    
    // Rating validation
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please provide a rating between 1 and 5"
    }
    
    // Comment validation
    if (!formData.comment?.trim()) {
      newErrors.comment = "Please provide feedback comments"
    } else if (formData.comment.length < 10) {
      newErrors.comment = "Feedback must be at least 10 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitSuccess(false);
      
      const selectedEmployee = formData.feedbackType === "employee" 
        ? employees.find(emp => (emp.name === formData.employeeName) || (emp.employee_name === formData.employeeName))
        : null;
      
      const feedbackData = {
        feedbackType: formData.feedbackType,
        employeeName: formData.feedbackType === "employee" ? (formData.employeeName || "") : "",
        employeeId: selectedEmployee?.id || null,
        serviceType: formData.serviceType,
        rating: parseInt(formData.rating, 10),
        comment: formData.comment,
        anonymous: Boolean(formData.anonymous)
      };
      
      // Send feedback to the server
      axios.post('/api/feedback', feedbackData)
        .then(response => {
          if (response.data.success) {
            // Add the new feedback to the state
            const newFeedback = response.data.feedback;
            setFeedbacks([...feedbacks, newFeedback]);
            
            // Reset form
            setFormData({ 
              feedbackType: "employee",
              employeeName: "", 
              serviceType: "room_service", 
              rating: 5, 
              comment: "", 
              anonymous: false 
            });
            
            setSubmitSuccess(true);
            
            // Close form after a delay
            setTimeout(() => {
              setShowNewFeedbackForm(false);
              setSubmitSuccess(false);
            }, 2000);
          }
        })
        .catch(error => {
          console.error('Error submitting feedback:', error);
          if (error.response && error.response.data) {
            if (error.response.data.errors) {
              // Format Laravel validation errors for display
              const formattedErrors = {};
              for (const field in error.response.data.errors) {
                formattedErrors[field] = error.response.data.errors[field][0];
              }
              setErrors(formattedErrors);
            } else if (error.response.data.message) {
              setErrors({ general: error.response.data.message });
            } else {
              setErrors({ general: 'Failed to submit feedback. Please try again.' });
            }
          } else {
            setErrors({ general: 'Failed to submit feedback. Please try again.' });
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-[#A67C52] text-[#A67C52]" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-[#A67C52] text-[#A67C52]" />)
    }
    
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />)
    }
    
    return stars
  }

  return (
    <ClientLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5D3A1F] mb-2">Hotel Feedback</h1>
          <p className="text-[#6B4226]/80">Share your experience with our staff and services to help us improve your stay.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Feedback Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-[#DEB887]/20 overflow-hidden">
              {/* Luxurious Header - matching the system-wide pattern */}
              <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] p-4 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DEB887]/80 to-[#A67C52]/80 flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Submit Your Feedback
                  </h2>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10 blur-2xl"></div>
              </div>
              <div className="p-6 bg-gradient-to-b from-[#F5EFE7]/50 to-white">
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Feedback Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What would you like to give feedback on?*
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, feedbackType: "employee"})}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 ${formData.feedbackType === "employee" 
                          ? 'border-[#A67C52] bg-[#F5EFE7]' 
                          : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-[#F5EFE7]'}`}
                      >
                        <User className={`h-8 w-8 mb-2 ${formData.feedbackType === "employee" ? 'text-[#A67C52]' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.feedbackType === "employee" ? 'text-[#6B4226]' : 'text-gray-700'}`}>Employee Feedback</span>
                        <span className="text-xs text-gray-500 mt-1">Rate and comment on our staff</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, feedbackType: "hotel_service"})}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 ${formData.feedbackType === "hotel_service" 
                          ? 'border-[#A67C52] bg-[#F5EFE7]' 
                          : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-[#F5EFE7]'}`}
                      >
                        <Award className={`h-8 w-8 mb-2 ${formData.feedbackType === "hotel_service" ? 'text-[#A67C52]' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.feedbackType === "hotel_service" ? 'text-[#6B4226]' : 'text-gray-700'}`}>Hotel Service Feedback</span>
                        <span className="text-xs text-gray-500 mt-1">Rate our facilities and services</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Employee Selection - Only shown for employee feedback */}
                  {formData.feedbackType === "employee" && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                          Employee Name*
                        </label>
                        {isLoadingEmployees && (
                          <div className="flex items-center text-xs text-[#A67C52]">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            <span>Loading...</span>
                          </div>
                        )}
                      </div>
                      <select
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                        disabled={isLoadingEmployees}
                        className={`w-full rounded-lg border ${
                          errors.employeeName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        } px-3 py-2 text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30 ${
                          isLoadingEmployees ? 'cursor-wait opacity-70' : ''
                        }`}
                      >
                        <option value="">{isLoadingEmployees ? 'Loading employees...' : 'Select an employee'}</option>
                        {!isLoadingEmployees && employees.length > 0 ? (
                          employees.map((employee) => (
                            <option key={employee.id} value={employee.name || employee.employee_name}>
                              {employee.name || employee.employee_name} - {employee.department || employee.role || employee.position || 'Staff'}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No employees found</option>
                        )}
                      </select>
                      {errors.employeeName && <p className="mt-1 text-xs text-red-600">{errors.employeeName}</p>}
                    </div>
                  )}
                  
                  {/* Service Type */}
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type*
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30"
                    >
                      {serviceTypes.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating*
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-8 w-8 ${
                              formData.rating >= star 
                                ? 'fill-[#A67C52] text-[#A67C52]' 
                                : 'text-gray-300'
                            } hover:fill-[#DEB887] hover:text-[#DEB887] transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback*
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      value={formData.comment}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${
                        errors.comment ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } px-3 py-2 text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30`}
                      placeholder="Please share your experience with our staff member..."
                    ></textarea>
                    {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment}</p>}
                  </div>
                  
                  {/* Anonymous Option */}
                  <div className="flex items-center">
                    <input
                      id="anonymous"
                      name="anonymous"
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-[#8B5A2B] focus:ring-[#A67C52]"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                      Submit anonymously
                    </label>
                  </div>
                  
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {errors.general}
                    </div>
                  )}
                  
                  {/* Success Message */}
                  {submitSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Feedback submitted successfully!</span>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - Feedback History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-[#DEB887]/20 overflow-hidden">
              {/* Luxurious Header - matching the system-wide pattern */}
              <div className="bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] p-4 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DEB887]/80 to-[#A67C52]/80 flex items-center justify-center shadow-lg">
                    <ThumbsUp className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Your Previous Feedback
                  </h2>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10 blur-2xl"></div>
              </div>
              <div className="p-6 bg-gradient-to-b from-[#F5EFE7]/50 to-white">
                <p className="text-[#6B4226]/80 text-sm mb-4">View and manage the feedback you've submitted during your stay with us.</p>
                
                {/* Feedback Type Filter */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Show:</span>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFilterCategory("all")}
                      className={`px-3 py-1.5 text-sm font-medium ${filterCategory === "all" 
                        ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' 
                        : 'bg-white text-gray-700 hover:bg-[#F5EFE7]'}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCategory("employee")
                        setSearchQuery("")
                      }}
                      className={`px-3 py-1.5 text-sm font-medium ${filterCategory === "employee" 
                        ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' 
                        : 'bg-white text-gray-700 hover:bg-[#F5EFE7]'}`}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCategory("hotel_service")
                        setSearchQuery("")
                      }}
                      className={`px-3 py-1.5 text-sm font-medium ${filterCategory === "hotel_service" 
                        ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' 
                        : 'bg-white text-gray-700 hover:bg-[#F5EFE7]'}`}
                    >
                      Hotel Service
                    </button>
                  </div>
                </div>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#DEB887] transition-all"
                      />
                    </div>
                    <div className="relative">
                      <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#DEB887] transition-all">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span>Filter</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                        <div className="p-2">
                          <button
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                            onClick={() => setFilterCategory("all")}
                          >
                            All Services
                          </button>
                          {serviceTypes.map((service) => (
                            <button
                              key={service.id}
                              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                              onClick={() => setFilterCategory(service.id)}
                            >
                              {service.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200 mb-6 pb-1 scrollbar-hide">
                  <button
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setFilterCategory("all")}
                  >
                    All Services
                  </button>
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === service.id ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setFilterCategory(service.id)}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
                
                {/* Loading State */}
                {isLoadingFeedback && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[#8B5A2B] animate-spin mb-4" />
                    <p className="text-sm text-gray-500">Loading your feedback...</p>
                  </div>
                )}
                
                {/* Feedback Cards */}
                {!isLoadingFeedback && (
                  <div className="space-y-4">
                    {filteredFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="p-5">
                        {/* Feedback Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#A67C52]/20 to-[#DEB887]/20 border border-[#DEB887]/30 flex items-center justify-center text-[#6B4226] font-semibold text-sm shadow-sm">
                              {feedback.feedbackType === "hotel_service" 
                                ? <Award className="h-5 w-5 text-[#6B4226]" /> 
                                : (feedback.anonymous ? "A" : (feedback.employeeName ? feedback.employeeName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"))}
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-[#5D3A1F] flex items-center gap-1.5">
                                {feedback.feedbackType === "hotel_service" 
                                  ? (
                                    <>
                                      <span>{serviceTypes.find(s => s.id === feedback.serviceType)?.name}</span>
                                      <span className="inline-flex items-center rounded-full bg-[#A67C52]/10 px-2 py-0.5 text-xs font-medium text-[#8B5A2B]">Service</span>
                                    </>
                                  )
                                  : (
                                    <>
                                      <span>{feedback.anonymous ? "Anonymous" : (feedback.employeeName || "Unknown Employee")}</span>
                                      <span className="inline-flex items-center rounded-full bg-[#A67C52]/10 px-2 py-0.5 text-xs font-medium text-[#8B5A2B]">Employee</span>
                                    </>
                                  )}
                              </h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                {renderStarRating(feedback.rating)}
                                <span className="text-xs text-[#6B4226]/70 ml-1">{feedback.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">{calculateDaysSince(feedback.createdAt)}</span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {feedback.feedbackType === "employee" 
                                ? serviceTypes.find(s => s.id === feedback.serviceType)?.name
                                : <span className="inline-flex items-center rounded-full bg-[#A67C52]/10 px-2 py-0.5 text-xs font-medium text-[#5D3A1F]">Hotel Service</span>}
                            </span>
                          </div>
                        </div>
                        
                        {/* Feedback Content */}
                        <div className="mb-3">
                          <p className="text-gray-700 text-sm">{feedback.comment}</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => setShowFeedbackDetails(feedback)}
                            className="flex items-center gap-1 rounded-lg bg-[#F5EFE7] px-3 py-1.5 text-xs font-medium text-[#6B4226] hover:bg-[#A67C52]/10 focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => deleteFeedback(feedback.id)}
                            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredFeedbacks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-[#A67C52]/10 p-3 mb-4">
                        <MessageSquare className="h-6 w-6 text-[#8B5A2B]" />
                      </div>
                      <h3 className="text-lg font-medium text-[#5D3A1F] mb-1">No feedback found</h3>
                      <p className="text-sm text-gray-500 mb-4 text-center">
                        You haven't submitted any feedback yet or there is no feedback matching your current filters.
                      </p>
                      <button
                        onClick={() => {
                          setFilterCategory("all")
                          setSearchQuery("")
                        }}
                        className="text-sm font-medium text-[#8B5A2B] hover:text-[#5D3A1F]"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Details Modal */}
      {showFeedbackDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B]">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#5D3A1F]">Your Feedback Details</h3>
                </div>
                <button onClick={() => setShowFeedbackDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Feedback Info */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#A67C52]/10 flex items-center justify-center text-[#6B4226] font-semibold text-xl">
                    {showFeedbackDetails.feedbackType === "hotel_service" 
                      ? <Award className="h-8 w-8 text-[#6B4226]" />
                      : (showFeedbackDetails.anonymous ? "A" : (showFeedbackDetails.employeeName ? showFeedbackDetails.employeeName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {showFeedbackDetails.feedbackType === "hotel_service" 
                          ? "Hotel Service Feedback"
                          : (showFeedbackDetails.anonymous ? "Anonymous Feedback" : (showFeedbackDetails.employeeName || "Unknown Employee"))}
                      </h4>
                      <span className="inline-flex items-center rounded-full bg-[#A67C52]/10 px-2 py-0.5 text-xs font-medium text-[#5D3A1F]">
                        {showFeedbackDetails.feedbackType === "employee" ? "Employee" : "Hotel Service"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {serviceTypes.find(s => s.id === showFeedbackDetails.serviceType)?.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStarRating(showFeedbackDetails.rating)}
                      <span className="ml-1 text-sm text-gray-700">{showFeedbackDetails.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                {/* Feedback Content */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Your Feedback:</h5>
                  <p className="text-gray-700">{showFeedbackDetails.comment}</p>
                </div>
                
                {/* Submission Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Submitted on {formatDate(showFeedbackDetails.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Status: Published</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowFeedbackDetails(null)}
                    className="rounded-lg bg-[#F5EFE7] px-4 py-2 text-sm font-medium text-[#6B4226] hover:bg-[#A67C52]/10 focus:outline-none focus:ring-2 focus:ring-[#DEB887]/30 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  )
}