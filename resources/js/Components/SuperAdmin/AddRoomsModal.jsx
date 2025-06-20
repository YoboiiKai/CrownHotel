import { useState, useRef, useEffect } from "react"
import { X, Plus, Trash, Upload, Image, Home, DollarSign, Users, FileText, Wifi, Tv, Wind, Wine, Bath, Coffee, Sunrise, Shirt, Car } from "lucide-react"
import axios from "axios"

export default function AddRoomsModal({ show, onClose, onAddRoom }) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "standard",
    price: "",
    capacity: "2",
    amenities: {
      wifi: true,
      tv: true,
      airCon: true,
      minibar: false,
      bathtub: false,
      hairDryer: false,
      breakfast: false,
      balcony: false,
      toiletries: false,
      parking: false
    },
    description: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false)
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false)
  const fileInputRef1 = useRef(null)
  const fileInputRef2 = useRef(null)
  const fileInputRef3 = useRef(null)
  const fileInputRef4 = useRef(null)
  const roomTypeDropdownRef = useRef(null)
  const capacityDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (roomTypeDropdownRef.current && !roomTypeDropdownRef.current.contains(event.target)) {
        setShowRoomTypeDropdown(false)
      }
      if (capacityDropdownRef.current && !capacityDropdownRef.current.contains(event.target)) {
        setShowCapacityDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!show) return null

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }

  // Handle image file upload for a specific slot
  const handleImageUpload = (e, imageSlot) => {
    const file = e.target.files[0]
    
    if (!file) return
    
    // Create preview URL for the selected file
    const imageData = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }
    
    setFormData({
      ...formData,
      [imageSlot]: imageData
    })
    
    // Clear error for images when user uploads
    if (errors.images) {
      setErrors({
        ...errors,
        images: null
      })
    }
    
    // Reset file input
    if (e.target) {
      e.target.value = ""
    }
  }

  // Remove image from a specific slot
  const removeImage = (imageSlot) => {
    // Revoke the object URL to avoid memory leaks
    if (formData[imageSlot]?.preview) {
      URL.revokeObjectURL(formData[imageSlot].preview)
    }
    
    setFormData({
      ...formData,
      [imageSlot]: null
    })
  }
  
  // Trigger file input click for a specific slot
  const triggerFileInput = (inputRef) => {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }
  
  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Room number validation
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required"
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    // Check if at least one image is uploaded
    if (!formData.image1 && !formData.image2 && !formData.image3 && !formData.image4) {
      newErrors.images = "At least one image is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Reset form to initial state
  const resetForm = () => {
    // Clean up object URLs to prevent memory leaks
    if (formData.image1?.preview) URL.revokeObjectURL(formData.image1.preview)
    if (formData.image2?.preview) URL.revokeObjectURL(formData.image2.preview)
    if (formData.image3?.preview) URL.revokeObjectURL(formData.image3.preview)
    if (formData.image4?.preview) URL.revokeObjectURL(formData.image4.preview)
    
    setFormData({
      roomNumber: "",
      roomType: "standard",
      price: "",
      capacity: "2",
      status: "available",
      amenities: {
        wifi: true,
        tv: true,
        airCon: true,
        minibar: false,
        bathtub: false,
        hairDryer: false,
        breakfast: false,
        balcony: false,
        toiletries: false,
        parking: false
      },
      description: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null
    })
    
    setErrors({})
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Prepare form data for submission
    const formDataToSend = new FormData()
    formDataToSend.append('roomNumber', formData.roomNumber)
    formDataToSend.append('roomType', formData.roomType)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('capacity', formData.capacity)
    formDataToSend.append('status', 'available') // Default status for new rooms
    formDataToSend.append('amenities', JSON.stringify(formData.amenities))
    formDataToSend.append('description', formData.description)
    
    // Add images
    if (formData.image1?.file) {
      formDataToSend.append('image1', formData.image1.file)
    }
    if (formData.image2?.file) {
      formDataToSend.append('image2', formData.image2.file)
    }
    if (formData.image3?.file) {
      formDataToSend.append('image3', formData.image3.file)
    }
    if (formData.image4?.file) {
      formDataToSend.append('image4', formData.image4.file)
    }
    
    // Store current form data in case we need to restore it on error
    const currentFormData = {...formData}
    
    // Reset the form before making the API call to ensure the parent component gets the latest data
    resetForm()
    
    // Call the onAddRoom function with the form data
    onAddRoom(formDataToSend)
      .then(() => {
        if (typeof onClose === 'function') {
          onClose()
        }
      })
      .catch(error => {
        // Restore form data if there's an error
        setFormData(currentFormData)
        
        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            setErrors(error.response.data.errors)
          } else if (error.response.data.message) {
            setErrors({ general: error.response.data.message })
          } else {
            setErrors({ general: "An error occurred while creating the room" })
          }
        } else {
          console.error("Error creating room:", error)
          setErrors({ general: "An error occurred while creating the room" })
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // Define reusable classes
  const inputClasses = "w-full rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-[#6B4226]/50 shadow-sm"
  const labelClasses = "block text-sm font-medium text-[#5D3A1F] mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5A2B]"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add New Room</h3>
                <p className="text-xs text-white/80">Create a new hotel room listing</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="p-4 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887] mr-1.5"></div>
                  <span className="text-xs font-medium text-[#6B4226]">
                    ROOM DETAILS
                  </span>
                </div>
                <h4 className="text-sm font-medium text-[#5D3A1F] mb-1">Room Information</h4>
                <p className="text-xs text-[#6B4226]/70">Add a new room with details and images. Required fields are marked with an asterisk (*).</p>
              </div>
            </div>
            
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shadow-sm">
                {errors.general}
              </div>
            )}
            
            {/* Two-column layout for desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Image Upload */}
              <div className="lg:col-span-1">
                <div className="flex flex-col p-5 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-md">
                  <h5 className="text-sm font-medium text-[#5D3A1F] mb-3">Room Images <span className="text-red-500">*</span></h5>
                  
                  <div className="space-y-4 mb-3">
                    {/* Image 1 */}
                    <div className="relative">
                      <h6 className="text-xs font-medium text-[#6B4226]/70 mb-2">Image 1 (Main) <span className="text-red-500">*</span></h6>
                      {formData.image1 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#DEB887]/50 bg-white shadow-sm hover:shadow-md transition-all group">
                          <img 
                            src={formData.image1.preview} 
                            alt="Room preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage('image1')}
                              className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-white transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => triggerFileInput(fileInputRef1)}
                          className="aspect-video rounded-lg border-2 border-[#DEB887]/30 bg-gradient-to-br from-[#A67C52]/5 to-[#8B5A2B]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#DEB887]/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <Image className="h-8 w-8 text-[#8B5A2B]/70 mb-2" />
                          <span className="text-xs text-[#6B4226]/70">Click to upload main image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef1}
                        onChange={(e) => handleImageUpload(e, 'image1')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    {/* Image 2 */}
                    <div className="relative">
                      <h6 className="text-xs font-medium text-[#6B4226]/70 mb-2">Image 2</h6>
                      {formData.image2 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#DEB887]/50 bg-white shadow-sm hover:shadow-md transition-all group">
                          <img 
                            src={formData.image2.preview} 
                            alt="Room preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage('image2')}
                              className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-white transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => triggerFileInput(fileInputRef2)}
                          className="aspect-video rounded-lg border-2 border-[#DEB887]/30 bg-gradient-to-br from-[#A67C52]/5 to-[#8B5A2B]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#DEB887]/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <Image className="h-8 w-8 text-[#8B5A2B]/70 mb-2" />
                          <span className="text-xs text-[#6B4226]/70">Click to upload additional image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef2}
                        onChange={(e) => handleImageUpload(e, 'image2')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    {/* Image 3 */}
                    <div className="relative">
                      <h6 className="text-xs font-medium text-[#6B4226]/70 mb-2">Image 3</h6>
                      {formData.image3 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#DEB887]/50 bg-white shadow-sm hover:shadow-md transition-all group">
                          <img 
                            src={formData.image3.preview} 
                            alt="Room preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage('image3')}
                              className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-white transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => triggerFileInput(fileInputRef3)}
                          className="aspect-video rounded-lg border-2 border-[#DEB887]/30 bg-gradient-to-br from-[#A67C52]/5 to-[#8B5A2B]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#DEB887]/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <Image className="h-8 w-8 text-[#8B5A2B]/70 mb-2" />
                          <span className="text-xs text-[#6B4226]/70">Click to upload additional image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef3}
                        onChange={(e) => handleImageUpload(e, 'image3')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    {/* Image 4 */}
                    <div className="relative">
                      <h6 className="text-xs font-medium text-[#6B4226]/70 mb-2">Image 4</h6>
                      {formData.image4 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#DEB887]/50 bg-white shadow-sm hover:shadow-md transition-all group">
                          <img 
                            src={formData.image4.preview} 
                            alt="Room preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage('image4')}
                              className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-white transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => triggerFileInput(fileInputRef4)}
                          className="aspect-video rounded-lg border-2 border-[#DEB887]/30 bg-gradient-to-br from-[#A67C52]/5 to-[#8B5A2B]/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#DEB887]/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <Image className="h-8 w-8 text-[#8B5A2B]/70 mb-2" />
                          <span className="text-xs text-[#6B4226]/70">Click to upload additional image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef4}
                        onChange={(e) => handleImageUpload(e, 'image4')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    {errors.images && <p className={errorClasses}>{errors.images}</p>}
                  </div>
                  {/* This input is no longer needed since we have individual inputs for each image slot */}
                  
                  <p className="mt-2 text-xs text-gray-500 text-center">Upload up to 4 room images</p>
                  
                  {errors.images && (
                    <p className={errorClasses}>{errors.images}</p>
                  )}
                </div>
              </div>
              
              {/* Right column - Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Room Number */}
                  <div>
                    <label htmlFor="roomNumber" className={labelClasses}>Room Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Home className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="roomNumber"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10`}
                        placeholder="e.g., 101"
                      />
                      {errors.roomNumber && <p className={errorClasses}>{errors.roomNumber}</p>}
                    </div>
                  </div>
                  
                  {/* Room Type */}
                  <div>
                    <label htmlFor="roomType" className={labelClasses}>Room Type <span className="text-red-500">*</span></label>
                    <div className="relative" ref={roomTypeDropdownRef}>
                      <div 
                        className={`${inputClasses} cursor-pointer flex items-center justify-between pl-10`}
                        onClick={() => setShowRoomTypeDropdown(!showRoomTypeDropdown)}
                      >
                        <span className={formData.roomType ? "text-[#5D3A1F]" : "text-[#6B4226]/50"}>
                          {formData.roomType ? 
                            formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1) : 
                            "Select room type"}
                        </span>
                        <svg className="h-5 w-5 text-[#8B5A2B]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className={iconWrapperClasses}>
                        <Home className="h-4 w-4" />
                      </div>
                      
                      {showRoomTypeDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-[#DEB887]/30 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: "standard", label: "Standard" },
                              { value: "deluxe", label: "Deluxe" },
                              { value: "suite", label: "Suite" },
                              { value: "executive", label: "Executive" },
                              { value: "presidential", label: "Presidential" }
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F5EFE7] transition-colors ${
                                  formData.roomType === option.value 
                                    ? "bg-[#F5EFE7] text-[#5D3A1F] font-medium"
                                    : "text-[#6B4226]/80"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    roomType: option.value
                                  });
                                  setShowRoomTypeDropdown(false);
                                  if (errors.roomType) {
                                    setErrors({
                                      ...errors,
                                      roomType: ""
                                    });
                                  }
                                }}
                              >
                                {option.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.roomType && <p className={errorClasses}>{errors.roomType}</p>}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className={labelClasses}>Price per Night ($) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10`}
                        placeholder="e.g., 199.99"
                        min="0"
                        step="0.01"
                      />
                      {errors.price && <p className={errorClasses}>{errors.price}</p>}
                    </div>
                  </div>
                  
                  {/* Capacity */}
                  <div>
                    <label htmlFor="capacity" className={labelClasses}>Capacity <span className="text-red-500">*</span></label>
                    <div className="relative" ref={capacityDropdownRef}>
                      <div className={iconWrapperClasses}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div 
                        className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                        onClick={() => setShowCapacityDropdown(!showCapacityDropdown)}
                      >
                        <span className={formData.capacity ? "text-gray-700" : "text-gray-400"}>
                          {formData.capacity ? 
                            `${formData.capacity} ${formData.capacity === "1" ? "Person" : "People"}` : 
                            "Select capacity"}
                        </span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {showCapacityDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-[#DEB887]/30 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: "1", label: "1 Person" },
                              { value: "2", label: "2 People" },
                              { value: "3", label: "3 People" },
                              { value: "4", label: "4 People" },
                              { value: "5", label: "5 People" },
                              { value: "6", label: "6 People" }
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#E8DCCA] ${
                                  formData.capacity === option.value 
                                    ? "bg-[#F5EFE7] text-[#6B4226]"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    capacity: option.value
                                  });
                                  setShowCapacityDropdown(false);
                                  if (errors.capacity) {
                                    setErrors({
                                      ...errors,
                                      capacity: ""
                                    });
                                  }
                                }}
                              >
                                {option.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.capacity && <p className={errorClasses}>{errors.capacity}</p>}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClasses}>Description</label>
                    <div className="relative">
                      <div className="absolute left-4 top-3 text-gray-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`${inputClasses} pl-10`}
                        placeholder="Describe the room features and amenities..."
                      ></textarea>
                      {errors.description && <p className={errorClasses}>{errors.description}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Room Amenities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.wifi}
                        onChange={() => handleAmenityChange('wifi')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Wifi className="h-3.5 w-3.5 text-[#6B4226]" />
                        WiFi
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.tv}
                        onChange={() => handleAmenityChange('tv')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Tv className="h-3.5 w-3.5 text-[#6B4226]" />
                        TV
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.airCon}
                        onChange={() => handleAmenityChange('airCon')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Wind className="h-3.5 w-3.5 text-[#6B4226]" />
                        Air Conditioning
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.minibar}
                        onChange={() => handleAmenityChange('minibar')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Wine className="h-3.5 w-3.5 text-[#6B4226]" />
                        Minibar
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.bathtub}
                        onChange={() => handleAmenityChange('bathtub')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5 text-[#6B4226]" />
                        Bathtub
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.hairDryer}
                        onChange={() => handleAmenityChange('hairDryer')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Shirt className="h-3.5 w-3.5 text-[#6B4226]" />
                        Hair Dryer
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.breakfast}
                        onChange={() => handleAmenityChange('breakfast')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Coffee className="h-3.5 w-3.5 text-[#6B4226]" />
                        Breakfast
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.balcony}
                        onChange={() => handleAmenityChange('balcony')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Sunrise className="h-3.5 w-3.5 text-[#6B4226]" />
                        Balcony
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.toiletries}
                        onChange={() => handleAmenityChange('toiletries')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Shirt className="h-3.5 w-3.5 text-[#6B4226]" />
                        Toiletries
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.parking}
                        onChange={() => handleAmenityChange('parking')}
                        className="rounded text-[#6B4226] focus:ring-[#A67C52] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-[#6B4226]" />
                        Parking
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-[#6B4226] to-[#5A3921] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5A3921] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}