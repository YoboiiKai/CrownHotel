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
  Truck,
  Clock,
  Calendar,
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

  // Status utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'rejected':
        return <X className="h-3.5 w-3.5" />;
      case 'delivered':
        return <Truck className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <X className="h-3.5 w-3.5" />;
      default:
        return <Package className="h-3.5 w-3.5" />;
    }
  };

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
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.supplier && order.supplier.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.department && order.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  return (
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchase Orders</h2>
      }
    >
      <Head title="Purchase Orders" />

      <div className="mx-auto max-w-6xl">
        {/* Combined Action Bar with Search, Filter, and Add Button */}
        <div className="bg-white rounded-xl shadow-md border border-[#DEB887]/30 p-4 mb-8 mt-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full lg:flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search purchase orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              />
            </div>
            
            {/* Status Filter Tabs */}
            <div className="flex items-center justify-center w-full lg:w-auto">
              <div className="inline-flex bg-[#F5EFE7]/50 rounded-lg p-1 border border-[#DEB887]/20">
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                    filterStatus === "all"
                      ? "bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm"
                      : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"
                  }`}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                    filterStatus === "pending"
                      ? "bg-gradient-to-r from-[#FFA500]/90 to-[#FFA500]/70 text-white shadow-sm"
                      : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"
                  }`}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                    filterStatus === "approved"
                      ? "bg-gradient-to-r from-[#4CAF50]/90 to-[#4CAF50]/70 text-white shadow-sm"
                      : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"
                  }`}
                  onClick={() => setFilterStatus("approved")}
                >
                  Approved
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                    filterStatus === "rejected"
                      ? "bg-gradient-to-r from-[#F44336]/90 to-[#F44336]/70 text-white shadow-sm"
                      : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"
                  }`}
                  onClick={() => setFilterStatus("rejected")}
                >
                  Rejected
                </button>
              </div>
            </div>
            
            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md w-full lg:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Purchase Order</span>
            </button>
          </div>
        </div>

        {/* Purchase Order Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative flex flex-col h-full"
            >
              {/* Delete Button */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                  className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-red-100"
                  title="Delete Order"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Header with Order ID and Status */}
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[#5D3A1F] flex items-center">
                      <Package className="h-4 w-4 mr-2 text-[#A67C52]" />
                      {order.orderNumber}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1.5 capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 flex-1 mb-2">
                  <div className="flex items-center text-sm">
                    <div className="w-1/2 text-[#5D3A1F]/70 flex items-center">
                      <Truck className="h-3.5 w-3.5 mr-1.5" />
                      Supplier
                    </div>
                    <div className="w-1/2 font-medium text-[#8B5A2B] truncate" title={order.supplier}>
                      {order.supplier}
                      
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-1/2 text-[#5D3A1F]/70 flex items-center">
                      <Package className="h-3.5 w-3.5 mr-1.5" />
                      Items
                    </div>
                    <div className="w-1/2 text-[#8B5A2B] font-medium">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} items
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-1/2 text-[#5D3A1F]/70 flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                      Total
                    </div>
                    <div className="w-1/2 font-semibold text-[#8B5A2B]">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-1/2 text-[#5D3A1F]/70 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Order Date
                    </div>
                    <div className="w-1/2 text-[#8B5A2B] font-medium">
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-auto pt-3 border-t border-[#DEB887]/30">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(order);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] px-3 py-2.5 text-xs font-medium text-white shadow-sm hover:shadow-md hover:from-[#7C5E42] hover:to-[#8B5A2B] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A67C52]/50 focus:ring-offset-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Details</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openUpdateModal(order);
                      }}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E5D3B3] bg-white text-[#8B5A2B] hover:bg-[#F5EFE7] hover:border-[#A67C52] transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A67C52]/50 focus:ring-offset-1"
                      title="Update Order"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-[#DEB887]/30 mt-4">
            <div className="rounded-full bg-[#F5EFE7] p-4 mb-5">
              <Package className="h-8 w-8 text-[#8B5A2B]" />
            </div>
            <h3 className="text-xl font-semibold text-[#5D3A1F] mb-2">No purchase orders found</h3>
            <p className="text-[#8B5A2B]/80 text-center max-w-md mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? "No purchase orders match your current filters."
                : "You haven't created any purchase orders yet."}
            </p>
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchQuery("");
                if (searchQuery || filterStatus !== 'all') {
                  setShowAddModal(true);
                }
              }}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{searchQuery || filterStatus !== 'all' ? 'Clear filters' : 'Create Purchase Order'}</span>
            </button>
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
    </SuperAdminLayout>
  )
}