import { useState, useEffect } from "react"
import { Head } from '@inertiajs/react'
import SuperAdminLayout from "@/Layouts/SuperAdminLayout"
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
  AlertTriangle,
  RefreshCw
} from "lucide-react"
import AddInventoryModal from "@/Components/SuperAdmin/AddInventoryModal"
import UpdateInventoryModal from "@/Components/SuperAdmin/UpdateInventoryModal"
import InventoryDetailsModal from "@/Components/SuperAdmin/InventoryDetailsModal"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

export default function SuperAdminInventory({ auth }) {
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [showUpdateItemForm, setShowUpdateItemForm] = useState(false)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load inventory items from API on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch inventory items from API
  const fetchInventory = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const response = await axios.get(`/api/inventory?_t=${new Date().getTime()}`);
      setInventoryItems(response.data);
      if (showToast) {
        toast.success("Inventory data refreshed successfully!");
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to fetch inventory items. Please try again later.");
    } finally {
      setIsRefreshing(false);
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
      return { status: "low-stock", color: "bg-[#F5EFE7] text-[#8B5A2B]" };
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
    <SuperAdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventory Management</h2>
      }
    >
      <Head title="Inventory Management" />
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
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DEB887]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#5D3A1F] placeholder-[#8B5A2B]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all duration-200"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === "all" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7]"}`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilterCategory("food")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === "food" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7]"}`}
              >
                Food & Beverage
              </button>
              <button
                onClick={() => setFilterCategory("housekeeping")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === "housekeeping" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7]"}`}
              >
                Housekeeping
              </button>
              <button
                onClick={() => setFilterCategory("equipment")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === "equipment" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7]"}`}
              >
                Equipment
              </button>
              <button
                onClick={() => setFilterCategory("amenities")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === "amenities" ? "bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md" : "bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7]"}`}
              >
                Guest Amenities
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => fetchInventory(true)}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-[#DEB887]/30 text-[#8B5A2B] hover:bg-[#F5EFE7] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => setShowNewItemForm(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this item?')) {
                      deleteInventory(item.id);
                    }
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition-all opacity-80 hover:opacity-100 shadow-sm"
                  title="Delete Item"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="p-3">
                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] shadow-md text-white">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">
                        {item.itemName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          item.quantity <= 0 
                            ? "bg-red-100 text-red-800" 
                            : item.quantity <= item.minStockLevel 
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                        }`}>
                          {item.quantity <= 0 ? "Out of Stock" : item.quantity <= item.minStockLevel ? "Low Stock" : "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-[#6B4226]/80 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#6B4226]/80">
                        <DollarSign className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        <span>Unit Price</span>
                      </div>
                      <span className="text-sm font-medium text-[#5D3A1F]">
                        ₱{parseFloat(item.price).toFixed(2)} / {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#6B4226]/80">
                        <Tag className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        <span>Category</span>
                      </div>
                      <span className="text-sm font-medium text-[#5D3A1F]">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#6B4226]/80">
                        <Package className="h-3.5 w-3.5 text-[#8B5A2B]" />
                        <span>Stock</span>
                      </div>
                      <span className="text-sm font-medium text-[#5D3A1F]">
                        {item.quantity} {item.unit}
                        {item.quantity < item.minStockLevel && (
                          <span className="text-amber-600 font-medium ml-1">
                            (Min: {item.minStockLevel})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <div className="h-1.5 w-full rounded-full bg-[#E8DCCA] overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.quantity <= 0 
                            ? 'bg-red-400' 
                            : item.quantity <= item.minStockLevel 
                              ? 'bg-amber-400'
                              : 'bg-green-400'
                        }`} 
                        style={{ 
                          width: `${Math.min(100, Math.max(5, (item.quantity / (item.minStockLevel * 1.5)) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 border-t border-[#DEB887]/30 pt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(item);
                      setShowItemDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#A67C52] rounded-md hover:shadow-md transition-all duration-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(item);
                      setShowUpdateItemForm(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5D3A1F] bg-white border border-[#DEB887]/50 rounded-md hover:bg-[#F5EFE7] transition-all duration-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Update</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5EFE7] mb-4">
              <Package className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-base font-medium text-[#5D3A1F] mb-1">No inventory items found</h3>
            <p className="text-sm text-[#6B4226]/80 mb-4 max-w-xs">
              {searchQuery || filterCategory !== 'all' 
                ? 'No items match your current filters.' 
                : 'No inventory items have been added yet.'}
            </p>
            {(searchQuery || filterCategory !== 'all') && (
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center rounded-md bg-[#8B5A2B] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:ring-offset-2 transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
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
    </SuperAdminLayout>
  );
}