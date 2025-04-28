import { useState, useRef, useEffect } from "react"
import { Package, Barcode, Tag, Hash, DollarSign, MapPin, Building, FileText, X, Upload } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function UpdateInventoryModal({ show, onClose, onSubmit, item }) {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    category: "food",
    quantity: "",
    unit: "pcs",
    minStockLevel: "",
    price: "",
    supplier: "",
    location: "kitchen",
    description: ""
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Load item data when the modal opens
  useEffect(() => {
    if (show && item) {
      setFormData({
        itemName: item.itemName || "",
        itemCode: item.itemCode || "",
        category: item.category || "food",
        quantity: item.quantity || "",
        unit: item.unit || "pcs",
        minStockLevel: item.minStockLevel || "",
        price: item.price || "",
        supplier: item.supplier || "",
        location: item.location || "kitchen",
        description: item.description || ""
      })
      
      // Set image preview if item has an image
      if (item.image) {
        setImagePreview(`/${item.image}`)
      } else {
        setImagePreview(null)
      }
    }
  }, [show, item])

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
    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required"
    }
    if (!formData.itemCode.trim()) {
      newErrors.itemCode = "Item code is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required"
    }
    if (!formData.unit) {
      newErrors.unit = "Unit is required"
    }
    if (!formData.minStockLevel) {
      newErrors.minStockLevel = "Minimum stock level is required"
    }
    if (!formData.price) {
      newErrors.price = "Price is required"
    }
    
    return newErrors
  }

  const resetForm = () => {
    if (item) {
      setFormData({
        itemName: item.itemName || "",
        itemCode: item.itemCode || "",
        category: item.category || "food",
        quantity: item.quantity || "",
        unit: item.unit || "pcs",
        minStockLevel: item.minStockLevel || "",
        price: item.price || "",
        supplier: item.supplier || "",
        location: item.location || "kitchen",
        description: item.description || ""
      })
      
      // Reset image preview to item's current image
      if (item.image) {
        setImagePreview(`/${item.image}`)
      } else {
        setImagePreview(null)
      }
    } else {
      setFormData({
        itemName: "",
        itemCode: "",
        category: "food",
        quantity: "",
        unit: "pcs",
        minStockLevel: "",
        price: "",
        supplier: "",
        location: "kitchen",
        description: ""
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
      formDataToSend.append("itemName", formData.itemName)
      formDataToSend.append("itemCode", formData.itemCode)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("quantity", formData.quantity)
      formDataToSend.append("unit", formData.unit)
      formDataToSend.append("minStockLevel", formData.minStockLevel)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("supplier", formData.supplier || "")
      formDataToSend.append("location", formData.location)
      formDataToSend.append("description", formData.description || "")
      formDataToSend.append("_method", "PUT") // For Laravel method spoofing
      
      // Add image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataToSend.append("image", fileInputRef.current.files[0])
      }
      
      // Submit form to backend using axios
      axios.post(`/api/inventory/${item.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(response => {
          toast.success("Inventory item updated successfully!");
          // Call onSubmit after success to ensure the parent component gets the latest data
          if (onSubmit) {
            onSubmit({ ...item, ...response.data })
          }
          onClose()
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.errors) {
            setErrors(error.response.data.errors)
            toast.error("Please fix the errors in the form.")
          } else {
            console.error("Error updating inventory item:", error)
            setErrors({ general: "An error occurred while updating the inventory item" })
            toast.error("Failed to update inventory item. Please try again.")
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

  if (!show) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md shadow-sm">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Update Inventory Item
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Info Banner */}
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">
                                Inventory Item Information
                            </h4>
                            <p className="text-xs text-gray-500">
                                Update the inventory item with the following
                                details.
                            </p>
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
                                        {imagePreview || formData.image ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Item Preview" 
                                                className="h-full w-full object-cover" 
                                            />
                                        ) : (
                                            <Package className="h-16 w-16 text-gray-400" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all cursor-pointer border border-gray-200 w-full justify-center mt-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Update Photo
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                    />
                                    <p className="mt-2 text-xs text-gray-500 text-center">
                                        Upload an item image (optional)
                                    </p>

                                    {errors.image && (
                                        <p className={errorClasses}>
                                            {errors.image}
                                        </p>
                                    )}


                                </div>
                            </div>

                            {/* Right column - Form Fields */}
                            <div className="lg:col-span-2 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="itemName"
                                            className={labelClasses}
                                        >
                                            Item Name*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="itemName"
                                                name="itemName"
                                                value={formData.itemName}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item name"
                                            />
                                            {errors.itemName && (
                                                <p className={errorClasses}>
                                                    {errors.itemName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="itemCode"
                                            className={labelClasses}
                                        >
                                            Item Code*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Barcode className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                id="itemCode"
                                                name="itemCode"
                                                value={formData.itemCode}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item code"
                                            />
                                            {errors.itemCode && (
                                                <p className={errorClasses}>
                                                    {errors.itemCode}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className={labelClasses}
                                        >
                                            Category*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a category
                                                </option>
                                                <option value="food">
                                                    Food & Beverage
                                                </option>
                                                <option value="housekeeping">
                                                    Housekeeping
                                                </option>
                                                <option value="equipment">
                                                    Equipment
                                                </option>
                                                <option value="amenities">
                                                    Guest Amenities
                                                </option>
                                                <option value="maintenance">
                                                    Maintenance
                                                </option>
                                                <option value="office">
                                                    Office Supplies
                                                </option>
                                            </select>
                                            {errors.category && (
                                                <p className={errorClasses}>
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="quantity"
                                            className={labelClasses}
                                        >
                                            Quantity*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter quantity"
                                            />
                                            {errors.quantity && (
                                                <p className={errorClasses}>
                                                    {errors.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="unit"
                                            className={labelClasses}
                                        >
                                            Unit*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="unit"
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a unit
                                                </option>
                                                <option value="pcs">
                                                    Pieces
                                                </option>
                                                <option value="kg">
                                                    Kilograms
                                                </option>
                                                <option value="g">Grams</option>
                                                <option value="l">
                                                    Liters
                                                </option>
                                                <option value="ml">
                                                    Milliliters
                                                </option>
                                                <option value="boxes">
                                                    Boxes
                                                </option>
                                                <option value="rolls">
                                                    Rolls
                                                </option>
                                                <option value="bottles">
                                                    Bottles
                                                </option>
                                                <option value="packs">
                                                    Packs
                                                </option>
                                            </select>
                                            {errors.unit && (
                                                <p className={errorClasses}>
                                                    {errors.unit}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="minStockLevel"
                                            className={labelClasses}
                                        >
                                            Minimum Stock Level*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="minStockLevel"
                                                name="minStockLevel"
                                                min="0"
                                                value={formData.minStockLevel}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter minimum stock level"
                                            />
                                            {errors.minStockLevel && (
                                                <p className={errorClasses}>
                                                    {errors.minStockLevel}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className={labelClasses}
                                        >
                                            Price*
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter price"
                                            />
                                            {errors.price && (
                                                <p className={errorClasses}>
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className={labelClasses}
                                        >
                                            Storage Location
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">
                                                    Select a location
                                                </option>
                                                <option value="kitchen">
                                                    Kitchen
                                                </option>
                                                <option value="restaurant">
                                                    Restaurant
                                                </option>
                                                <option value="bar">Bar</option>
                                                <option value="storage">
                                                    Main Storage
                                                </option>
                                                <option value="housekeeping">
                                                    Housekeeping Storage
                                                </option>
                                                <option value="maintenance">
                                                    Maintenance Room
                                                </option>
                                                <option value="office">
                                                    Office
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="supplier"
                                            className={labelClasses}
                                        >
                                            Supplier
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <Building className="h-4 w-4" />
                                            </div>
                                            <select
                                                id="supplier"
                                                name="supplier"
                                                value={formData.supplier}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10 appearance-none`}
                                            >
                                                <option value="">Select a supplier</option>
                                                <option value="Global Foods Inc.">Global Foods Inc.</option>
                                                <option value="Premier Linens">Premier Linens</option>
                                                <option value="Hotel Essentials Co.">Hotel Essentials Co.</option>
                                                <option value="Luxury Amenities Ltd.">Luxury Amenities Ltd.</option>
                                                <option value="Kitchen Supply Pro">Kitchen Supply Pro</option>
                                                <option value="Office Solutions">Office Solutions</option>
                                                <option value="Maintenance Masters">Maintenance Masters</option>
                                                <option value="Cleaning Supplies Direct">Cleaning Supplies Direct</option>
                                                <option value="Beverage Distributors">Beverage Distributors</option>
                                                <option value="Equipment Specialists">Equipment Specialists</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className={labelClasses}
                                        >
                                            Description
                                        </label>
                                        <div className="relative">
                                            <div className={iconWrapperClasses}>
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className={`${inputClasses} pl-10`}
                                                placeholder="Enter item description"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUpdateItemForm(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 focus:ring-2 focus:ring-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Updating..." : "Update Item"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
