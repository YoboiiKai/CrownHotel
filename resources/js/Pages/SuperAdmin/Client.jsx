"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import { Users, User, Mail, Phone, Building, X, Plus, Search, Filter, ChevronDown, Eye, EyeOff, Edit, Trash, CheckCircle } from "lucide-react"
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
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10 hidden">
                <div className="p-2">
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Clients
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    onClick={() => setFilterStatus("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Clients
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "active" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "inactive" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("inactive")}
          >
            Inactive
          </button>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group relative transform hover:-translate-y-1 duration-300"
            >
              <button
                onClick={() => deleteClient(client.id)}
                className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all z-10 opacity-80 hover:opacity-100"
                title="Delete Client"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
              <div className="p-5">
                {/* Client Header with Image and Status */}
                <div className="flex items-center gap-4 mb-4">
                  {client.image ? (
                    <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">
                      <img 
                        src={`/${client.image}`}
                        alt={client.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          // Set a fallback image or use initials
                          e.target.parentNode.innerHTML = `<div class="h-14 w-14 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">${client.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">
                      {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                        {client.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center ${
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

                {/* Contact Information */}
                <div className="space-y-1.5 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <p className="text-sm truncate">{client.email}</p>
                  </div>
                  {client.phonenumber && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm">{client.phonenumber}</p>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm truncate">{client.address}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedClient(client)
                      setShowClientDetails(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClient(client)
                      setShowUpdateClientForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Update Client</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no clients matching your current filters.</p>
            <button
              onClick={() => {
                setFilterStatus("all")
                setSearchQuery("")
              }}
              className="text-sm font-medium text-amber-600 hover:text-amber-800"
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