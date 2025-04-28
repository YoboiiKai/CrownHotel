import { useState, useEffect } from "react"
import { X, Edit, Trash2, Plus } from "lucide-react"

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
    
    // Submit form logic here
    console.log("Updated purchase order:", formData)
    onClose()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Edit className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Update Purchase Order</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Order #{formData.orderNumber}</h4>
              <p className="text-xs text-gray-500">Update the purchase order details below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Enter order number"
                />
                {errors.orderNumber && <p className="text-xs text-red-600 mt-1">{errors.orderNumber}</p>}
              </div>
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Enter supplier name"
                />
                {errors.supplier && <p className="text-xs text-red-600 mt-1">{errors.supplier}</p>}
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <input
                  type="datetime-local"
                  id="orderDate"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                {errors.expectedDeliveryDate && <p className="text-xs text-red-600 mt-1">{errors.expectedDeliveryDate}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Items <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-800"
                >
                  <Plus className="h-3 w-3" />
                  Add Item
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            placeholder="Item name"
                            className="w-full text-sm border-gray-300 rounded-md focus:border-amber-500 focus:ring-amber-200"
                          />
                          {errors.items && errors.items[index] && errors.items[index].name && (
                            <p className="text-xs text-red-600 mt-1">{errors.items[index].name}</p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md focus:border-amber-500 focus:ring-amber-200"
                          />
                          {errors.items && errors.items[index] && errors.items[index].quantity && (
                            <p className="text-xs text-red-600 mt-1">{errors.items[index].quantity}</p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md focus:border-amber-500 focus:ring-amber-200"
                          >
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="l">l</option>
                            <option value="ml">ml</option>
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
                            className="w-full text-sm border-gray-300 rounded-md focus:border-amber-500 focus:ring-amber-200"
                          />
                          {errors.items && errors.items[index] && errors.items[index].price && (
                            <p className="text-xs text-red-600 mt-1">{errors.items[index].price}</p>
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

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Enter any additional notes"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors"
              >
                Update Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}