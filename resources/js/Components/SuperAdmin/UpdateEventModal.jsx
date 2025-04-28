import { useState, useRef, useEffect } from "react"
import { X, Upload, Calendar, Clock, Users, MapPin, CreditCard, FileText } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function UpdateEventModal({ show, onClose, onSubmit, event }) {
  const [formData, setFormData] = useState({
    clientName: "",
    eventType: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    guestCount: "",
    contactNumber: "",
    email: "",
    specialRequests: "",
    packageType: "",
    totalAmount: "",
    depositAmount: ""
  });

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false)
  const [showVenueDropdown, setShowVenueDropdown] = useState(false)
  const [showPackageTypeDropdown, setShowPackageTypeDropdown] = useState(false)
  const eventTypeDropdownRef = useRef(null)
  const venueDropdownRef = useRef(null)
  const packageTypeDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (eventTypeDropdownRef.current && !eventTypeDropdownRef.current.contains(event.target)) {
        setShowEventTypeDropdown(false)
      }
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
        setShowVenueDropdown(false)
      }
      if (packageTypeDropdownRef.current && !packageTypeDropdownRef.current.contains(event.target)) {
        setShowPackageTypeDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load event data when modal opens or event changes
  useEffect(() => {
    if (show && event) {
      // Initialize form with event data
      resetForm();
    }
  }, [show, event]);
  
  // Focus on first input when modal opens
  useEffect(() => {
    if (show && event) {
      const timer = setTimeout(() => {
        document.getElementById('clientName')?.focus();
      }, 100);
      return () => clearTimeout(timer)
    }
  }, [show]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {}
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }
    if (!formData.eventType.trim()) {
      newErrors.eventType = "Event type is required"
    }
    if (!formData.date.trim()) {
      newErrors.date = "Date is required"
    }
    if (!formData.startTime.trim()) {
      newErrors.startTime = "Start time is required"
    }
    if (!formData.endTime.trim()) {
      newErrors.endTime = "End time is required"
    }
    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required"
    }
    if (!formData.guestCount.trim()) {
      newErrors.guestCount = "Guest count is required"
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.packageType.trim()) {
      newErrors.packageType = "Package type is required"
    }
    if (!formData.totalAmount.trim()) {
      newErrors.totalAmount = "Total amount is required"
    }
    if (!formData.depositAmount.trim()) {
      newErrors.depositAmount = "Deposit amount is required"
    }
    return newErrors
  }
  
  // Reset form to initial state or current event data
  // Helper function to format date from ISO to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      // Handle ISO date format (2025-04-20T00:00:00.000000Z)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date
      
      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };
  
  const resetForm = () => {
    if (event) {
      try {
        // Handle both camelCase and snake_case property names for API compatibility
        // Make sure we're getting the values, with fallbacks in case of undefined
        const formValues = {
          clientName: event.client_name || event.clientName || "",
          eventType: event.event_type || event.eventType || "",
          date: formatDateForInput(event.date || ""),
          startTime: event.start_time || event.startTime || "",
          endTime: event.end_time || event.endTime || "",
          venue: event.venue || "",
          guestCount: String(event.guest_count || event.guestCount || ""),
          contactNumber: event.contact_number || event.contactNumber || "",
          email: event.email || "",
          specialRequests: event.special_requests || event.specialRequests || "",
          packageType: event.package_type || event.packageType || "",
          totalAmount: String(event.total_amount || event.totalAmount || ""),
          depositAmount: String(event.deposit_amount || event.depositAmount || "")
        };
        
        console.log("Setting form data to:", formValues);
        setFormData(formValues);
        // Clear any previous errors
        setErrors({});
      } catch (error) {
        console.error("Error resetting form:", error);
        toast.error("Error loading event data. Please try again.");
      }
    } else {
      setFormData({
        clientName: "",
        eventType: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        guestCount: "",
        contactNumber: "",
        email: "",
        specialRequests: "",
        packageType: "",
        totalAmount: "",
        depositAmount: ""
      });
    }
    
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fix the errors in the form.")
      return
    }
    
    setIsSubmitting(true)
    
    // Create FormData object for file upload
    const formDataToSend = new FormData()
    formDataToSend.append("_method", "PUT") // Laravel method spoofing for PUT requests
    formDataToSend.append("id", event.id)
    formDataToSend.append("clientName", formData.clientName)
    formDataToSend.append("eventType", formData.eventType)
    formDataToSend.append("date", formData.date)
    formDataToSend.append("startTime", formData.startTime)
    formDataToSend.append("endTime", formData.endTime)
    formDataToSend.append("venue", formData.venue)
    formDataToSend.append("guestCount", formData.guestCount)
    formDataToSend.append("contactNumber", formData.contactNumber)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("specialRequests", formData.specialRequests)
    formDataToSend.append("packageType", formData.packageType)
    formDataToSend.append("totalAmount", formData.totalAmount)
    formDataToSend.append("depositAmount", formData.depositAmount)

    // Reset the form before making the API call to ensure the parent component gets the latest data
    const currentFormData = {...formData}
    
    // Submit form to backend using axios
    axios.post(`/api/events/${event.id}`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        toast.success("Event updated successfully!")
        // Call onSubmit with the response data
        if (onSubmit) {
          onSubmit(response.data)
        }
        // Close modal
        if (typeof onClose === 'function') {
          onClose()
        }
      })
      .catch(error => {
        console.error("Error updating event:", error)
        
        if (error.response && error.response.data && error.response.data.errors) {
          // Handle validation errors from Laravel
          const serverErrors = error.response.data.errors;
          const formattedErrors = {};
          
          // Convert snake_case error keys to camelCase for frontend
          Object.keys(serverErrors).forEach((key) => {
            // Convert snake_case to camelCase (e.g., client_name to clientName)
            const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            formattedErrors[camelKey] = serverErrors[key][0];
          });
          
          setErrors(formattedErrors)
          toast.error("Please fix the errors in the form.")
        } else if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to update event. Please try again.")
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      });
  };

  // Return null if modal is not shown
  if (!show) return null;

  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Event</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <h4 className="text-xs font-medium text-gray-800 mb-1.5">Event Information</h4>
              <p className="text-xs text-gray-500">Update the event with the following details.</p>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                {/* Client Information */}
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-900 border-b border-gray-200 pb-1.5 mb-3">Client Information</h4>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="clientName" className={labelClasses}>
                        Client Name *
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="clientName" 
                          name="clientName" 
                          value={formData.clientName} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="Full name"
                        />
                      </div>
                      {errors.clientName && <p className={errorClasses}>{errors.clientName}</p>}
                    </div>
                  
                    <div>
                      <label htmlFor="eventType" className={labelClasses}>
                        Event Type *
                      </label>
                      <div className="relative" ref={eventTypeDropdownRef}>
                        <div 
                          className={`${inputClasses} cursor-pointer flex items-center justify-between`}
                          onClick={() => setShowEventTypeDropdown(!showEventTypeDropdown)}
                        >
                          <span className={formData.eventType ? "text-gray-700" : "text-gray-400"}>
                            {formData.eventType ? 
                              formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1).replace(/([A-Z])/g, ' $1') : 
                              "Select event type"}
                          </span>
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        
                        {showEventTypeDropdown && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                            <div className="py-1">
                              {[
                                { value: "wedding", label: "Wedding" },
                                { value: "corporate", label: "Corporate Event" },
                                { value: "birthday", label: "Birthday Party" },
                                { value: "conference", label: "Conference" },
                                { value: "charity", label: "Charity Event" },
                                { value: "social", label: "Social Gathering" },
                                { value: "other", label: "Other" }
                              ].map((option) => (
                                <div
                                  key={option.value}
                                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                    formData.eventType === option.value 
                                      ? "bg-amber-50 text-amber-600"
                                      : "text-gray-700"
                                  }`}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      eventType: option.value
                                    })
                                    setShowEventTypeDropdown(false)
                                    if (errors.eventType) {
                                      setErrors({
                                        ...errors,
                                        eventType: ""
                                      })
                                    }
                                  }}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {errors.eventType && <p className={errorClasses}>{errors.eventType}</p>}
                      </div>
                    </div>
                  
                    <div>
                      <label htmlFor="contactNumber" className={labelClasses}>
                        Contact Number *
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="contactNumber" 
                          name="contactNumber" 
                          value={formData.contactNumber} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="Phone number"
                        />
                      </div>
                      {errors.contactNumber && <p className={errorClasses}>{errors.contactNumber}</p>}
                    </div>
                  
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email *
                      </label>
                      <div className="relative">
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="Email address"
                        />
                      </div>
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="mb-6 mt-6">
                  <h4 className="text-xs font-medium text-gray-900 border-b border-gray-200 pb-1.5 mb-3">Event Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                    <div>
                      <label htmlFor="date" className={labelClasses}>
                        Event Date *
                      </label>
                      <div className="relative">
                        <input 
                          type="date" 
                          id="date" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                        />
                      </div>
                      {errors.date && <p className={errorClasses}>{errors.date}</p>}
                    </div>
                
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="startTime" className={labelClasses}>
                          Start Time *
                        </label>
                        <div className="relative">
                          <input 
                            type="time" 
                            id="startTime" 
                            name="startTime" 
                            value={formData.startTime} 
                            onChange={handleInputChange} 
                            className={inputClasses}
                          />
                        </div>
                        {errors.startTime && <p className={errorClasses}>{errors.startTime}</p>}
                      </div>
                      <div>
                        <label htmlFor="endTime" className={labelClasses}>
                          End Time *
                        </label>
                        <div className="relative">
                          <input 
                            type="time" 
                            id="endTime" 
                            name="endTime" 
                            value={formData.endTime} 
                            onChange={handleInputChange} 
                            className={inputClasses}
                          />
                        </div>
                        {errors.endTime && <p className={errorClasses}>{errors.endTime}</p>}
                      </div>
                    </div>
                
                    <div>
                      <label htmlFor="venue" className={labelClasses}>
                        Venue *
                      </label>
                      <div className="relative" ref={venueDropdownRef}>
                        <div 
                          className={`${inputClasses} cursor-pointer flex items-center justify-between`}
                          onClick={() => setShowVenueDropdown(!showVenueDropdown)}
                        >
                          <span className={formData.venue ? "text-gray-700" : "text-gray-400"}>
                            {formData.venue || "Select venue"}
                          </span>
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        
                        {showVenueDropdown && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                            <div className="py-1">
                              {[
                                { value: "Grand Ballroom", label: "Grand Ballroom" },
                                { value: "Conference Hall A", label: "Conference Hall A" },
                                { value: "Conference Hall B", label: "Conference Hall B" },
                                { value: "Terrace Garden", label: "Terrace Garden" },
                                { value: "Lakeside Pavilion", label: "Lakeside Pavilion" },
                                { value: "Executive Lounge", label: "Executive Lounge" }
                              ].map((option) => (
                                <div
                                  key={option.value}
                                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                    formData.venue === option.value 
                                      ? "bg-amber-50 text-amber-600"
                                      : "text-gray-700"
                                  }`}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      venue: option.value
                                    })
                                    setShowVenueDropdown(false)
                                    if (errors.venue) {
                                      setErrors({
                                        ...errors,
                                        venue: ""
                                      })
                                    }
                                  }}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {errors.venue && <p className={errorClasses}>{errors.venue}</p>}
                      </div>
                    </div>
                
                    <div>
                      <label htmlFor="guestCount" className={labelClasses}>
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          id="guestCount" 
                          name="guestCount" 
                          min="1" 
                          value={formData.guestCount} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="Number of guests"
                        />
                      </div>
                      {errors.guestCount && <p className={errorClasses}>{errors.guestCount}</p>}
                    </div>
                  

                    <div className="col-span-2">
                      <label htmlFor="specialRequests" className={labelClasses}>
                        Special Requests
                      </label>
                      <div className="relative">
                        <textarea 
                          id="specialRequests" 
                          name="specialRequests" 
                          value={formData.specialRequests} 
                          onChange={handleInputChange} 
                          rows="3" 
                          className={inputClasses}
                          placeholder="Any special requests or notes"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Package and Payment */}
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-900 border-b border-gray-200 pb-1.5 mb-3">Package and Payment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="packageType" className={labelClasses}>
                        Package Type *
                      </label>
                      <div className="relative" ref={packageTypeDropdownRef}>
                        <div 
                          className={`${inputClasses} cursor-pointer flex items-center justify-between`}
                          onClick={() => setShowPackageTypeDropdown(!showPackageTypeDropdown)}
                        >
                          <span className={formData.packageType ? "text-gray-700" : "text-gray-400"}>
                            {formData.packageType || "Select package"}
                          </span>
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        
                        {showPackageTypeDropdown && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                            <div className="py-1">
                              {[
                                { value: "Standard", label: "Standard" },
                                { value: "Premium", label: "Premium" },
                                { value: "Deluxe", label: "Deluxe" },
                                { value: "Custom", label: "Custom" }
                              ].map((option) => (
                                <div
                                  key={option.value}
                                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                    formData.packageType === option.value 
                                      ? "bg-amber-50 text-amber-600"
                                      : "text-gray-700"
                                  }`}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      packageType: option.value
                                    })
                                    setShowPackageTypeDropdown(false)
                                    if (errors.packageType) {
                                      setErrors({
                                        ...errors,
                                        packageType: ""
                                      })
                                    }
                                  }}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {errors.packageType && <p className={errorClasses}>{errors.packageType}</p>}
                      </div>
                    </div>
                  
                    <div>
                      <label htmlFor="totalAmount" className={labelClasses}>
                        Total Amount ($) *
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          id="totalAmount" 
                          name="totalAmount" 
                          min="0" 
                          step="0.01" 
                          value={formData.totalAmount} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.totalAmount && <p className={errorClasses}>{errors.totalAmount}</p>}
                    </div>
                  
                    <div>
                      <label htmlFor="depositAmount" className={labelClasses}>
                        Deposit Amount ($) *
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          id="depositAmount" 
                          name="depositAmount" 
                          min="0" 
                          step="0.01" 
                          value={formData.depositAmount} 
                          onChange={handleInputChange} 
                          className={inputClasses}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.depositAmount && <p className={errorClasses}>{errors.depositAmount}</p>}
                    </div>
                  

                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Event...
                  </div>
                ) : (
                  "Update Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
