"use client"

import { useState, useEffect } from "react"
import { Head } from '@inertiajs/react'
import AdminLayout from "@/Layouts/AdminLayout"
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash,
  X,
  CheckCircle,
  Eye,
  Package,
  DollarSign,
  Tag,
  AlertTriangle
} from "lucide-react"
import AddInventoryModal from "@/Components/SuperAdmin/AddInventoryModal"
import UpdateInventoryModal from "@/Components/SuperAdmin/UpdateInventoryModal"
import InventoryDetailsModal from "@/Components/SuperAdmin/InventoryDetailsModal"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

export default function AdminInventory({ auth }) {
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [showUpdateItemForm, setShowUpdateItemForm] = useState(false)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])

  // Load inventory items from API on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch inventory items from API
  const fetchInventory = async () => {
    try {
      const response = await axios.get(`/api/inventory?_t=${new Date().getTime()}`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to fetch inventory items. Please try again later.");
    }
  };

  // Handle inventory status change
  const handleInventoryStatusChange = async (updatedItem) => {
    try {
      await fetchInventory(); // Refresh the entire inventory list
      setShowItemDetails(false); // Close the details modal after status change
    } catch (error) {
      console.error("Error handling inventory status change:", error);
      toast.error("Failed to handle inventory status change. Please try again later.");
    }
  };

  // Handle inventory deletion
  const deleteInventory = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      await fetchInventory(); // Ensure data is refreshed before updating UI
      toast.success("Inventory item deleted successfully!"); 
      setShowItemDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item. Please try again."); 
    }
  };

  // Filter inventory items based on category and search query
  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper function to get stock status
  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return { status: "out-of-stock", color: "bg-red-100 text-red-800" };
    } else if (item.quantity <= item.minStockLevel) {
      return { status: "low-stock", color: "bg-amber-100 text-amber-800" };
    } else {
      return { status: "in-stock", color: "bg-green-100 text-green-800" };
    }
  };

  // Helper function to get category label
  const getCategoryLabel = (category) => {
    const categoryMap = {
      "food": "Food & Beverage",
      "housekeeping": "Housekeeping",
      "equipment": "Equipment",
      "amenities": "Guest Amenities"
    };
    return categoryMap[category] || category;
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventory Management</h2>
      }
    >
      <Head title="Inventory Management" />
      <ToastContainer position="top-right" hideProgressBar />
      <div className="mx-auto max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("all")}
            >
              All Categories
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "food" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("food")}
            >
              Food & Beverage
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "housekeeping" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("housekeeping")}
            >
              Housekeeping
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "equipment" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("equipment")}
            >
              Equipment
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "amenities" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("amenities")}
            >
              Guest Amenities
            </button>
          </div>

          {/* Inventory Item Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item)
              return (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Item Image */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={item.image ? `/${item.image}` : "/images/placeholder-item.jpg"}
                      alt={item.itemName}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status === "out-of-stock" 
                          ? "Out of Stock" 
                          : stockStatus.status === "low-stock" 
                            ? "Low Stock" 
                            : "In Stock"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    {/* Item Info */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.itemName}</h3>
                        <div className="flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3 text-amber-600" />
                          <span className="font-medium text-xs text-amber-600">{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500 truncate">{getCategoryLabel(item.category)}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {item.quantity} {item.unit} {item.quantity < item.minStockLevel && (
                            <span className="text-amber-600 font-medium">
                              (Min: {item.minStockLevel})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(item)
                          setShowItemDetails(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(item)
                          setShowUpdateItemForm(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-amber-100 p-3 mb-4">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No inventory items found</h3>
              <p className="text-sm text-gray-500 mb-4">There are no items matching your current filters.</p>
              <button
                onClick={() => {
                  setFilterCategory("all")
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
        <AddInventoryModal
          show={showNewItemForm}
          onClose={() => setShowNewItemForm(false)}
          onSubmit={fetchInventory}
        />

        <UpdateInventoryModal
          show={showUpdateItemForm}
          onClose={() => setShowUpdateItemForm(false)}
          onSubmit={fetchInventory}
          item={selectedItem}
        />

        <InventoryDetailsModal
          show={showItemDetails}
          onClose={() => setShowItemDetails(false)}
          item={selectedItem}
          onStatusChange={(updatedItem) => {
            handleInventoryStatusChange(updatedItem);
          }}
          onDelete={deleteInventory}
        />
      </div>
    </AdminLayout>
  )
}