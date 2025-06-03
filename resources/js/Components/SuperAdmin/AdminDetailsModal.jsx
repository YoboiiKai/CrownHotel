import { useState } from "react"
import { X, Mail, Phone, Calendar, Shield, Check, Ban, User } from "lucide-react"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-tr border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Admin Details</h3>
                <p className="text-xs text-white/80">View administrator account information</p>
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

          {/* Admin Profile Header */}
          <div className="p-5 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              {admin.image ? (
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#DEB887]/50 shadow-md">
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
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] flex items-center justify-center text-white font-semibold text-2xl shadow-md border-2 border-white/20">
                  {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <div>
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887] mr-1.5"></div>
                  <span className="text-xs font-medium text-[#6B4226]">
                    ADMIN PROFILE
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-[#5D3A1F]">{admin.name}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <span className={`text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    admin.status === "active" 
                      ? "bg-green-100/80 backdrop-blur-sm text-green-800 border border-green-200/30" 
                      : "bg-red-100/80 backdrop-blur-sm text-red-800 border border-red-200/30"
                  }`}>
                    {admin.status === "active" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Ban className="h-3.5 w-3.5" />
                    )}
                    {admin.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-[#6B4226]/70">{admin.email}</span>
                </div>
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
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                <h4 className="text-sm font-medium text-[#5D3A1F]">Contact Information</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                    <Mail className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B4226]/70 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-[#5D3A1F]">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                    <Phone className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B4226]/70 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-[#5D3A1F]">{admin.phonenumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                <h4 className="text-sm font-medium text-[#5D3A1F]">Account Information</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                    <Shield className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B4226]/70 mb-1">Role</p>
                    <p className="text-sm font-medium text-[#5D3A1F]">
                      {admin.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                    <Calendar className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B4226]/70 mb-1">Created At</p>
                    <p className="text-sm font-medium text-[#5D3A1F]">{formatDate(admin.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-4 pt-6 border-t border-[#DEB887]/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                <h4 className="text-sm font-medium text-[#5D3A1F]">Account Actions</h4>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {admin.status === "inactive" ? (
                  <button 
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                  >
                    {isActivating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Activating...
                      </span>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Activate Account
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#F44336] to-[#C62828] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                  >
                    {isDeactivating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deactivating...
                      </span>
                    ) : (
                      <>
                        <Ban className="h-4 w-4" />
                        Deactivate Account
                      </>
                    )}
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