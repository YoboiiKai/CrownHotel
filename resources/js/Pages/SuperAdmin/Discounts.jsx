"use client"

import { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Tag,
  Percent,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  X
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modal components to be created later
import AddDiscountModal from "@/Components/SuperAdmin/AddDiscountModal";
import UpdateDiscountModal from "@/Components/SuperAdmin/UpdateDiscountModal";
import DiscountDetailsModal from "@/Components/SuperAdmin/DiscountDetailsModal";

export default function Discounts() {
  // State management
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDiscountForm, setShowAddDiscountForm] = useState(false);
  const [showUpdateDiscountForm, setShowUpdateDiscountForm] = useState(false);
  const [showDiscountDetails, setShowDiscountDetails] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load discounts from API on component mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Fetch discounts from API
  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      // Add cache-busting parameter to prevent caching
      const response = await axios.get(`/api/discounts?_t=${new Date().getTime()}`);
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Failed to load discounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle discount activation/deactivation
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.patch(`/api/discounts/${id}/status`, { status: newStatus });
      
      // Update local state
      setDiscounts(discounts.map(discount => 
        discount.id === id ? { ...discount, status: newStatus } : discount
      ));
      
      toast.success(`Discount ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error changing discount status:", error);
      toast.error("Failed to update discount status. Please try again.");
    }
  };

  // Handle discount deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this discount?")) return;
    
    try {
      await axios.delete(`/api/discounts/${id}`);
      setDiscounts(discounts.filter(discount => discount.id !== id));
      toast.success("Discount deleted successfully");
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount. Please try again.");
    }
  };

  // Filter discounts based on search term and status filter
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         discount.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || discount.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get discount type label
  const getDiscountTypeLabel = (type, value) => {
    return type === "percentage" ? `${value}%` : `₱${value}`;
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotions & Discounts</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage promotional offers and discounts for your hotel and restaurant
            </p>
          </div>
          <button
            onClick={() => setShowAddDiscountForm(true)}
            className="mt-4 md:mt-0 flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#D8C4A9] to-[#A67C52] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add New Discount
          </button>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discounts by name or code..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Status</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                        statusFilter === "all" ? "bg-[#F5EFE7] text-[#442918]" : "hover:bg-gray-100"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("active");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                        statusFilter === "active" ? "bg-[#F5EFE7] text-[#442918]" : "hover:bg-gray-100"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("inactive");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                        statusFilter === "inactive" ? "bg-[#F5EFE7] text-[#442918]" : "hover:bg-gray-100"
                      }`}
                    >
                      Inactive
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("expired");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                        statusFilter === "expired" ? "bg-[#F5EFE7] text-[#442918]" : "hover:bg-gray-100"
                      }`}
                    >
                      Expired
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Discounts table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5EFE7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#442918] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading discounts...
                    </td>
                  </tr>
                ) : filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No discounts found. {searchTerm && "Try a different search term."}
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((discount) => (
                    <tr key={discount.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#E8DCCA] flex items-center justify-center mr-3">
                            <Tag className="h-5 w-5 text-[#5C341F]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                            <div className="text-xs text-gray-500">
                              {discount.description?.substring(0, 30)}
                              {discount.description?.length > 30 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {discount.code || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-[#5C341F] mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {getDiscountTypeLabel(discount.type, discount.value)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(discount.start_date)} - {formatDate(discount.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(discount.status)}`}>
                          {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedDiscount(discount);
                              setShowDiscountDetails(true);
                            }}
                            className="text-[#5C341F] hover:text-[#442918] transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDiscount(discount);
                              setShowUpdateDiscountForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(discount.id, discount.status)}
                            className={`${
                              discount.status === "active"
                                ? "text-gray-600 hover:text-gray-800"
                                : "text-green-600 hover:text-green-800"
                            } transition-colors`}
                            title={discount.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {discount.status === "active" ? (
                              <X className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(discount.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddDiscountForm && (
        <AddDiscountModal
          onClose={() => setShowAddDiscountForm(false)}
          onSubmit={() => {
            setShowAddDiscountForm(false);
            fetchDiscounts();
          }}
        />
      )}

      {showUpdateDiscountForm && selectedDiscount && (
        <UpdateDiscountModal
          discount={selectedDiscount}
          onClose={() => setShowUpdateDiscountForm(false)}
          onSubmit={() => {
            setShowUpdateDiscountForm(false);
            fetchDiscounts();
          }}
        />
      )}

      {showDiscountDetails && selectedDiscount && (
        <DiscountDetailsModal
          discount={selectedDiscount}
          onClose={() => setShowDiscountDetails(false)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setShowDiscountDetails(false);
          }}
          onDelete={(id) => {
            handleDelete(id);
            setShowDiscountDetails(false);
          }}
        />
      )}
    </SuperAdminLayout>
  );
}
