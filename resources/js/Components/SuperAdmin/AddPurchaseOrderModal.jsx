import { useState, useEffect, useRef } from "react"
import { X, Plus, Trash2, Package, User, Flag, Clock, AlignLeft } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AddPurchaseOrderModal({ show, onClose }) {
  // Form state
  const [formData, setFormData] = useState({
    orderNumber: "",
    supplier: "",
    department: "restaurant", // restaurant or hotel
    items: [{ name: "", quantity: 1, unit: "pcs", price: 0 }],
    totalAmount: 0,
    expectedDeliveryDate: "",
    notes: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const departmentDropdownRef = useRef(null)

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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    
    // Recalculate total amount
    const total = updatedItems.reduce(
      (sum, item) => sum + (Number(item.quantity) * Number(item.price)), 
      0
    )
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount: total
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, unit: "pcs", price: 0 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) return
    
    const updatedItems = formData.items.filter((_, i) => i !== index)
    
    // Recalculate total amount
    const total = updatedItems.reduce(
      (sum, item) => sum + (Number(item.quantity) * Number(item.price)), 
      0
    )
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount: total
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required"
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = "Supplier is required"
    }
    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Expected delivery date is required"
    }
    
    // Validate items
    const itemErrors = []
    formData.items.forEach((item, index) => {
      const itemError = {}
      if (!item.name.trim()) {
        itemError.name = "Item name is required"
      }
      if (Number(item.quantity) <= 0) {
        itemError.quantity = "Quantity must be greater than 0"
      }
      if (Number(item.price) <= 0) {
        itemError.price = "Price must be greater than 0"
      }
      
      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError
      }
    })
    
    if (itemErrors.length > 0) {
      newErrors.items = itemErrors
    }
    
    return newErrors
  }

  const resetForm = () => {
    setFormData({
      orderNumber: "",
      supplier: "",
      department: "restaurant",
      items: [{ name: "", quantity: 1, unit: "pcs", price: 0 }],
      totalAmount: 0,
      expectedDeliveryDate: "",
      notes: ""
    })
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Submit form logic here
    console.log("New purchase order:", formData)
    toast.success("Purchase order created successfully!")
    resetForm()
    onClose()
    setIsSubmitting(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">New Purchase Order</h3>
                <p className="text-xs text-white/80">Create a new purchase order with supplier details</p>
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
                    ORDER DETAILS
                  </span>
                </div>
                <h4 className="text-sm font-medium text-[#5D3A1F] mb-1">Purchase Order Information</h4>
                <p className="text-xs text-[#6B4226]/70">Create a new purchase order with the following details.</p>
              </div>
            </div>
            
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shadow-sm">
                {errors.general}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                  <label htmlFor="orderNumber" className={labelClasses}>
                    Order Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Package className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="Enter order number"
                    />
                    {errors.orderNumber && <p className={errorClasses}>{errors.orderNumber}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="supplier" className={labelClasses}>
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                      placeholder="Enter supplier name"
                    />
                    {errors.supplier && <p className={errorClasses}>{errors.supplier}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="department" className={labelClasses}>
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={departmentDropdownRef}>
                    <div 
                      className={`${inputClasses} cursor-pointer flex items-center justify-between pl-10`}
                      onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                    >
                      <span className={formData.department ? "text-[#5D3A1F]" : "text-[#6B4226]/50"}>
                        {formData.department === 'restaurant' ? 'Restaurant' : 'Hotel'}
                      </span>
                      <svg className="h-5 w-5 text-[#8B5A2B]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className={iconWrapperClasses}>
                      <Flag className="h-4 w-4" />
                    </div>
                    
                    {showDepartmentDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-[#DEB887]/30 max-h-60 overflow-y-auto">
                        <div className="py-1">
                          {[
                            { value: "restaurant", label: "Restaurant" },
                            { value: "hotel", label: "Hotel" }
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F5EFE7] transition-colors ${
                                formData.department === option.value 
                                  ? "bg-[#F5EFE7] text-[#5D3A1F] font-medium"
                                  : "text-[#6B4226]/80"
                              }`}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  department: option.value
                                });
                                setShowDepartmentDropdown(false);
                              }}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="expectedDeliveryDate" className={labelClasses}>
                    Expected Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      type="datetime-local"
                      id="expectedDeliveryDate"
                      name="expectedDeliveryDate"
                      value={formData.expectedDeliveryDate}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                    />
                    {errors.expectedDeliveryDate && <p className={errorClasses}>{errors.expectedDeliveryDate}</p>}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClasses}>
                    Items <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-medium text-[#8B5A2B] hover:text-[#6B4226] transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add Item
                  </button>
                </div>
              
              <div className="bg-[#F9F5F0] rounded-lg overflow-hidden border border-[#E5D3B3]">
                <table className="min-w-full divide-y divide-[#E5D3B3]">
                  <thead className="bg-[#F5EFE7]">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Unit</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-[#5D3A1F]/80 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#F0E6D9]">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-[#F9F5F0]/50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            className="w-full text-sm border-[#E5D3B3] rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all bg-white/80 text-[#5D3A1F] placeholder-[#A67C52]/50"
                            placeholder="Item name"
                          />
                          {errors.items && errors.items[index] && errors.items[index].name && (
                            <p className={errorClasses}>{errors.items[index].name}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full text-sm border-[#E5D3B3] rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all bg-white/80 text-[#5D3A1F]"
                          />
                          {errors.items && errors.items[index] && errors.items[index].quantity && (
                            <p className={errorClasses}>{errors.items[index].quantity}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="w-full text-sm border-[#E5D3B3] rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all bg-white/80 text-[#5D3A1F]"
                          >
                            <option value="pcs" className="text-[#5D3A1F]">pcs</option>
                            <option value="kg" className="text-[#5D3A1F]">kg</option>
                            <option value="liters" className="text-[#5D3A1F]">liters</option>
                            <option value="boxes" className="text-[#5D3A1F]">boxes</option>
                            <option value="sets" className="text-[#5D3A1F]">sets</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            className="w-full text-sm border-[#E5D3B3] rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all bg-white/80 text-[#5D3A1F]"
                          />
                          {errors.items && errors.items[index] && errors.items[index].price && (
                            <p className={errorClasses}>{errors.items[index].price}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#8B5A2B] text-right">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                            className={`p-1.5 rounded-full transition-colors ${formData.items.length === 1 ? 'text-[#D4C4B5]' : 'text-[#8B5A2B] hover:bg-[#F0E6D9]'}`}
                            title={formData.items.length === 1 ? "Cannot remove the last item" : "Remove item"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#F5EFE7] border-t-2 border-[#E5D3B3]">
                      <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-[#5D3A1F] text-right">Total Amount:</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#8B5A2B] text-right">{formatCurrency(formData.totalAmount)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 mt-5">
                <label htmlFor="notes" className={labelClasses}>Notes</label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-gray-400">
                    <AlignLeft className="h-4 w-4" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={`${inputClasses} pl-10`}
                    placeholder="Enter any additional notes"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#DEB887]/30 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border border-[#DEB887] text-[#5D3A1F] bg-white hover:bg-[#F5EFE7] focus:ring-2 focus:ring-[#A67C52]/50 focus:ring-offset-1 shadow-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white hover:shadow-md focus:ring-2 focus:ring-[#A67C52]/50 focus:ring-offset-1 shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}