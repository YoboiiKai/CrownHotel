import { useState, useRef, useEffect } from "react"
import { User, Mail, Phone, Calendar, Briefcase, Users, MapPin, DollarSign, X, Upload, Lock } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AddEmployeeModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    department: "",
    job_title: "",
    salary: "",
    status: "active",
    address: "",
    password: "",
    password_confirmation: ""
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const fileInputRef = useRef(null)
  const departmentDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target)) {
        setShowDepartmentDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
    if (!formData.department.trim()) {
      newErrors.department = "Department is required"
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = "Job title is required"
    }
    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required"
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation = "Please confirm your password"
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }
    return newErrors
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phonenumber: "",
      department: "",
      job_title: "",
      salary: "",
      status: "active",
      address: "",
      password: "",
      password_confirmation: ""
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
      formDataToSend.append("department", formData.department)
      formDataToSend.append("job_title", formData.job_title)
      formDataToSend.append("salary", formData.salary)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("password", formData.password)
      formDataToSend.append("password_confirmation", formData.password_confirmation)
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0])
      }
      
      // Send data to the API
      axios.post('/api/employees', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        toast.success("Employee created successfully!")
        resetForm()
        onClose()
        if (onSubmit) onSubmit() 
      })
      .catch(error => {
        console.error("Error creating employee:", error)
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors)
        } else {
          toast.error("Failed to create employee. Please try again.")
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
    }
  }

  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[#6B4226] focus:border-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#E8DCCA] transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-[#6B4226] mb-1.5"
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
              <h3 className="text-lg font-bold text-gray-900">Add New Employee</h3>
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
              <h4 className="text-sm font-medium text-gray-800 mb-2">Employee Information</h4>
              <p className="text-xs text-gray-500">Create a new employee record with the following details.</p>
            </div>

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
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#6B4226] hover:bg-[#E8DCCA] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
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
                        placeholder="John Doe"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.name && <p className={errorClasses}>{errors.name}</p>}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
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
                        placeholder="johndoe@example.com"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phone" className={labelClasses}>Phone Number</label>
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
                        placeholder="+1 (555) 000-0000"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.phonenumber && <p className={errorClasses}>{errors.phonenumber}</p>}
                    </div>
                  </div>

                  {/* Department Select */}
                  <div>
                    <label htmlFor="department" className={labelClasses}>Department</label>
                    <div className="relative" ref={departmentDropdownRef}>
                      <div className={iconWrapperClasses}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div 
                        className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                        onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      >
                        <span className={formData.department ? "text-[#6B4226]" : "text-gray-400"}>
                          {formData.department || "Select"}
                        </span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {showDepartmentDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: "Front Desk", label: "Front Desk" },
                              { value: "Waiter", label: "Waiter" },
                              { value: "Chief", label: "Chief" },
                              { value: "Utilities", label: "Utilities" }
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F5EFE7] ${
                                  formData.department === option.value 
                                    ? "bg-[#F5EFE7] text-[#8B5A2B]"
                                    : "text-[#6B4226]"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    department: option.value
                                  });
                                  setShowDepartmentDropdown(false);
                                  if (errors.department) {
                                    setErrors({
                                      ...errors,
                                      department: ""
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
                      {errors.department && <p className={errorClasses}>{errors.department}</p>}
                    </div>
                  </div>

                  {/* Job Title Input */}
                  <div>
                    <label htmlFor="jobtitle" className={labelClasses}>Job Title</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        placeholder="Manager"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.job_title && <p className={errorClasses}>{errors.job_title}</p>}
                    </div>
                  </div>
                  {/* Salary Input */}
                  <div>
                    <label htmlFor="salary" className={labelClasses}>Salary</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.salary && <p className={errorClasses}>{errors.salary}</p>}
                    </div>
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
                        placeholder="123 Main St, City, Country"
                        className={`${inputClasses} pl-10 min-h-[40px] border border-gray-300 rounded-md focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8DCCA] transition-all`}
                      />
                      {errors.address && <p className={errorClasses}>{errors.address}</p>}
                    </div>
                  </div>
                </div>
                {/* Password Input */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className={labelClasses}>Password</label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className={`${inputClasses} pl-10`}
                    />
                    {errors.password && <p className={errorClasses}>{errors.password}</p>}
                  </div>
                </div>
                {/* Password Confirmation Input */}
                <div className="sm:col-span-2">
                  <label htmlFor="password_confirmation" className={labelClasses}>Confirm Password</label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      className={`${inputClasses} pl-10`}
                    />
                    {errors.password_confirmation && <p className={errorClasses}>{errors.password_confirmation}</p>}
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
                {isSubmitting ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}