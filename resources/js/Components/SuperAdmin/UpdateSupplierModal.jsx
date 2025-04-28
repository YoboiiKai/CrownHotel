import { useState, useRef, useEffect } from "react"
import { User, Mail, Phone, Package, Building, Truck, X, Upload, Lock, Briefcase } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function UpdateSupplierModal({ show, onClose, supplier, onSubmit }) {
  const [formData, setFormData] = useState({
    companyname: "",
    name: "",
    email: "",
    phonenumber: "",
    category: "",
    address: "",
    password: "",
    confirmPassword: "",
    status: "active",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const categoryDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (show && supplier) {
      setFormData({
        companyname: supplier.companyname || supplier.name || "",
        name: supplier.name || "",
        email: supplier.email || "",
        phonenumber: supplier.phonenumber || "",
        category: supplier.category || "food_beverages",
        address: supplier.address || "",
        password: "",
        confirmPassword: "",
        status: supplier.status || "active",
      })
      
      // Set image preview if supplier has an image
      if (supplier.image) {
        setImagePreview(`/${supplier.image}`)
      } else {
        setImagePreview(null)
      }
    }
  }, [show, supplier])

  if (!show || !supplier) return null

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
    if (!formData.companyname.trim()) {
      newErrors.companyname = "Company name is required"
    }
    if (!formData.name.trim()) {
      newErrors.name = "Contact person name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    
    // Only validate password if it's provided (optional during update)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }
    
    return newErrors
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
      formDataToSend.append("_method", "PUT") // Laravel method spoofing for PUT requests
      formDataToSend.append("id", supplier.id)
      formDataToSend.append("companyname", formData.companyname)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phonenumber", formData.phonenumber)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("status", formData.status)
      
      // Only include password if it was changed
      if (formData.password) {
        formDataToSend.append("password", formData.password)
      }
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0])
      }
      
      // Send API request
      axios.post(`/api/suppliers/${supplier.id}`, formDataToSend)
        .then(response => {
          toast.success("Supplier updated successfully!")
          if (onSubmit) {
            onSubmit()
          }
          onClose()
        })
        .catch(error => {
          console.error("Error updating supplier:", error)
          toast.error("Failed to update supplier. Please try again.")
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
          }
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  // Convert category from database format to display format
  const getCategoryDisplay = (category) => {
    if (!category) return "";
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Supplier</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Profile Header */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                Update the supplier details. All suppliers will be visible in the supplier management section.
              </p>
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
                        alt="Company Logo" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <Building className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <label 
                    htmlFor="update-supplier-image" 
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Logo
                  </label>
                  <input
                    id="update-supplier-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <p className="mt-2 text-xs text-gray-500 text-center">Upload a new company logo</p>

                  {errors.image && (
                    <p className={errorClasses}>{errors.image}</p>
                  )}
                </div>
              </div>
              {/* Right column - Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company Name Input */}
                  <div>
                    <label htmlFor="companyname" className={labelClasses}>Company Name</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Building className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="companyname"
                        name="companyname"
                        value={formData.companyname}
                        onChange={handleInputChange}
                        placeholder="Premium Foods Inc."
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.companyname && <p className={errorClasses}>{errors.companyname}</p>}
                    </div>
                  </div>

                  {/* Contact Person Input */}
                  <div>
                    <label htmlFor="name" className={labelClasses}>Contact Person</label>
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

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.phonenumber && <p className={errorClasses}>{errors.phonenumber}</p>}
                    </div>
                  </div>

                  {/* Category Select */}
                  <div>
                    <label htmlFor="category" className={labelClasses}>Supplier Category</label>
                    <div className="relative" ref={categoryDropdownRef}>
                      <div className={iconWrapperClasses}>
                        <Package className="h-4 w-4" />
                      </div>
                      <div 
                        className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        <span className={formData.category ? "text-gray-700" : "text-gray-400"}>
                          {formData.category ? getCategoryDisplay(formData.category) : "Select category"}
                        </span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {showCategoryDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: "food_beverages", label: "Food & Beverages" },
                              { value: "textiles_linens", label: "Textiles & Linens" },
                              { value: "furniture_decor", label: "Furniture & Decor" },
                              { value: "electronics", label: "Electronics & Appliances" },
                              { value: "toiletries", label: "Toiletries & Amenities" },
                              { value: "cleaning", label: "Cleaning Supplies" },
                              { value: "other", label: "Other" }
                            ].map((category) => (
                              <div
                                key={category.value}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                                  formData.category === category.value 
                                    ? "bg-amber-50 text-amber-600"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    category: category.value
                                  });
                                  setShowCategoryDropdown(false);
                                  if (errors.category) {
                                    setErrors({
                                      ...errors,
                                      category: ""
                                    });
                                  }
                                }}
                              >
                                {category.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.category && <p className={errorClasses}>{errors.category}</p>}
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="sm:col-span-2">
                    <label htmlFor="add-address" className={labelClasses}>Business Address</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Truck className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="add-address"
                        name="address"
                        value={formData.address}
                        placeholder="123 Business Ave, Suite 100, New York, NY 10001"
                        onChange={handleInputChange}
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.address && <p className={errorClasses}>{errors.address}</p>}
                    </div>
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
                        placeholder="contact@example.com"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
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
                        placeholder="Enter password"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.password && <p className={errorClasses}>{errors.password}</p>}
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.confirmPassword && <p className={errorClasses}>{errors.confirmPassword}</p>}
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
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update Supplier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
