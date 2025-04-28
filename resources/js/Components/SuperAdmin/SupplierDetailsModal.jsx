import { useState } from "react"
import { X, Mail, Phone, Calendar, Package, Building, Truck, Check, Ban, User } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function SupplierDetailsModal({ show, onClose, supplier, onStatusChange }) {
  const [isActivating, setIsActivating] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState(null)

  if (!show || !supplier) return null

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Convert category from database format to display format
  const getCategoryDisplay = (category) => {
    if (!category) return "";
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleActivate = async () => {
    setIsActivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/suppliers/${supplier.id}/activate`)
      const updatedSupplier = response.data.supplier || {...supplier, status: "active"}
      
      if (onStatusChange) {
        onStatusChange(updatedSupplier)
      }
      
      toast.success("Supplier activated successfully!")
      onClose() // Close the modal after successful activation
    } catch (error) {
      console.error("Error activating supplier:", error)
      setError("Failed to activate supplier account. Please try again.")
      toast.error("Failed to activate supplier. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/suppliers/${supplier.id}/deactivate`)
      const updatedSupplier = response.data.supplier || {...supplier, status: "inactive"}
      
      if (onStatusChange) {
        onStatusChange(updatedSupplier)
      }
      
      toast.success("Supplier deactivated successfully!")
      onClose() // Close the modal after successful deactivation
    } catch (error) {
      console.error("Error deactivating supplier:", error)
      setError("Failed to deactivate supplier account. Please try again.")
      toast.error("Failed to deactivate supplier. Please try again.")
    } finally {
      setIsDeactivating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this supplier? This action cannot be undone.")) {
      return
    }
    
    setIsDeleting(true)
    setError(null)
    
    try {
      await axios.delete(`/api/suppliers/${supplier.id}`)
      
      if (onDelete) {
        onDelete(supplier.id)
      }
      
      toast.success("Supplier deleted successfully!")
      onClose() // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting supplier:", error)
      setError("Failed to delete supplier. Please try again.")
      toast.error("Failed to delete supplier. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold text-gray-900">Supplier Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Supplier Profile Header */}
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <div className="h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
              {supplier.image ? (
                <img 
                  src={`/${supplier.image}`}
                  alt={supplier.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `<div class="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-2xl flex-shrink-0">${supplier.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`;
                  }}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-2xl flex-shrink-0">
                  {supplier.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{supplier.companyname}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  supplier.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {supplier.status === "active" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  <span>{supplier.status === "active" ? "Active" : "Inactive"}</span>
                </span>
                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {getCategoryDisplay(supplier.category)}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Contact Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{supplier.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800">{supplier.phonenumber || "Not provided"}</p>
                  </div>
                </div>

                {supplier.name && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact Person</p>
                      <p className="text-sm font-medium text-gray-800">{supplier.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Address Information</h4>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Business Address</p>
                  <p className="text-sm font-medium text-gray-800">{supplier.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Supplier Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">  
                  <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-800">
                      {getCategoryDisplay(supplier.category)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registered Since</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(supplier.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Delivery</p>
                    <p className="text-sm font-medium text-gray-800">
                      {supplier.lastDelivery ? formatDate(supplier.lastDelivery) : "No deliveries yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 pb-2">Account Actions</h4>
              
              <div className="flex flex-wrap gap-3">
                {supplier.status === "inactive" ? (
                  <button 
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <Check className="h-4 w-4" />
                    {isActivating ? "Activating..." : "Activate Account"}
                  </button>
                ) : (
                  <button 
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <Ban className="h-4 w-4" />
                    {isDeactivating ? "Deactivating..." : "Deactivate Account"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
