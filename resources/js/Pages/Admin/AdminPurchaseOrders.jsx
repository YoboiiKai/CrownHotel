"use client"

import { useState } from "react"
import { Head } from '@inertiajs/react'
import AdminLayout from "@/Layouts/AdminLayout"
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
  Tag,
  Truck,
  Clock,
  Calendar,
  PhilippinePeso,
} from "lucide-react"
import AddPurchaseOrderModal from "@/Components/SuperAdmin/AddPurchaseOrderModal"
import UpdatePurchaseOrderModal from "@/Components/SuperAdmin/UpdatePurchaseOrderModal"
import PurchaseOrderDetails from "@/Components/SuperAdmin/PurchaseOrderDetails"

export default function PurchaseOrders({ auth }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Purchase orders data
  const [purchaseOrders, setPurchaseOrders] = useState([])

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-[#F5EFE7] text-[#8B5A2B]",
      received: "bg-green-100 text-green-800",
      delivered: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-[#8B5A2B]" />
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

  // Handle adding a new purchase order
  const handleAddPurchaseOrder = (newOrder) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(...purchaseOrders.map(order => order.id)) + 1
    
    // Add the new order to the list
    setPurchaseOrders([
      ...purchaseOrders,
      {
        ...newOrder,
        id: newId,
        orderDate: new Date().toISOString(),
        status: "pending"
      }
    ])
    
    // Close the modal
    setShowAddModal(false)
  }

  // Handle updating an existing purchase order
  const handleUpdatePurchaseOrder = (updatedOrder) => {
    // Update the order in the list
    setPurchaseOrders(
      purchaseOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    )
    
    // Close the modal
    setShowUpdateModal(false)
    setSelectedOrder(null)
  }

  // Show the update modal for a specific order
  const openUpdateModal = (order) => {
    setSelectedOrder(order)
    setShowUpdateModal(true)
  }

  // Show the details modal for a specific order
  const openDetailsModal = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
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
    <AdminLayout
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#E5D3B3] transition-all"
              />
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all">
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                <div className="p-2">
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Status
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                    onClick={() => setFilterStatus("received")}
                  >
                    Received
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                    onClick={() => setFilterStatus("delivered")}
                  >
                    Delivered
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#F5EFE7] text-gray-700"
                    onClick={() => setFilterStatus("cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>New Purchase Order</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Status
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "pending" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "received" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("received")}
          >
            Received
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "delivered" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterStatus === "cancelled" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
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
              <div className="p-3 flex flex-col h-full">
                {/* Order Header with Status on Right */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{order.orderNumber}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
                
                <div className="mb-3 flex-grow">
                  <div className="flex items-center gap-1 mb-1">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">{order.supplier}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Package className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <PhilippinePeso className="h-3 w-3 text-[#964B00]" />
                    <span className="font-medium text-xs text-[#964B00]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  {order.status === "pending" && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-[#8B5A2B] font-medium">
                        Expected: {formatDate(order.expectedDeliveryDate)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-[#6B4226] hover:to-[#5D3A22] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button 
                      onClick={() => openUpdateModal(order)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#E5D3B3] bg-[#F5EFE7] px-3 py-2 text-xs font-medium text-[#8B5A2B] hover:bg-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-[#F5EFE7] p-3 mb-4">
              <Package className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No purchase orders found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter to find what you're looking for, or add a new purchase order.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPurchaseOrderModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSubmit={handleAddPurchaseOrder} 
      />
      
      <UpdatePurchaseOrderModal 
        show={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)} 
        order={selectedOrder}
      />
      
      <PurchaseOrderDetails 
        show={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        order={selectedOrder}
      />
    </AdminLayout>
  )
}