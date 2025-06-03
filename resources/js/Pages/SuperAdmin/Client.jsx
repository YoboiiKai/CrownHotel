"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import {
  Users,
  User,
  Mail,
  Phone,
  Building,
  X,
  Plus,
  Search,
  Edit,
  Trash,
  CheckCircle
} from "lucide-react"
import AddClientModal from "@/Components/SuperAdmin/AddClientModal"
import UpdateClientModal from "@/Components/SuperAdmin/UpdateClientModal"
import ClientDetailsModal from "@/Components/SuperAdmin/ClientDetailsModal"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

export default function Client() {
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showUpdateClientForm, setShowUpdateClientForm] = useState(false)
  const [showClientDetails, setShowClientDetails] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState([])

  // Load clients from API on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      const response = await axios.get(`/api/clients?_t=${new Date().getTime()}`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients. Please try again later.");
    }
  };

  // Handle client status change
  const handleClientStatusChange = async (updatedClient) => {
    try {
      await fetchClients(); // Refresh the entire client list
      setShowClientDetails(false); // Close the details modal after status change
    } catch (error) {
      console.error("Error handling client status change:", error);
      toast.error("Failed to handle client status change. Please try again later.");
    }
  };

  // Handle client deletion
  const deleteClient = async (id) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      await fetchClients(); // Ensure data is refreshed before updating UI
      toast.success("Client deleted successfully!"); 
      setShowClientDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client. Please try again."); 
    }
  };
  
  // Filter clients based on status and search query
  const filteredClients = clients.filter((client) => {
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  return (
    <SuperAdminLayout>
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
                placeholder="Search clients..."
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
              onClick={() => setShowNewClientForm(true)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-[#8B5A2B]/90 to-[#A67C52]/90 text-white shadow-sm hover:shadow-md w-full lg:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => deleteClient(client.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Client"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    {client.image ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-[#DEB887]/30 shadow-md">
                        <img 
                          src={`/${client.image}`}
                          alt={client.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Set a fallback image or use initials
                            e.target.parentNode.innerHTML = `<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">${client.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white font-semibold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          client?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {client?.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {client?.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : "Inactive"}
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
                        <p className="text-xs text-[#6B4226]/70 truncate">{client.email}</p>
                      </div>
                    </div>
                    
                    {client.phonenumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Phone className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70">{client.phonenumber}</p>
                        </div>
                      </div>
                    )}
                    
                    {client.address && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A67C52]/10 shadow-sm">
                            <Building className="h-3.5 w-3.5 text-[#8B5A2B]" />
                          </div>
                          <p className="text-xs text-[#6B4226]/70 truncate">{client.address}</p>
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
                      onClick={() => {
                        setSelectedClient(client)
                        setShowClientDetails(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <User className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client)
                        setShowUpdateClientForm(true)
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

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-[#DEB887]/30 mt-8">
            <div className="rounded-full bg-[#E8DCCA] p-3 mb-4">
              <Users className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no clients matching your current filters.</p>
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
      <AddClientModal
        show={showNewClientForm}
        onClose={() => setShowNewClientForm(false)}
        onSubmit={fetchClients} 
        fetchClients={fetchClients}
      />

      <UpdateClientModal
        show={showUpdateClientForm}
        onClose={() => setShowUpdateClientForm(false)}
        onSubmit={fetchClients} 
        client={selectedClient}
        fetchClients={fetchClients}
      />

      <ClientDetailsModal
        show={showClientDetails}
        onClose={() => setShowClientDetails(false)}
        client={selectedClient}
        onStatusChange={(updatedClient) => {
          handleClientStatusChange(updatedClient);
        }}
        onDelete={deleteClient}
      />
    </SuperAdminLayout>
  )
}