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
  X,
  CheckCircle,
  Eye,
  Package,
  DollarSign,
  Tag,
  Truck
} from "lucide-react"

export default function PurchaseOrders({ auth }) {
  const [showNewOrderForm, setShowNewOrderForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOrderDetails, setShowOrderDetails] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    orderNumber: "",
    supplier: "",
    department: "restaurant", // restaurant or hotel
    items: [],
    totalAmount: "",
    expectedDeliveryDate: "",
    notes: ""
  })
  
  // Form validation
  const [errors, setErrors] = useState({})
  
  // Sample purchase orders data
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 1,
      orderNumber: "PO-2025-001",
      supplier: "Ocean Fresh Seafood",
      department: "restaurant",
      items: [
        { name: "Fresh Salmon", quantity: 20, unit: "kg", price: 22.50 },
        { name: "Tuna Fillet", quantity: 15, unit: "kg", price: 25.00 }
      ],
      totalAmount: 787.50,
      orderDate: "2025-03-15T08:30:00",
      expectedDeliveryDate: "2025-03-17T10:00:00",
      status: "pending",
      notes: "Priority order for weekend special menu"
    },
    {
      id: 2,
      orderNumber: "PO-2025-002",
      supplier: "Luxury Linens Inc.",
      department: "hotel",
      items: [
        { name: "Bath Towels", quantity: 100, unit: "pcs", price: 12.99 },
        { name: "Bed Sheets", quantity: 50, unit: "sets", price: 45.00 }
      ],
      totalAmount: 3549.00,
      orderDate: "2025-03-14T14:15:00",
      expectedDeliveryDate: "2025-03-18T11:00:00",
      status: "received",
      notes: "Regular monthly order"
    }
  ])

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800",
      received: "bg-green-100 text-green-800",
      delivered: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-amber-600" />
      case "received":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "delivered":
        return <Truck className="h-3 w-3 text-blue-600" />
      case "cancelled":
        return <X className="h-3 w-3 text-red-600" />
      default:
        return null
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  // Filter purchase orders
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchase Orders</h2>
      }
    >
      <Head title="Purchase Orders" />

      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
                    onClick={() => setFilterStatus("all")}
                  >
                    All Status
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("received")}
                  >
                    Received
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("delivered")}
                  >
                    Delivered
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewOrderForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>New Purchase Order</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Status
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "received" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("received")}
          >
            Received
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "delivered" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "cancelled" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Purchase Order Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-3">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{order.orderNumber}</h3>
                    <div className="flex items-center gap-0.5">
                      <DollarSign className="h-3 w-3 text-amber-600" />
                      <span className="font-medium text-xs text-amber-600">{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">{order.supplier}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {order.items.length} items {order.status === "pending" && (
                        <span className="text-amber-600 font-medium">
                          (Expected: {formatDate(order.expectedDeliveryDate)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowOrderDetails(order)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <button onClick={() => setShowOrderDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Number</p>
                  <p className="mt-1 text-gray-900">{showOrderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Supplier</p>
                  <p className="mt-1 text-gray-900">{showOrderDetails.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="mt-1 capitalize text-gray-900">{showOrderDetails.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showOrderDetails.status)}`}>
                      {getStatusIcon(showOrderDetails.status)}
                      <span className="ml-1 capitalize">{showOrderDetails.status}</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {showOrderDetails.items.map((item, index) => (
                        <tr key={index} className="bg-white">
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.unit}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(showOrderDetails.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p className="mt-1 text-sm text-gray-600">{showOrderDetails.notes}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="mt-1 text-gray-900">{formatDate(showOrderDetails.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
                  <p className="mt-1 text-gray-900">{formatDate(showOrderDetails.expectedDeliveryDate)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowOrderDetails(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Form Modal */}
      {showNewOrderForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">New Purchase Order</h3>
                <button onClick={() => setShowNewOrderForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">Order Number</label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter order number"
                    />
                  </div>
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter supplier name"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      id="department"
                      name="department"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                    <input
                      type="datetime-local"
                      id="expectedDeliveryDate"
                      name="expectedDeliveryDate"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  {/* Add items form here */}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Enter any additional notes"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewOrderForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}