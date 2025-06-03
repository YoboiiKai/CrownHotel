import { useState } from "react"
import { X, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Users, CheckCircle, Ban } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

const EmployeeDetailsModal = ({ show, onClose, employee, onStatusChange }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [error, setError] = useState(null);

  if (!show || !employee) return null

  const handleActivate = async () => {
    setIsActivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/employees/${employee.id}/activate`)
      const updatedEmployee = response.data || {...employee, status: "active"}
      
      toast.success("Employee activated successfully!")
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange(updatedEmployee)
      }
      
      onClose() // Close the modal after successful activation
    } catch (error) {
      console.error("Error activating employee:", error)
      setError("Failed to activate employee. Please try again.")
      toast.error("Failed to activate employee. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    setError(null)
    
    try {
      const response = await axios.put(`/api/employees/${employee.id}/deactivate`)
      const updatedEmployee = response.data || {...employee, status: "inactive"}
      
      toast.success("Employee deactivated successfully!")
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange(updatedEmployee)
      }
      
      onClose() // Close the modal after successful deactivation
    } catch (error) {
      console.error("Error deactivating employee:", error)
      setError("Failed to deactivate employee. Please try again.")
      toast.error("Failed to deactivate employee. Please try again.")
    } finally {
      setIsDeactivating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-hidden border border-[#DEB887]/30 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] rounded-full shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
              Employee Details
            </h3>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group w-36 h-36 shrink-0">
              {employee.image ? (
                <img
                  src={employee.image.startsWith('/') ? employee.image : `/${employee.image}`}
                  alt={employee.name}
                  className="w-full h-full rounded-full object-cover border-4 border-[#DEB887]/30 shadow-md"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#E8DCCA] flex items-center justify-center border-4 border-[#DEB887]/30 shadow-md">
                  <span className="text-[#6B4226] font-semibold text-3xl">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#5D3A1F] leading-tight">{employee.name}</h2>
              <p className="text-[#8B5A2B] font-medium mt-1">{employee.job_title || "Not specified"}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
                  employee.status === "active" 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                }`}>
                  {employee.status === "active" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  {employee.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Card */}
            <div className="bg-white/80 rounded-lg p-4 shadow-sm border border-[#DEB887]/20 space-y-4">
              <h3 className="font-semibold text-[#5D3A1F] flex items-center gap-2 pb-2 border-b border-[#DEB887]/20">
                <div className="p-1 bg-[#A67C52]/10 rounded-full">
                  <Mail className="h-3 w-3 text-[#8B5A2B]" />
                </div>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Email</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5 break-all">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Phone</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5">{employee.phonenumber || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Address</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5">{employee.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Card */}
            <div className="bg-white/80 rounded-lg p-4 shadow-sm border border-[#DEB887]/20 space-y-4">
              <h3 className="font-semibold text-[#5D3A1F] flex items-center gap-2 pb-2 border-b border-[#DEB887]/20">
                <div className="p-1 bg-[#A67C52]/10 rounded-full">
                  <Briefcase className="h-3 w-3 text-[#8B5A2B]" />
                </div>
                Employment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Job Title</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5">{employee.job_title || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Department</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5">{employee.department || "Not assigned"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5EFE7] rounded-full text-[#8B5A2B] shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5D3A1F] font-medium">Salary</p>
                    <p className="text-[#8B5A2B]/80 text-sm mt-0.5">${employee.salary || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 pb-2">Account Actions</h4>
            
            <div className="flex flex-wrap gap-3">
              {employee.status === "inactive" ? (
                <button 
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 transition-all disabled:opacity-70"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isActivating ? "Activating..." : "Activate Employee"}
                </button>
              ) : (
                <button 
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-sm hover:from-[#7C5124] hover:to-[#5A371F] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-1 transition-all disabled:opacity-70"
                >
                  <Ban className="h-4 w-4" />
                  {isDeactivating ? "Deactivating..." : "Deactivate Employee"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetailsModal