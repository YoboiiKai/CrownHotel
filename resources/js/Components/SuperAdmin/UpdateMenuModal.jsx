import { useState, useEffect, useRef } from "react"
import { X, Upload, UtensilsCrossed, FileText, PhilippinePeso, Tag, Clock } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function UpdateMenuModal({ show, onClose, onSubmit, selectedMenuItem }) {
  const [formData, setFormData] = useState({
    menuname: "",
    description: "",
    price: "",
    category: "",
    preperationtime: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const fileInputRef = useRef(null)
  const categoryDropdownRef = useRef(null)

  // Define resetForm function before using it in useEffect
  const resetForm = () => {
    if (selectedMenuItem) {
      setFormData({
        menuname: selectedMenuItem.menuname || "",
        description: selectedMenuItem.description || "",
        price: selectedMenuItem.price || "",
        category: selectedMenuItem.category || "",
        preperationtime: selectedMenuItem.preperationtime || "",
      })
      
      // Reset image preview to menu item's current image
      if (selectedMenuItem.image) {
        setImagePreview(`/${selectedMenuItem.image}`)
      } else {
        setImagePreview(null)
      }
    } else {
      setFormData({
        menuname: "",
        description: "",
        price: "",
        category: "",
        preperationtime: "",
      })
      setImagePreview(null)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors({})
  }

  // Load menu data when modal opens or selectedMenuItem changes
  useEffect(() => {
    if (show && selectedMenuItem) {
      resetForm()
    }
  }, [show, selectedMenuItem])

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
  }, [showCategoryDropdown])

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
    if (!formData.menuname.trim()) {
      newErrors.menuname = "Menu name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.preperationtime) {
      newErrors.preperationtime = "Preparation time is required"
    } else if (isNaN(formData.preperationtime) || parseInt(formData.preperationtime) <= 0) {
      newErrors.preperationtime = "Preparation time must be a valid positive number"
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please correct the errors in the form.")
      return
    }
    
    setIsSubmitting(true)
    
    // Create FormData object for file upload
    const formDataToSend = new FormData()
    formDataToSend.append("menuname", formData.menuname)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("price", formData.price)
    formDataToSend.append("category", formData.category)
    formDataToSend.append("preperationtime", formData.preperationtime)
    formDataToSend.append("_method", "PUT") // For Laravel method spoofing
    
    // Add image if selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formDataToSend.append("image", fileInputRef.current.files[0])
    }
    
    // Submit form to backend using axios
    axios.post(`/api/menu/${selectedMenuItem.id}`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        toast.success("Menu item updated successfully!")
        if (onSubmit) {
          onSubmit(response.data)
        }
        onClose()
      })
      .catch(error => {
        console.error("Error updating menu item:", error)
        
        if (error.response && error.response.data && error.response.data.errors) {
          // Set validation errors from backend
          setErrors(error.response.data.errors)
          toast.error("There were validation errors. Please check the form.")
        } else {
          toast.error("Failed to update menu item. Please try again.")
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // CSS Class definitions (same as in original design)
  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-[#A67C52]/10 border-b border-[#A67C52]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] rounded-md shadow-sm">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Menu Item</h3>
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
            {/* Menu Item Header */}
            <div className="p-4 bg-[#A67C52]/10 rounded-lg border border-[#A67C52]/30">
              <p className="text-sm text-[#6B4226]">
                Update the menu item details. Changes will be reflected immediately in the menu management section.
              </p>
            </div>

            {/* Two-column layout for desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Image Upload */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Menu Item Image</label>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-32 h-32 mb-3 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Menu Item Preview" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <UtensilsCrossed className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <label 
                        htmlFor="image-upload" 
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
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
                      <p className="mt-2 text-xs text-gray-500 text-center">Upload a menu item photo</p>

                      {errors.image && (
                        <p className={errorClasses}>{errors.image}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Item Name Input */}
                  <div>
                    <label htmlFor="menuname" className={labelClasses}>Item Name</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <UtensilsCrossed className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="menuname"
                        name="menuname"
                        value={formData.menuname}
                        onChange={handleInputChange}
                        placeholder="Grilled Salmon"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.menuname && <p className={errorClasses}>{errors.menuname}</p>}
                    </div>
                  </div>

                  {/* Price Input */}
                  <div>
                    <label htmlFor="price" className={labelClasses}>Price</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <PhilippinePeso className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="29.99"
                        step="0.01"
                        min="0"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.price && <p className={errorClasses}>{errors.price}</p>}
                    </div>
                  </div>

                  {/* Category Select */}
                  <div>
                    <label htmlFor="category" className={labelClasses}>Category</label>
                    <div className="relative" ref={categoryDropdownRef}>
                      <div className={iconWrapperClasses}>
                        <Tag className="h-4 w-4" />
                      </div>
                      <div 
                        className={`${inputClasses} pl-10 cursor-pointer flex items-center justify-between`}
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        <span className={formData.category ? "text-gray-700" : "text-gray-400"}>
                          {formData.category ? 
                            formData.category.charAt(0).toUpperCase() + formData.category.slice(1).replace(/_/g, ' ') : 
                            "Select"}
                        </span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {showCategoryDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: "breakfast", label: "Breakfast" },
                              { value: "seafood", label: "Seafood" },
                              { value: "chicken", label: "Chicken" },
                              { value: "pork", label: "Pork" },
                              { value: "pasta", label: "Pasta" },
                              { value: "vegetables", label: "Vegetables" },
                              { value: "snacks", label: "Snacks" },
                              { value: "coffee", label: "Coffee" },
                              { value: "beverages", label: "Beverages" },
                              { value: "cocktails", label: "CockTails" },
                              { value: "tower", label: "Tower" },
                              { value: "brandy", label: "Brandy" },
                              { value: "whiskey", label: "Whiskey" },
                              { value: "vodka", label: "Vodka" },
                              { value: "wine", label: "Wine" },
                              { value: "tequila", label: "Tequila" },
                              { value: "rum", label: "Rum" },
                              { value: "beer", label: "Beer" },
                              { value: "soju", label: "Soju" },
                              { value: "gin", label: "Gin" },
                              { value: "non_alcoholic", label: "Non-alcoholic" }
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#A67C52]/10 ${
                                  formData.category === option.value 
                                    ? (option.value ? "bg-[#A67C52]/10 text-[#8B5A2B]" : "bg-gray-100 text-gray-700")
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    category: option.value
                                  });
                                  setShowCategoryDropdown(false);
                                  // Clear error when user selects an option
                                  if (errors.category) {
                                    setErrors({
                                      ...errors,
                                      category: ""
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
                      {errors.category && <p className={errorClasses}>{errors.category}</p>}
                    </div>
                  </div>

                  {/* Prep Time Input */}
                  <div>
                    <label htmlFor="preperationtime" className={labelClasses}>Preparation Time (minutes)</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        id="preperationtime"
                        name="preperationtime"
                        value={formData.preperationtime}
                        onChange={handleInputChange}
                        placeholder="30"
                        min="1"
                        className={`${inputClasses} pl-10`}
                      />
                      {errors.preperationtime && <p className={errorClasses}>{errors.preperationtime}</p>}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClasses}>Description</label>
                    <div className="relative">
                      <div className={iconWrapperClasses}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter item description..."
                        className={`${inputClasses} pl-10 resize-none`}
                      />
                      {errors.description && <p className={errorClasses}>{errors.description}</p>}
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
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update Menu Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}