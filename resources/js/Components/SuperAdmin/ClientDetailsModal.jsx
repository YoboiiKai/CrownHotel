import { useState } from "react"
import { X, Mail, Phone, Building, MapPin, Calendar, Check, Ban, User, CreditCard } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function ClientDetailsModal({ show, onClose, client, onStatusChange }) {
  const [isActivating, setIsActivating] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState(null)

  if (!show || !client) return null

  // Format date to display in a more readable format
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
      const response = await axios.put(`/api/clients/${client.id}/activate`)
      const updatedClient = response.data.client || {...client, status: "active"}
      
      if (onStatusChange) {
        onStatusChange(updatedClient)
      }
      
      toast.success("Client activated successfully!")
      onClose() // Close the modal after successful activation
    } catch (error) {
      console.error("Error activating client:", error)
      setError("Failed to activate client account. Please try again.")
      toast.error("Failed to activate client. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/clients/${client.id}/deactivate`)
      const updatedClient = response.data.client || {...client, status: "inactive"}
      
      if (onStatusChange) {
        onStatusChange(updatedClient)
      }
      
      toast.success("Client deactivated successfully!")
      onClose() // Close the modal after successful deactivation
    } catch (error) {
      console.error("Error deactivating client:", error)
      setError("Failed to deactivate client account. Please try again.")
      toast.error("Failed to deactivate client. Please try again.")
    } finally {
      setIsDeactivating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold text-gray-900">Client Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Client Profile Header */}
          <div className="flex items-center gap-4 p-5 bg-[#F5EFE7] rounded-lg border border-[#D2B48C] mb-6">
            {client.image ? (
              <div className="h-20 w-20 rounded-full overflow-hidden">
                <img 
                  src={`/${client.image}`} 
                  alt={client.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                  }}
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-[#E8DCCA] flex items-center justify-center text-[#6B4226] font-semibold text-2xl">
                {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{client.name}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  client.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {client.status === "active" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  <span>{client.status === "active" ? "Active" : "Inactive"}</span>
                </span>
                <span className="text-sm bg-[#E8DCCA] text-[#6B4226] px-2 py-0.5 rounded-full">
                  {client.clientType === "corporate" ? "Corporate Client" : "Individual Client"}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Client Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Contact Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800">{client.phone || "Not provided"}</p>
                  </div>
                </div>

                {client.company && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company</p>
                      <p className="text-sm font-medium text-gray-800">{client.company}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-800">
                      {client.address ? (
                        <>
                          {client.address}
                          {client.city && <>, {client.city}</>}
                          {client.country && <>, {client.country}</>}
                          {client.postalCode && <> {client.postalCode}</>}
                        </>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay History */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Stay History</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Stays</p>
                    <p className="text-sm font-medium text-gray-800">{client.totalStays || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(client.totalSpent || 0)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Stay</p>
                    <p className="text-sm font-medium text-gray-800">
                      {client.lastStay ? formatDate(client.lastStay) : 'No stays yet'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#8B5A2B] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client Since</p>
                    <p className="text-sm font-medium text-gray-800">
                      {client.createdAt ? formatDate(client.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Account Actions</h4>
              
              <div className="flex flex-wrap gap-3">
                {client.status === "inactive" ? (
                  <button
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8B5A2B] rounded-lg hover:bg-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    {isActivating ? "Activating..." : "Activate Account"}
                  </button>
                ) : (
                  <button
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8B5A2B] rounded-lg hover:bg-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 disabled:opacity-50 transition-colors"
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