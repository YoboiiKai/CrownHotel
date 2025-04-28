"use client"

import { useState } from "react"
import ClientLayout from "@/Layouts/ClientLayout"
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
  Eye
} from "lucide-react"

export default function Feedback() {
  const [showNewFeedbackForm, setShowNewFeedbackForm] = useState(false)
  const [showEditFeedbackForm, setShowEditFeedbackForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    employeeName: "",
    serviceType: "room_service",
    rating: 5,
    comment: "",
    anonymous: false
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  
  // Sample employee data for dropdown
  const employees = [
    { id: 1, name: "John Smith", department: "Room Service" },
    { id: 2, name: "Maria Garcia", department: "Front Desk" },
    { id: 3, name: "David Chen", department: "Restaurant" },
    { id: 4, name: "Sarah Johnson", department: "Housekeeping" },
    { id: 5, name: "Michael Brown", department: "Concierge" }
  ]
  
  // Service types
  const serviceTypes = [
    { id: "room_service", name: "Room Service" },
    { id: "housekeeping", name: "Housekeeping" },
    { id: "restaurant", name: "Restaurant" },
    { id: "front_desk", name: "Front Desk" },
    { id: "concierge", name: "Concierge" },
    { id: "spa", name: "Spa & Wellness" },
    { id: "other", name: "Other Services" }
  ]
  
  // Sample feedback data
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      employeeName: "John Smith",
      employeeId: 1,
      serviceType: "room_service",
      rating: 5,
      comment: "Excellent service! John was very professional and attentive to our needs.",
      anonymous: false,
      createdAt: "2025-03-15T14:30:00",
      status: "published"
    },
    {
      id: 2,
      employeeName: "Maria Garcia",
      employeeId: 2,
      serviceType: "front_desk",
      rating: 4,
      comment: "Very helpful at check-in, made us feel welcome.",
      anonymous: true,
      createdAt: "2025-03-14T09:15:00",
      status: "published"
    },
    {
      id: 3,
      employeeName: "David Chen",
      employeeId: 3,
      serviceType: "restaurant",
      rating: 3,
      comment: "Food was great but service was a bit slow during peak hours.",
      anonymous: false,
      createdAt: "2025-03-10T19:45:00",
      status: "published"
    }
  ])

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
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id))
  }

  // Filter feedbacks based on category and search query
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesCategory = filterCategory === "all" || feedback.serviceType === filterCategory
    const matchesSearch =
      feedback.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceTypes.find(s => s.id === feedback.serviceType)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
    
    // Employee validation
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Please select an employee"
    }
    
    // Comment validation
    if (!formData.comment.trim()) {
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
      const selectedEmployee = employees.find(emp => emp.name === formData.employeeName)
      
      const newFeedback = {
        id: feedbacks.length + 1,
        employeeName: formData.employeeName,
        employeeId: selectedEmployee?.id || null,
        serviceType: formData.serviceType,
        rating: formData.rating,
        comment: formData.comment,
        anonymous: formData.anonymous,
        createdAt: new Date().toISOString(),
        status: "published"
      }
      setFeedbacks([...feedbacks, newFeedback])
      setFormData({ 
        employeeName: "", 
        serviceType: "room_service", 
        rating: 5, 
        comment: "", 
        anonymous: false 
      })
      setShowNewFeedbackForm(false)
    }
  }

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-amber-500 text-amber-500" />)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Feedback</h1>
          <p className="text-gray-600">Share your experience with our staff and help us improve our services.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Feedback Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-amber-500" />
                  Submit New Feedback
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Employee Selection */}
                  <div>
                    <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Name*
                    </label>
                    <select
                      id="employeeName"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${
                        errors.employeeName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200`}
                    >
                      <option value="">Select an employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.name}>
                          {employee.name} - {employee.department}
                        </option>
                      ))}
                    </select>
                    {errors.employeeName && <p className="mt-1 text-xs text-red-600">{errors.employeeName}</p>}
                  </div>
                  
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
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
                                ? 'fill-amber-500 text-amber-500' 
                                : 'text-gray-300'
                            } hover:fill-amber-400 hover:text-amber-400 transition-colors`}
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
                      } px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200`}
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
                      className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                      Submit anonymously
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - Feedback History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5 text-amber-500" />
                  Your Previous Feedback
                </h2>
                
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
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span>Filter</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                        <div className="p-2">
                          <button
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                            onClick={() => setFilterCategory("all")}
                          >
                            All Services
                          </button>
                          {serviceTypes.map((service) => (
                            <button
                              key={service.id}
                              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
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
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setFilterCategory("all")}
                  >
                    All Services
                  </button>
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === service.id ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setFilterCategory(service.id)}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
                
                {/* Feedback Cards */}
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
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                              {feedback.anonymous ? "A" : feedback.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {feedback.anonymous ? "Anonymous" : feedback.employeeName}
                              </h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                {renderStarRating(feedback.rating)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">{calculateDaysSince(feedback.createdAt)}</span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {serviceTypes.find(s => s.id === feedback.serviceType)?.name}
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
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
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
                </div>
                
                {filteredFeedbacks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-amber-100 p-3 mb-4">
                      <MessageSquare className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback found</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      There is no feedback matching your current filters or you haven't submitted any feedback yet.
                    </p>
                    <button
                      onClick={() => {
                        setFilterCategory("all")
                        setSearchQuery("")
                      }}
                      className="text-sm font-medium text-amber-600 hover:text-amber-800"
                    >
                      Clear filters
                    </button>
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
                <h3 className="text-xl font-bold text-gray-900">Feedback Details</h3>
                <button onClick={() => setShowFeedbackDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xl">
                    {showFeedbackDetails.anonymous ? "A" : showFeedbackDetails.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {showFeedbackDetails.anonymous ? "Anonymous Feedback" : showFeedbackDetails.employeeName}
                    </h4>
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
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
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