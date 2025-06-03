"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Users,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  X,
  Plus,
  Search,
  Edit,
  Trash
} from "lucide-react"
import AddAdminModal from "@/Components/SuperAdmin/AddAdminModal"
import UpdateAdminModal from "@/Components/SuperAdmin/UpdateAdminModal"
import AdminDetailsModal from "@/Components/SuperAdmin/AdminDetailsModal"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { Head } from "@inertiajs/react"

export default function Admin() {
  const [showNewAdminForm, setShowNewAdminForm] = useState(false)
  const [showUpdateAdminForm, setShowUpdateAdminForm] = useState(false)
  const [showAdminDetails, setShowAdminDetails] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [admins, setAdmins] = useState([])

  // Load admins from API on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`/api/admins?_t=${new Date().getTime()}`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins. Please try again later.");
    }
  };

  // Handle admin status change
  const handleAdminStatusChange = async (updatedAdmin) => {
    try {
      await fetchAdmins(); // Refresh the entire admin list
      setShowAdminDetails(false); // Close the details modal after status change
    } catch (error) {
      console.error("Error handling admin status change:", error);
      toast.error("Failed to handle admin status change. Please try again later.");
    }
  };

  // Handle admin deletion
  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`/api/admins/${id}`);
      await fetchAdmins(); // Ensure data is refreshed before updating UI
      toast.success("Admin deleted successfully!"); // Use toast instead of alert
      setShowAdminDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin. Please try again."); // Use toast instead of alert
    }
  };

  // Filter admins based on status and search query
  const filteredAdmins = admins.filter((admin) => {
    const matchesStatus = filterStatus === "all" || admin.status === filterStatus;
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SuperAdminLayout>
      <Head title="Admin Management" />
      <ToastContainer position="top-right" hideProgressBar />
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
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              />
            </div>
            
            {/* Status Filter Tabs */}
            <div className="flex items-center justify-center w-full lg:w-auto">
              <div className="inline-flex bg-[#F5EFE7]/50 rounded-lg p-1 border border-[#DEB887]/20">
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${filterStatus === "all" 
                    ? "bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${filterStatus === "active" 
                    ? "bg-gradient-to-r from-[#4CAF50]/90 to-[#4CAF50]/70 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </button>
                
                <button
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${filterStatus === "inactive" 
                    ? "bg-gradient-to-r from-[#F44336]/90 to-[#F44336]/70 text-white shadow-sm" 
                    : "text-[#5D3A1F]/70 hover:bg-[#F5EFE7]"}`}
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </button>
              </div>
            </div>
            
            {/* Add Button */}
            <button
              onClick={() => setShowNewAdminForm(true)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md w-full lg:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => deleteAdmin(admin.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Admin"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    {admin.image ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-[#DEB887]/30 shadow-md">
                        <img 
                          src={admin.image ? (admin.image.startsWith('http') ? admin.image : `/${admin.image}`) : ''}
                          alt={admin.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=A67C52&color=fff`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">
                        {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                        {admin.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-[#8B5A2B]" />
                          <span className="text-xs text-[#8B5A2B] font-medium">{admin.role || "Admin"}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          admin.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {admin.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {admin.status ? admin.status.charAt(0).toUpperCase() + admin.status.slice(1) : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                          <Mail className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        </div>
                        <p className="text-xs text-[#6B4226]/70 truncate">{admin.email || "No email provided"}</p>
                      </div>
                    </div>
                    
                    {admin.phonenumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Phone className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70">{admin.phonenumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 h-1 w-full rounded-full bg-[#F5EFE7] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#DEB887] w-full"></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAdmin(admin);
                        setShowAdminDetails(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <User className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAdmin(admin);
                        setShowUpdateAdminForm(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#DEB887]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#8B5A2B] hover:bg-[#DEB887]/10 transition-all duration-300"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-[#DEB887]/30 mt-8">
            <div className="rounded-full bg-[#E8DCCA] p-3 mb-4">
              <Users className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No admins found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no admins matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setSearchQuery("")
              }}
              className="text-sm font-medium text-[#8B5A2B] hover:text-[#5A371F]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAdminModal
        show={showNewAdminForm}
        onClose={() => setShowNewAdminForm(false)}
        onSubmit={fetchAdmins} // Pass fetchAdmins to the modal
      />

      <UpdateAdminModal
        show={showUpdateAdminForm}
        onClose={() => setShowUpdateAdminForm(false)}
        onSubmit={fetchAdmins} // Pass fetchAdmins to the modal
        admin={selectedAdmin}
      />

      <AdminDetailsModal
        show={showAdminDetails}
        onClose={() => setShowAdminDetails(false)}
        admin={selectedAdmin}
        onStatusChange={(updatedAdmin) => {
          handleAdminStatusChange(updatedAdmin);
        }}
      />
    </SuperAdminLayout>
  )
}
