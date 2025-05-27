import { useState, useRef, useEffect } from "react"
import { User, Mail, Phone, Building, MapPin, Globe, Home, Shield, X, Upload, Lock } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function UpdateClientModal({ show, onClose, client, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    address: "",
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (show && client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phonenumber: client.phonenumber || "",
        address: client.address || "",
        password: "",
        password_confirmation: "",
      })
      
      // Set image preview if client has an image
      if (client.image) {
        setImagePreview(`/${client.image}`)
      } else {
        setImagePreview(null)
      }
    }
  }, [show, client])

  if (!show || !client) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required"
    }
    
    // Only validate password if user is trying to update it
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match"
      }
    }
    
    return newErrors
  }

  const resetForm = () => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phonenumber: client.phonenumber || "",
        address: client.address || "",
        password: "",
        password_confirmation: "",
      })
      
      // Reset image preview to client's current image
      if (client.image) {
        setImagePreview(`/${client.image}`)
      } else {
        setImagePreview(null)
      }
    } else {
      setFormData({
        name: "",
        email: "",
        phonenumber: "",
        address: "",
        password: "",
        password_confirmation: "",
      })
      setImagePreview(null)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setIsSubmitting(true)
      
      // Create FormData object for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phonenumber", formData.phonenumber)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("_method", "PUT") // For Laravel method spoofing
      
      // Only include password if it's provided
      if (formData.password) {
        formDataToSend.append("password", formData.password)
        formDataToSend.append("password_confirmation", formData.password_confirmation)
      }
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0])
      }
      
      // Submit form to backend using axios
      axios.post(`/api/clients/${client.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(response => {
          toast.success("Client updated successfully!");
          // Call onSubmit after success to ensure the parent component gets the latest data
          if (onSubmit) {
            onSubmit({ ...client, ...response.data })
          }
          onClose()
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
            toast.error("Please fix the errors in the form.")
          } else {
            console.error("Error updating client:", error)
            setErrors({ general: "An error occurred while updating the client" })
            toast.error("Failed to update client. Please try again.")
          }
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#E8DCCA] transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-[#F5EFE7] border-b border-[#E8DCCA] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-md shadow-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Client</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-[#E8DCCA]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="p-4 bg-[#F5EFE7] rounded-lg border border-[#D2B48C] mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Client Information</h4>
              <p className="text-xs text-gray-500">Update the client account with the following details. Leave password fields empty to keep the current password.</p>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Two-column layout for desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Image Upload */}
              <div className="lg:col-span-1">
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
                    htmlFor="update-image-upload" 
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#E8DCCA] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Photo
                  </label>
                  <input
                    id="update-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <p className="mt-2 text-xs text-gray-500 text-center">Upload a new profile photo</p>

                  {errors.image && (
                    <p className={errorClasses}>{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Right column - Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="update-name" className={labelClasses}>Full Name</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="update-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className={errorClasses}>{errors.name}</p>}
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label htmlFor="update-phonenumber" className={labelClasses}>Phone Number</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="update-phonenumber"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.phonenumber ? 'border-red-500' : ''}`}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phonenumber && <p className={errorClasses}>{errors.phonenumber}</p>}
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="sm:col-span-2">
                    <label htmlFor="update-address" className={labelClasses}>Address</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <MapPin className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="update-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="Full Address"
                      />
                      {errors.address && <p className={errorClasses}>{errors.address}</p>}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="sm:col-span-2">
                    <label htmlFor="update-email" className={labelClasses}>Email Address</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        id="update-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="johndoe@example.com"
                      />
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="update-password" className={labelClasses}>New Password (Optional)</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        id="update-password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Leave blank to keep current"
                      />
                      {errors.password && <p className={errorClasses}>{errors.password}</p>}
                    </div>
                  </div>

                  {/* Password Confirmation Input */}
                  <div>
                    <label htmlFor="update-password_confirmation" className={labelClasses}>Confirm New Password</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        id="update-password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                        placeholder="Leave blank to keep current"
                      />
                      {errors.password_confirmation && <p className={errorClasses}>{errors.password_confirmation}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}