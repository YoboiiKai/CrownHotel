"use client"

import { useState } from "react"
import { Head } from '@inertiajs/react'
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash,
  X,
  CheckCircle,
  Eye,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Tag,
  BarChart2,
  Calendar,
  Clock,
  RefreshCw
} from "lucide-react"

export default function Inventory({ auth }) {
  // State for inventory management
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showItemDetails, setShowItemDetails] = useState(null)
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  
  // Debug state changes
  console.log("Current showItemDetails state:", showItemDetails)
  
  // Function to handle viewing item details
  const handleViewDetails = (item) => {
    console.log("View details clicked for item:", item);
    setShowItemDetails(item);
    console.log("showItemDetails state after setting:", item);
  }

  // Form state
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
    description: "",
    image: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  
  // Sample inventory data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      itemName: "Fresh Salmon",
      itemCode: "FS001",
      category: "food",
      quantity: 25,
      unit: "kg",
      minStockLevel: 10,
      price: 22.50,
      supplier: "Ocean Fresh Seafood",
      location: "kitchen",
      description: "Fresh Atlantic salmon for restaurant menu",
      lastRestocked: "2025-03-10T08:30:00",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      itemName: "Bath Towels",
      itemCode: "BT002",
      category: "housekeeping",
      quantity: 150,
      unit: "pcs",
      minStockLevel: 50,
      price: 12.99,
      supplier: "Luxury Linens Inc.",
      location: "storage",
      description: "Premium quality white bath towels for guest rooms",
      lastRestocked: "2025-03-05T10:15:00",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      itemName: "Wine Glasses",
      itemCode: "WG003",
      category: "equipment",
      quantity: 80,
      unit: "pcs",
      minStockLevel: 30,
      price: 8.75,
      supplier: "Hospitality Supplies Co.",
      location: "restaurant",
      description: "Crystal wine glasses for restaurant service",
      lastRestocked: "2025-03-12T14:45:00",
      image: "https://images.unsplash.com/photo-1566452348683-79a64b069598?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 4,
      itemName: "Toilet Paper",
      itemCode: "TP004",
      category: "housekeeping",
      quantity: 200,
      unit: "rolls",
      minStockLevel: 100,
      price: 0.95,
      supplier: "Cleaning Supplies Ltd.",
      location: "storage",
      description: "Soft 3-ply toilet paper for guest bathrooms",
      lastRestocked: "2025-03-08T09:20:00",
      image: "https://images.unsplash.com/photo-1583251633150-6eb180e648ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: 5,
      itemName: "Olive Oil",
      itemCode: "OO005",
      category: "food",
      quantity: 8,
      unit: "liters",
      minStockLevel: 10,
      price: 18.50,
      supplier: "Gourmet Ingredients Inc.",
      location: "kitchen",
      description: "Extra virgin olive oil for cooking and dressing",
      lastRestocked: "2025-03-01T11:30:00",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ])
  
  // Helper functions for inventory management
  const getCategoryLabel = (category) => {
    const categories = {
      food: "Food & Beverage",
      housekeeping: "Housekeeping",
      equipment: "Equipment",
      amenities: "Guest Amenities",
      maintenance: "Maintenance",
      office: "Office Supplies"
    }
    return categories[category] || category
  }
  
  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return { status: "out-of-stock", color: "bg-red-100 text-red-800" }
    } else if (item.quantity < item.minStockLevel) {
      return { status: "low-stock", color: "bg-amber-100 text-amber-800" }
    } else {
      return { status: "in-stock", color: "bg-green-100 text-green-800" }
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  // Filter inventory items based on category, search query, and low stock filter
  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryLabel(item.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLowStock = showLowStockOnly ? item.quantity < item.minStockLevel : true
    
    return matchesCategory && matchesSearch && matchesLowStock
  })
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (!formData.itemName) newErrors.itemName = "Item name is required"
    if (!formData.itemCode) newErrors.itemCode = "Item code is required"
    if (!formData.quantity) newErrors.quantity = "Quantity is required"
    if (!formData.minStockLevel) newErrors.minStockLevel = "Minimum stock level is required"
    if (!formData.price) newErrors.price = "Price is required"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Add new item or update existing
    const newItem = {
      id: inventoryItems.length + 1,
      ...formData,
      lastRestocked: new Date().toISOString()
    }
    
    setInventoryItems([...inventoryItems, newItem])
    setShowNewItemForm(false)
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
      description: "",
      image: ""
    })
  }

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventory Management</h2>
      }
    >
      <Head title="Inventory Management" />
      {/* Add New Item Modal */}
      {showNewItemForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Inventory Item</h3>
                <button onClick={() => setShowNewItemForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                    <input 
                      type="text" 
                      id="itemName" 
                      name="itemName" 
                      value={formData.itemName} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter item name" 
                    />
                  </div>
                  <div>
                    <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700 mb-1">Item Code*</label>
                    <input 
                      type="text" 
                      id="itemCode" 
                      name="itemCode" 
                      value={formData.itemCode} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter item code" 
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select 
                      id="category" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="">Select a category</option>
                      <option value="food">Food & Beverage</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="equipment">Equipment</option>
                      <option value="amenities">Guest Amenities</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="office">Office Supplies</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      name="quantity" 
                      min="0" 
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter quantity" 
                    />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit*</label>
                    <select 
                      id="unit" 
                      name="unit" 
                      value={formData.unit} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="">Select a unit</option>
                      <option value="pcs">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="g">Grams</option>
                      <option value="l">Liters</option>
                      <option value="ml">Milliliters</option>
                      <option value="boxes">Boxes</option>
                      <option value="rolls">Rolls</option>
                      <option value="bottles">Bottles</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level*</label>
                    <input 
                      type="number" 
                      id="minStockLevel" 
                      name="minStockLevel" 
                      min="0" 
                      value={formData.minStockLevel} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter minimum stock level" 
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <input 
                      type="number" 
                      id="price" 
                      name="price" 
                      min="0" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter price" 
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                    <select 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="">Select a location</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="bar">Bar</option>
                      <option value="storage">Main Storage</option>
                      <option value="housekeeping">Housekeeping Storage</option>
                      <option value="maintenance">Maintenance Room</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input 
                      type="text" 
                      id="supplier" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter supplier name" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      id="image" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleInputChange} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter image URL" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" 
                      placeholder="Enter item description" 
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowNewItemForm(false)} 
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Item Details Modal */}
      {showItemDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
              {/* Modal Header with Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={showItemDetails.image || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}
                  alt={showItemDetails.itemName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setShowItemDetails(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{showItemDetails.itemName}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatus(showItemDetails).color}`}> 
                      {getStockStatus(showItemDetails).status === "out-of-stock" 
                        ? "Out of Stock" 
                        : getStockStatus(showItemDetails).status === "low-stock" 
                          ? "Low Stock" 
                          : "In Stock"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-200">{showItemDetails.itemCode}</p>
                </div>
              </div>

              <div className="p-6">
                {/* Item Details */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Item Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p className="text-sm text-gray-900">{getCategoryLabel(showItemDetails.category)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Stock</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">
                            {showItemDetails.quantity} {showItemDetails.unit}
                          </p>
                          {showItemDetails.quantity < showItemDetails.minStockLevel && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Below minimum
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Minimum Stock Level</p>
                        <p className="text-sm text-gray-900">{showItemDetails.minStockLevel} {showItemDetails.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-sm text-gray-900">${showItemDetails.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Storage Location</p>
                        <p className="text-sm text-gray-900">
                          {showItemDetails.location.charAt(0).toUpperCase() + showItemDetails.location.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Supplier</p>
                        <p className="text-sm text-gray-900">{showItemDetails.supplier || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Restocked</p>
                        <p className="text-sm text-gray-900">{formatDate(showItemDetails.lastRestocked)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-sm text-gray-900">{showItemDetails.description || "No description provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stock Level Visualization */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Stock Level</h4>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className={`h-full ${
                        showItemDetails.quantity <= 0
                          ? "bg-red-600"
                          : showItemDetails.quantity < showItemDetails.minStockLevel
                            ? "bg-amber-600"
                            : "bg-green-600"
                      }`}
                      style={{ 
                        width: `${Math.min(
                          (showItemDetails.quantity / (showItemDetails.minStockLevel * 2)) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-500">0</span>
                    <span className={`${
                      showItemDetails.quantity < showItemDetails.minStockLevel
                        ? "text-amber-600 font-medium"
                        : "text-gray-500"
                    }`}>
                      Min ({showItemDetails.minStockLevel})
                    </span>
                    <span className="text-gray-500">Optimal</span>
                  </div>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restock Item
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowItemDetails(null)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        <div className="mx-auto max-w-6xl">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                  <div className="p-2">
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setFilterCategory("all")}
                    >
                      All Categories
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setFilterCategory("food")}
                    >
                      Food & Beverage
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setFilterCategory("housekeeping")}
                    >
                      Housekeeping
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setFilterCategory("equipment")}
                    >
                      Equipment
                    </button>
                    <button
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                      onClick={() => setFilterCategory("amenities")}
                    >
                      Guest Amenities
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`flex items-center gap-2 rounded-lg ${
                  showLowStockOnly 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-white text-gray-700 border border-gray-200"
                } px-3 py-2 text-sm font-medium hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all`}
              >
                <AlertTriangle className={`h-4 w-4 ${showLowStockOnly ? "text-amber-800" : "text-gray-400"}`} />
                <span>Low Stock</span>
              </button>
            </div>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("all")}
            >
              All Categories
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "food" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("food")}
            >
              Food & Beverage
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "housekeeping" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("housekeeping")}
            >
              Housekeeping
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "equipment" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("equipment")}
            >
              Equipment
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "amenities" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("amenities")}
            >
              Guest Amenities
            </button>
          </div>

          {/* Inventory Item Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item)
              return (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Item Image */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status === "out-of-stock" 
                          ? "Out of Stock" 
                          : stockStatus.status === "low-stock" 
                            ? "Low Stock" 
                            : "In Stock"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    {/* Item Info */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.itemName}</h3>
                        <div className="flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3 text-amber-600" />
                          <span className="font-medium text-xs text-amber-600">{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500 truncate">{getCategoryLabel(item.category)}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {item.quantity} {item.unit} {item.quantity < item.minStockLevel && (
                            <span className="text-amber-600 font-medium">
                              (Min: {item.minStockLevel})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(item)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-amber-100 p-3 mb-4">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No inventory items found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchQuery 
                  ? `No items match your search "${searchQuery}". Try a different search term.` 
                  : showLowStockOnly 
                    ? "No items with low stock levels found in this category." 
                    : "No inventory items found in this category."}
              </p>
            </div>
          )}
        </div>
    </SuperAdminLayout>
  )
}