import { useState } from "react"
import { X, Mail, Phone, Calendar, Briefcase, Users, CheckCircle, Ban, MapPin, DollarSign } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function EmployeeDetailsModal({ show, onClose, employee, onStatusChange }) {
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [error, setError] = useState(null);

  if (!show || !employee) return null;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-tr border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Employee Profile Header */}
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
              {employee.image ? (
                <img 
                  src={`/${employee.image}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <span className="text-amber-700 font-semibold text-2xl">
                  {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{employee.name}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  employee.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {employee.status === "active" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  <span>{employee.status === "active" ? "Active" : "Inactive"}</span>
                </span>
                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {employee.position}
                </span>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Contact Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{employee.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-800">{employee.phonenumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Employment Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Job Title</p>
                    <p className="text-sm font-medium text-gray-800">{employee.job_title}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-gray-800">{employee.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Salary</p>
                    <p className="text-sm font-medium text-gray-800">${employee.salary.toLocaleString()}/month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Address Information</h4>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-800">{employee.address}</p>
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
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isActivating ? "Activating..." : "Activate Employee"}
                  </button>
                ) : (
                  <button 
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70"
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
    </div>
  )
}