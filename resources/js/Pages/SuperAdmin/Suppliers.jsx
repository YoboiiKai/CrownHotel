"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
import AddSupplierModal from "@/Components/SuperAdmin/AddSupplierModal"
import UpdateSupplierModal from "@/Components/SuperAdmin/UpdateSupplierModal"
import SupplierDetailsModal from "@/Components/SuperAdmin/SupplierDetailsModal"
import {
  Users,
  User,
  Mail,
  Phone,
  Truck,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Package,
  Trash
} from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

export default function Suppliers() {
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showSupplierDetails, setShowSupplierDetails] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [suppliers, setSuppliers] = useState([])

  // Load suppliers from API on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`/api/suppliers?_t=${new Date().getTime()}`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Failed to fetch suppliers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle supplier status change
  const handleStatusChange = async (supplier) => {
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(s => s.id === supplier.id ? supplier : s)
    );
  };

  // Handle supplier deletion
  const handleSupplierDeleted = (id) => {
    setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
    toast.success("Supplier deleted successfully!");
  };

  // Handle supplier deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      handleSupplierDeleted(id);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier. Please try again later.");
    }
  };

  // Filter suppliers based on status and search query
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;
    const matchesSearch = supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

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
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>
          <button
            onClick={() => setShowNewSupplierForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Supplier</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${filterStatus === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterStatus("all")}
          >
            All Suppliers
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

        {/* Supplier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group relative transform hover:-translate-y-1 duration-300"
              >
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all z-10 opacity-80 hover:opacity-100"
                  title="Delete Supplier"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
                <div className="p-5">
                  {/* Supplier Header with Image and Status */}
                  <div className="flex items-center gap-4 mb-4">
                    {supplier.image ? (
                      <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">
                        <img 
                          src={`/${supplier.image}`}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-amber-50"><Truck class="h-7 w-7 text-amber-600" /></div>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-all shadow-sm">
                        <Truck className="h-7 w-7 text-amber-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                          {supplier.companyname}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Package className="h-3 w-3 text-amber-600" />
                          <span className="text-xs text-amber-600 font-medium">{supplier.category || "SUPPLIER"}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center ${
                          supplier?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {supplier?.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {supplier?.status ? supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1) : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-1.5 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm truncate">{supplier.email || "No email provided"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm truncate">{supplier.phonenumber || "No phone number"}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowSupplierDetails(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <User className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowUpdateForm(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Update Supplier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {filteredSuppliers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No suppliers found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery
                ? `No suppliers match your search criteria "${searchQuery}". Try a different search term.`
                : filterStatus !== "all"
                ? `No ${filterStatus} suppliers found. Try a different filter.`
                : "No suppliers have been added yet. Click the 'Add New Supplier' button to create one."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSupplierModal
        show={showNewSupplierForm}
        onClose={() => setShowNewSupplierForm(false)}
        onSubmit={fetchSuppliers} // Pass fetchSuppliers to the modal
      />

      <UpdateSupplierModal
        show={showUpdateForm}
        onClose={() => setShowUpdateForm(false)}
        onSubmit={fetchSuppliers} // Pass fetchSuppliers to the modal
        supplier={selectedSupplier}
      />

      <SupplierDetailsModal
        show={showSupplierDetails}
        onClose={() => setShowSupplierDetails(false)}
        supplier={selectedSupplier}
        onStatusChange={(updatedSupplier) => {
          handleStatusChange(updatedSupplier);
        }}
      />
    </SuperAdminLayout>
  )
}