import { useState } from "react"
import { X, Mail, Phone, Calendar, Shield, Check, Ban } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AdminDetailsModal({ show, onClose, admin, onStatusChange }) {
  const [isActivating, setIsActivating] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState(null)

  if (!show || !admin) return null

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleActivate = async () => {
    setIsActivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/admins/${admin.id}/activate`)
      const updatedAdmin = response.data.admin || {...admin, status: "active"}
      
      if (onStatusChange) {
        onStatusChange(updatedAdmin)
      }
      
      toast.success("Admin activated successfully!")
      onClose() // Close the modal after successful activation
    } catch (error) {
      console.error("Error activating admin:", error)
      setError("Failed to activate admin account. Please try again.")
      toast.error("Failed to activate admin. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/admins/${admin.id}/deactivate`)
      const updatedAdmin = response.data.admin || {...admin, status: "inactive"}
      
      if (onStatusChange) {
        onStatusChange(updatedAdmin)
      }
      
      toast.success("Admin deactivated successfully!")
      onClose() // Close the modal after successful deactivation
    } catch (error) {
      console.error("Error deactivating admin:", error)
      setError("Failed to deactivate admin account. Please try again.")
      toast.error("Failed to deactivate admin. Please try again.")
    } finally {
      setIsDeactivating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold text-gray-900">Admin Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin Profile Header */}
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            {admin.image ? (
              <div className="h-20 w-20 rounded-full overflow-hidden">
                <img 
                  src={`/${admin.image}`}
                  alt={admin.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                  }}
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-2xl">
                {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{admin.name}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  admin.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {admin.status === "active" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  <span>{admin.status === "active" ? "Active" : "Inactive"}</span>
                </span>
                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {admin.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Admin Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Contact Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800">{admin.phonenumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Account Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-medium text-gray-800">
                      {admin.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(admin.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 pb-2">Account Actions</h4>
              
              <div className="flex flex-wrap gap-3">
                {admin.status === "inactive" ? (
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