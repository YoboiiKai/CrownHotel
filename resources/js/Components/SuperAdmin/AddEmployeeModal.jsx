import { useState, useRef, useEffect } from "react"
import { X, User, Mail, Phone, Briefcase, Users, MapPin, DollarSign, Lock, Upload } from "lucide-react"
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
      
      // Submit form to backend using axios
      axios.post('/api/employees', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(response => {
          toast.success("Employee created successfully!")
          resetForm()
          if (onSubmit) {
            onSubmit(response.data)
          }
          onClose()
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
            toast.error("Please fix the errors in the form.")
          } else {
            console.error("Error creating employee:", error)
            setErrors({ general: "An error occurred while creating the employee" })
            toast.error("Failed to create employee. Please try again.")
          }
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  const inputClasses = "w-full rounded-lg border border-[#DEB887]/30 bg-white px-4 py-2.5 text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-[#6B4226]/50 shadow-sm"
  const labelClasses = "block text-sm font-medium text-[#5D3A1F] mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5A2B]"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] rounded-full shadow-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
              Add New Employee
            </h3>
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
                    EMPLOYEE DETAILS
                  </span>
                </div>
                <h4 className="text-sm font-medium text-[#5D3A1F] mb-1">Employee Information</h4>
                <p className="text-xs text-[#6B4226]/70">Create a new employee record with the following details. All fields marked with an asterisk (*) are required.</p>
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
                <div className="flex flex-col items-center p-5 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-md">
                  <div className="w-32 h-32 mb-4 rounded-full border-2 border-[#DEB887]/50 flex items-center justify-center overflow-hidden bg-white shadow-md group relative">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#A67C52]/10 to-[#8B5A2B]/10">
                        <User className="h-16 w-16 text-[#8B5A2B]/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                        <Upload className="h-5 w-5 text-[#5D3A1F]" />
                      </div>
                    </div>
                  </div>
                  <label 
                    htmlFor="image-upload" 
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-4 py-2 text-sm font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all cursor-pointer w-full justify-center mt-2 shadow-md"
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
                  <p className="mt-3 text-xs text-[#6B4226]/70 text-center">Upload a profile photo (optional)</p>

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
                        <span className={formData.department ? "text-[#5D3A1F]" : "text-[#6B4226]/50"}>
                          {formData.department || "Select"}
                        </span>
                        <svg className="h-5 w-5 text-[#8B5A2B]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {showDepartmentDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-[#DEB887]/30 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[{ id: 1, name: "Front Office" },
                              { id: 2, name: "Housekeeping" },
                              { id: 3, name: "Food and Beverage" },
                              { id: 4, name: "Kitchen" },
                              { id: 5, name: "Maintenance" },
                              { id: 6, name: "Security" },
                              { id: 7, name: "Human Resources" },
                              { id: 8, name: "Sales and Marketing" },
                              { id: 9, name: "Accounting" },
                              { id: 10, name: "IT Department" }
                            ].map((department) => (
                              <div
                                key={department.id}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F5EFE7] ${
                                  formData.department === department.name 
                                    ? "bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 text-[#5D3A1F] font-medium"
                                    : "text-[#5D3A1F]"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    department: department.name
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
                                {department.name}
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
                    <label htmlFor="job_title" className={labelClasses}>Job Title</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={formData.job_title || ""}
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
                        className={`${inputClasses} pl-10`}
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
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#DEB887]/30 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}