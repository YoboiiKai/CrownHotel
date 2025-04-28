import React, { useState, useRef, useEffect } from "react";
import { X, User, Mail, Phone, Calendar, Users, MessageSquare, Home, CreditCard, Building, MapPin, Shield, Upload, Check, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddBookingModal({
  setShowAddBookingForm,
  handleAddBookingSubmit,
  availableRooms = [],
}) {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password_confirmation: "",
    roomNumber: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Fetch available rooms when component mounts
  useEffect(() => {
    if (availableRooms && availableRooms.length > 0) {
      setRooms(availableRooms);
    } else {
      fetchAvailableRooms();
    }
  }, [availableRooms]);

  const fetchAvailableRooms = async () => {
    setIsLoadingRooms(true);
    try {
      // Fetch all room data with a cache-busting timestamp
      const response = await axios.get(`/api/rooms?_t=${new Date().getTime()}`);
      if (response.data) {
        // Filter only available rooms
        const availableRooms = response.data.filter(room => room.status === 'available');
        console.log("Fetched rooms:", availableRooms);
        setRooms(availableRooms);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      toast.error("Failed to load available rooms. Please try again.");
      // Fallback to empty rooms array to prevent UI errors
      setRooms([]);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Update room type when room number changes
  const handleRoomChange = (e) => {
    const { value } = e.target;
    
    // Find the selected room object
    const selectedRoom = rooms.find(room => room.roomNumber === value);
    
    setFormData(prev => ({
      ...prev,
      roomNumber: value,
      roomType: selectedRoom ? selectedRoom.roomType : "",
    }));
    
    // Clear error when user starts typing
    if (errors.roomNumber) {
      setErrors({
        ...errors,
        roomNumber: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.guestName.trim()) {
        newErrors.guestName = "Guest name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match";
      }
    } else if (step === 2) {
      if (!formData.roomNumber) {
        newErrors.roomNumber = "Room number is required";
      }
      if (!formData.checkInDate) {
        newErrors.checkInDate = "Check-in date is required";
      }
      if (!formData.checkOutDate) {
        newErrors.checkOutDate = "Check-out date is required";
      }
      if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
        newErrors.checkOutDate = "Check-out date must be after check-in date";
      }
    }
    
    return newErrors;
  };

  const validateForm = () => {
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    
    return { ...step1Errors, ...step2Errors };
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("guestName", formData.guestName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("roomNumber", formData.roomNumber);
      formDataToSend.append("checkInDate", formData.checkInDate);
      formDataToSend.append("checkOutDate", formData.checkOutDate);
      formDataToSend.append("adults", formData.adults);
      formDataToSend.append("children", formData.children);
      formDataToSend.append("specialRequests", formData.specialRequests);
      
      if (formData.password) {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("password_confirmation", formData.password_confirmation);
      }
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0]);
      }
      
      try {
        handleAddBookingSubmit(formDataToSend);
        toast.success("Booking created successfully!");
        setShowAddBookingForm(false);
      } catch (error) {
        console.error("Error adding booking:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
          toast.error("Please fix the errors in the form.");
        } else {
          toast.error("An error occurred while adding the booking");
          setErrors({ general: "An error occurred while adding the booking" });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Styling classes
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputClasses = "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all";
  const errorClasses = "text-red-500 text-xs mt-1";
  const iconWrapperClasses = "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header - keeping the existing header */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add New Booking</h3>
            </div>
            <button 
              onClick={() => setShowAddBookingForm(false)} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-6 relative">
            {/* Horizontal connecting line that runs through all steps */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200"></div>
            
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep > index + 1 
                      ? 'bg-amber-600 border-amber-600 text-white' 
                      : currentStep === index + 1 
                        ? 'border-amber-600 text-amber-600' 
                        : 'border-gray-300 text-gray-400'
                  } bg-white`}
                >
                  {currentStep > index + 1 ? (
                    <Check className="h-4 w-4 text-amber-600" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div 
                  className={`text-xs font-medium mt-2 text-center ${
                    currentStep >= index + 1 ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {index === 0 ? 'Guest Info' : index === 1 ? 'Room & Dates' : 'Review & Confirm'}
                </div>
              </div>
            ))}
            
            {/* Colored progress line */}
            <div 
              className="absolute top-4 left-4 h-0.5 bg-amber-600 transition-all duration-300 z-0"
              style={{ 
                width: `${(currentStep - 1) * 50}%`,
              }}
            ></div>
          </div>
        </div>
        
        <div className="p-6 pt-0">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Guest Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Section */}
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-32 h-32 mb-3 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <label 
                        htmlFor="image-upload" 
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                      <p className="mt-2 text-xs text-gray-500 text-center">Upload a profile photo (optional)</p>

                      {errors.image && (
                        <p className={errorClasses}>{errors.image}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Form Fields Section */}
                  <div className="md:col-span-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="guestName" className={labelClasses}>Guest Name</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <User className="h-4 w-4" />
                          </div>
                          <input 
                            type="text" 
                            id="guestName" 
                            name="guestName" 
                            value={formData.guestName}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.guestName ? 'border-red-500' : ''}`} 
                            placeholder="Enter guest name" 
                          />
                          {errors.guestName && <p className={errorClasses}>{errors.guestName}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Phone className="h-4 w-4" />
                          </div>
                          <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.phone ? 'border-red-500' : ''}`} 
                            placeholder="Enter phone number" 
                          />
                          {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Mail className="h-4 w-4" />
                          </div>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.email ? 'border-red-500' : ''}`} 
                            placeholder="Enter email address" 
                          />
                          {errors.email && <p className={errorClasses}>{errors.email}</p>}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className={labelClasses}>Address</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <MapPin className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="123 Main St"
                          />
                        </div>
                        {errors.address && <p className={errorClasses}>{errors.address}</p>}
                      </div>
                      <div>
                        <label htmlFor="password" className={labelClasses}>Password</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Shield className="h-4 w-4" />
                          </div>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.password && <p className={errorClasses}>{errors.password}</p>}
                      </div>
                      <div>
                        <label htmlFor="password_confirmation" className={labelClasses}>Confirm Password</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Shield className="h-4 w-4" />
                          </div>
                          <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.password_confirmation && <p className={errorClasses}>{errors.password_confirmation}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Room & Dates */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-4 border-b pb-2">Room Selection & Stay Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="roomNumber" className={labelClasses}>Room Number</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Home className="h-4 w-4" />
                          </div>
                          {isLoadingRooms ? (
                            <div className="flex items-center pl-10 py-2">
                              <svg className="animate-spin h-4 w-4 text-amber-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm text-gray-500">Loading rooms...</span>
                            </div>
                          ) : (
                            <select 
                              id="roomNumber" 
                              name="roomNumber" 
                              value={formData.roomNumber}
                              onChange={handleRoomChange}
                              className={`${inputClasses} pl-10 ${errors.roomNumber ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select a room</option>
                              {rooms && rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                  <option key={index} value={room.roomNumber}>
                                    Room {room.roomNumber} - {room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>No rooms available</option>
                              )}
                            </select>
                          )}
                          {errors.roomNumber && <p className={errorClasses}>{errors.roomNumber}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="checkInDate" className={labelClasses}>Check-in Date</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Calendar className="h-4 w-4" />
                          </div>
                          <input 
                            type="date" 
                            id="checkInDate" 
                            name="checkInDate" 
                            value={formData.checkInDate}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.checkInDate ? 'border-red-500' : ''}`} 
                          />
                          {errors.checkInDate && <p className={errorClasses}>{errors.checkInDate}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="checkOutDate" className={labelClasses}>Check-out Date</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Calendar className="h-4 w-4" />
                          </div>
                          <input 
                            type="date" 
                            id="checkOutDate" 
                            name="checkOutDate" 
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.checkOutDate ? 'border-red-500' : ''}`} 
                          />
                          {errors.checkOutDate && <p className={errorClasses}>{errors.checkOutDate}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="adults" className={labelClasses}>Number of Adults</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Users className="h-4 w-4" />
                          </div>
                          <input 
                            type="number" 
                            id="adults" 
                            name="adults" 
                            value={formData.adults}
                            onChange={handleChange}
                            min="1" 
                            className={`${inputClasses} pl-10 ${errors.adults ? 'border-red-500' : ''}`} 
                            placeholder="Enter number of adults" 
                          />
                          {errors.adults && <p className={errorClasses}>{errors.adults}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="children" className={labelClasses}>Number of Children</label>
                        <div className="relative">
                          <div className={iconWrapperClasses}>
                            <Users className="h-4 w-4" />
                          </div>
                          <input 
                            type="number" 
                            id="children" 
                            name="children" 
                            value={formData.children}
                            onChange={handleChange}
                            min="0" 
                            className={`${inputClasses} pl-10 ${errors.children ? 'border-red-500' : ''}`} 
                            placeholder="Enter number of children" 
                          />
                          {errors.children && <p className={errorClasses}>{errors.children}</p>}
                        </div>
                      </div>
                      <div className="sm:col-span-2 md:col-span-3">
                        <label htmlFor="specialRequests" className={labelClasses}>Special Requests</label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <textarea 
                            id="specialRequests" 
                            name="specialRequests" 
                            value={formData.specialRequests}
                            onChange={handleChange}
                            className={`${inputClasses} pl-10 ${errors.specialRequests ? 'border-red-500' : ''}`} 
                            placeholder="Enter any special requests"
                            rows="3"
                          ></textarea>
                          {errors.specialRequests && <p className={errorClasses}>{errors.specialRequests}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Booking Summary</h4>
                  <p className="text-xs text-gray-500 mb-4">Please review the booking details before confirming.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Guest Information</h5>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Guest" className="w-10 h-10 rounded-full object-cover mr-3" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{formData.guestName}</p>
                            <p className="text-xs text-gray-500">{formData.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div className="flex items-start">
                            <Phone className="h-3 w-3 text-gray-400 mr-2 mt-0.5" />
                            <span>{formData.phone}</span>
                          </div>
                          {formData.address && (
                            <div className="flex items-start">
                              <MapPin className="h-3 w-3 text-gray-400 mr-2 mt-0.5" />
                              <span>{formData.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Booking Details</h5>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Home className="h-3 w-3 text-gray-400 mr-2" />
                              <span className="font-medium">Room:</span>
                            </div>
                            <span>
                              {formData.roomNumber ? 
                                `Room ${formData.roomNumber}` : 
                                'Not selected'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                              <span className="font-medium">Check-in:</span>
                            </div>
                            <span>
                              {formData.checkInDate ? 
                                new Date(formData.checkInDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 
                                'Not selected'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                              <span className="font-medium">Check-out:</span>
                            </div>
                            <span>
                              {formData.checkOutDate ? 
                                new Date(formData.checkOutDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 
                                'Not selected'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 text-gray-400 mr-2" />
                              <span className="font-medium">Guests:</span>
                            </div>
                            <span>{formData.adults} Adults, {formData.children} Children</span>
                          </div>
                          {formData.specialRequests && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-start">
                                <MessageSquare className="h-3 w-3 text-gray-400 mr-2 mt-0.5" />
                                <div>
                                  <span className="font-medium block mb-1">Special Requests:</span>
                                  <p className="text-gray-600">{formData.specialRequests}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddBookingForm(false)} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm"
                >
                  Cancel
                </button>
                
                {currentStep < totalSteps ? (
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all duration-200 shadow-sm flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all duration-200 shadow-sm"
                  >
                    {isSubmitting ? "Creating..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}