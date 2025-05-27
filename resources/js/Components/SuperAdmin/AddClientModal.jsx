import { useState, useRef } from "react"
import { User, Mail, Phone, Building, MapPin, Globe, Home, Shield, X, Upload } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AddClientModal({ show, onClose, onSubmit, fetchClients }) {
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

  if (!show) return null

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
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }
    return newErrors
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phonenumber: "",
      address: "",
      password: "",
      password_confirmation: "",
    })
    setImagePreview(null)
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
      formDataToSend.append("password", formData.password)
      formDataToSend.append("password_confirmation", formData.password_confirmation)
      formDataToSend.append("role", "client")
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0])
      }
      
      // Submit form to backend using axios
      axios.post('/api/clients', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(response => {
          toast.success("Client created successfully!");
          const data = response.data
          resetForm()
          // Call onSubmit after the form is reset to ensure the parent component gets the latest data
          if (onSubmit) {
            onSubmit(data)
          }
          onClose(() => {
            fetchClients();
          })
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
            toast.error("Please fix the errors in the form.")
          } else {
            console.error("Error creating client:", error)
            setErrors({ general: "An error occurred while creating the client" })
            toast.error("Failed to create client. Please try again.")
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
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#F5EFE7] border-b border-[#E8DCCA] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-md shadow-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add New Client</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-[#E8DCCA] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-all"
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
              <p className="text-xs text-gray-500">Create a new client account with the following details.</p>
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
                    htmlFor="image-upload" 
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#F0E4CC] focus:outline-none focus:ring-2 focus:ring-[#964B00] focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
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

              {/* Right column - Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className={labelClasses}>Full Name</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className={`${errorClasses} mt-1`}>{errors.name}</p>}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phonenumber" className={labelClasses}>Phone Number</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="phonenumber"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.phonenumber ? 'border-red-500' : ''}`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    {errors.phonenumber && <p className={`${errorClasses} mt-1`}>{errors.phonenumber}</p>}
                  </div>

                  {/* Address Input */}
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
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="123 Main St"
                      />
                    </div>
                    {errors.address && <p className={`${errorClasses} mt-1`}>{errors.address}</p>}
                  </div>

                  {/* Email Input */}
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
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    {errors.email && <p className={`${errorClasses} mt-1`}>{errors.email}</p>}
                  </div>

                  {/* Password Input */}
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
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && <p className={`${errorClasses} mt-1`}>{errors.password}</p>}
                  </div>

                  {/* Password Confirmation Input */}
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
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password_confirmation && <p className={`${errorClasses} mt-1`}>{errors.password_confirmation}</p>}
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
                {isSubmitting ? "Creating..." : "Create Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}