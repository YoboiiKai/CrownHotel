import { useState, useEffect } from "react"
import { X, Edit, Trash2, Plus, Package, User, Flag, Clock, AlignLeft } from "lucide-react"
import { toast } from "react-toastify"

export default function UpdatePurchaseOrderModal({ show, onClose, order }) {
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    orderNumber: "",
    supplier: "",
    department: "restaurant",
    items: [],
    totalAmount: 0,
    orderDate: "",
    expectedDeliveryDate: "",
    status: "pending",
    notes: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Styling constants
  const inputClasses = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#E5D3B3] transition-all placeholder:text-gray-400"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5"
  const iconWrapperClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  const errorClasses = "text-xs text-red-600 mt-1.5 font-medium"

  // Initialize form data when order changes
  useEffect(() => {
    if (order) {
      setFormData({
        id: order.id || "",
        orderNumber: order.orderNumber || "",
        supplier: order.supplier || "",
        department: order.department || "restaurant",
        items: order.items || [],
        totalAmount: order.totalAmount || 0,
        orderDate: order.orderDate || "",
        expectedDeliveryDate: order.expectedDeliveryDate || "",
        status: order.status || "pending",
        notes: order.notes || ""
      })
    }
  }, [order])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Submit form logic here
    console.log("Updated purchase order:", formData)
    toast.success("Purchase order updated successfully!")
    onClose()
    setIsSubmitting(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#F5EFE7] border-b border-[#E5D3B3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-md shadow-sm">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Purchase Order</h3>
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
            <div className="p-4 bg-[#F5EFE7] rounded-lg border border-[#E5D3B3] mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Order #{formData.orderNumber}</h4>
              <p className="text-xs text-gray-500">Update the purchase order details below.</p>
            </div>

            <div className="space-y-5">
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
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Flag className="h-4 w-4" />
                    </div>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10 appearance-none`}
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className={labelClasses}>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10 appearance-none`}
                    >
                      <option value="pending">Pending</option>
                      <option value="received">Received</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="orderDate" className={labelClasses}>
                    Order Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapperClasses}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      type="datetime-local"
                      id="orderDate"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      className={`${inputClasses} pl-10`}
                    />
                    {errors.orderDate && <p className={errorClasses}>{errors.orderDate}</p>}
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
                
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              className="w-full text-sm border-gray-200 rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all"
                              placeholder="Item name"
                            />
                            {errors.items && errors.items[index] && errors.items[index].name && (
                              <p className={errorClasses}>{errors.items[index].name}</p>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full text-sm border-gray-200 rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all"
                            />
                            {errors.items && errors.items[index] && errors.items[index].quantity && (
                              <p className={errorClasses}>{errors.items[index].quantity}</p>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                              className="w-full text-sm border-gray-200 rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all"
                            >
                              <option value="pcs">pcs</option>
                              <option value="kg">kg</option>
                              <option value="liters">liters</option>
                              <option value="boxes">boxes</option>
                              <option value="sets">sets</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                              className="w-full text-sm border-gray-200 rounded-lg focus:border-[#8B5A2B] focus:ring-[#E5D3B3] focus:outline-none focus:ring-2 transition-all"
                            />
                            {errors.items && errors.items[index] && errors.items[index].price && (
                              <p className={errorClasses}>{errors.items[index].price}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {formatCurrency(item.quantity * item.price)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              disabled={formData.items.length === 1}
                              className={`p-1 rounded-full ${formData.items.length === 1 ? 'text-gray-300' : 'text-red-500 hover:bg-red-50'}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(formData.totalAmount)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="sm:col-span-2 mt-5">
                <label htmlFor="notes" className={labelClasses}>
                  Notes
                </label>
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
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}