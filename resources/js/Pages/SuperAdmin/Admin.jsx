"use client"

import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import AddAdminModal from "@/Components/SuperAdmin/AddAdminModal"
import UpdateAdminModal from "@/Components/SuperAdmin/UpdateAdminModal"
import AdminDetailsModal from "@/Components/SuperAdmin/AdminDetailsModal"
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
  Filter,
  ChevronDown,
  Edit,
  Trash
} from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Section */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B]">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
          </div>
          <div className="relative z-10 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="w-full md:w-auto">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#A67C52]/30 backdrop-blur-sm mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#DEB887] mr-2"></div>
                  <span className="text-xs font-medium text-[#DEB887]">
                    CROWN OF THE ORIENT
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  Admin <span className="text-[#DEB887]">Management</span>
                </h1>
                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                  Create and manage system administrators with different access levels. <span className="hidden sm:inline">Control who has access to critical hotel management features.</span>
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                  <button 
                    onClick={() => setShowNewAdminForm(true)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
                    <span className="whitespace-nowrap">Add Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#DEB887] opacity-20 rounded-full -mt-12 sm:-mt-16 md:-mt-20 -mr-12 sm:-mr-16 md:-mr-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#A67C52] opacity-20 rounded-full -mb-8 sm:-mb-10 -ml-8 sm:-ml-10 blur-3xl"></div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#DEB887]/30 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-[#A67C52] mr-2" />
              <h2 className="text-lg font-semibold text-[#5D3A1F]">Filter Admins</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-[#DEB887]/30 focus:outline-none focus:ring-[#A67C52] focus:border-[#A67C52] sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-[#5D3A1F] mb-1">
                  Search
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-[#8B5A2B]" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name, email or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border border-[#DEB887]/30 pl-10 py-2 text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#A67C52] focus:outline-none focus:ring-[#A67C52] sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Table Section */}
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#DEB887]/30">
          <div className="p-4 sm:p-6 border-b border-[#DEB887]/30">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-[#A67C52] mr-2" />
              <h2 className="text-lg font-semibold text-[#5D3A1F]">System Administrators</h2>
            </div>
          </div>
          
          {filteredAdmins.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#F5EFE7] flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-[#A67C52]" />
              </div>
              <h3 className="text-lg font-medium text-[#5D3A1F] mb-1">No Admins Found</h3>
              <p className="text-sm text-[#6B4226]/70 max-w-md mx-auto">
                There are no administrators matching your current filters. Try changing your search criteria or add a new admin.
              </p>
              <button
                onClick={() => {
                  setFilterStatus("all")
                  setSearchQuery("")
                }}
                className="mt-4 px-4 py-2 text-sm font-medium rounded-lg border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#DEB887]/10 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#DEB887]/30">
                <thead className="bg-[#F5EFE7]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                      Admin
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-[#5D3A1F] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#DEB887]/30">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#F5EFE7]/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-[#DEB887]/30">
                            {admin.image ? (
                              <img
                                src={`/storage/${admin.image}`}
                                alt={admin.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=A67C52&color=fff`
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-[#A67C52] flex items-center justify-center text-white text-xs font-medium">
                                {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-[#5D3A1F]">{admin.name}</div>
                            <div className="text-xs text-[#6B4226]/70">{admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-[#5D3A1F]">{admin.email}</div>
                        <div className="text-xs text-[#6B4226]/70">{admin.phonenumber || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A67C52]/10 text-[#8B5A2B]">
                          <Shield className="h-3 w-3 mr-1" />
                          {admin.role || 'Admin'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {admin.status === 'active' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setShowAdminDetails(true)
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] hover:shadow-md transition-all duration-200 cursor-pointer"
                          >
                            <User className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setShowUpdateAdminForm(true)
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-[#DEB887]/30 text-xs font-medium rounded-md text-[#8B5A2B] bg-white hover:bg-[#F5EFE7] transition-all duration-200 cursor-pointer"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
