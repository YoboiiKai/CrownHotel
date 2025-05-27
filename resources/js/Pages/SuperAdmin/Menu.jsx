import React, { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Plus,
  Trash,
  Edit,
  Search,
  Filter,
  ChevronDown,
  PhilippinePeso,
  Clock,
  Utensils,
  Coffee,
  CheckCircle,
  XCircle,
  Tag,
  TrendingUp,
  Eye
} from "lucide-react";
import AddMenuModal from "@/Components/SuperAdmin/AddMenuModal";
import UpdateMenuModal from "@/Components/SuperAdmin/UpdateMenuModal";
import MenuDetailsModal from "@/Components/SuperAdmin/MenuDetailsModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [showMenuItemDetails, setShowMenuItemDetails] = useState(false);
  const [showUpdateMenuForm, setShowUpdateMenuForm] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Load menu items from API on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/menu?_t=${new Date().getTime()}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to fetch menu items. Please try again later.");
    }
  };

  const handleAddMenuItem = (newItem) => {
    fetchMenuItems(); // Refresh the menu items after adding
    setShowAddMenuForm(false);
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await axios.delete(`/api/menu/${id}`);
      await fetchMenuItems(); // Ensure data is refreshed before updating UI
      toast.success("Menu item deleted successfully!");
      setShowMenuItemDetails(false); // Close the details modal after deletion
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item. Please try again.");
    }
  };

  const handleUpdateMenuItem = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setShowUpdateMenuForm(true);
  };

  const handleUpdateMenuItemSubmit = () => {
    fetchMenuItems(); // Refresh the menu items after updating
    setShowUpdateMenuForm(false);
  };

  // Handle status update separately from edit
  const handleStatusUpdate = (updatedMenuItem) => {
    fetchMenuItems(); // Refresh the menu items to get the updated status
    toast.success(`Menu item ${updatedMenuItem.status === 'sold_out' ? 'marked as Sold Out' : 'marked as Available'} successfully!`);
    setShowMenuItemDetails(false); // Close the modal
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const categories = {
      coffee: "Coffee",
      breakfast: "Breakfast",
      cocktails: "CockTails",
      tower: "Tower",
      seafood: "Seafood",
      chicken: "Chicken",
      snacks: "Snacks",
      pork: "Pork",
      pasta: "Pasta",
      vegetables: "Vegetables",
      brandy: "Brandy",
      whiskey: "Whiskey",
      vodka: "Vodka",
      wine: "Wine",
      tequila: "Tequila",
      rum: "Rum",
      beer: "Beer",
      soju: "Soju",
      gin: "Gin",
      beverages: "Beverages"
    };
    return categories[category] || category;
  };

  // Filter menu items based on category and search query
  const filteredMenuItems = menuItems.filter((item) => {
    // First check if item exists to prevent errors with undefined items
    if (!item) return false;
    
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      (item.menuname ? item.menuname.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (item.category ? getCategoryLabel(item.category).toLowerCase().includes(searchQuery.toLowerCase()) : false);
    return matchesCategory && matchesSearch;
  });

  return (
    <SuperAdminLayout>
      <ToastContainer position="top-right" hideProgressBar />
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
              >
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white shadow-lg z-10">
                  <div className="p-2 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        setFilterCategory("brandy");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Brandy
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("whiskey");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Whiskey
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("vodka");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Vodka
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("wine");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Wine
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("tequila");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Tequila
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("rum");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Rum
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("beer");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Beer
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("soju");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Soju
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("gin");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#A67C52]/10 text-gray-700"
                    >
                      Gin
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAddMenuForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Menu Item</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("all")}
          >
            All Items
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "breakfast" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("breakfast")}
          >
            Breakfast
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "seafood" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("seafood")}
          >
            Seafood
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "chicken" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("chicken")}
          >
            Chicken
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "pork" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("pork")}
          >
            Pork
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "pasta" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("pasta")}
          >
            Pasta
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "vegetables" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("vegetables")}
          >
            Vegetables
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "snacks" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("snacks")}
          >
            Snacks
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "coffee" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("coffee")}
          >
            Coffee
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "cocktails" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("cocktails")}
          >
            CockTails
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "tower" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("tower")}
          >
            Tower
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "beverages" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("beverages")}
          >
            Beverages
          </button>
        </div>

        {/* Menu Item Cards - Landscape Layout with Square Image and Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
            >
              {/* Card Content - Landscape Layout */}
              <div className="flex flex-row h-[180px]">
                {/* Square Image Container - Left Side */}
                <div className="w-[180px] h-[180px] relative flex-shrink-0 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10">
                  {/* Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={item.image ? `/${item.image}` : "https://via.placeholder.com/200x200?text=No+Image"}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/200x200?text=Image+Error";
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {item.status === 'sold_out' ? (
                        <div className="px-2 py-1 rounded-full text-[9px] font-medium bg-red-100 text-red-800 flex items-center shadow-sm">
                          <XCircle className="h-2.5 w-2.5 mr-0.5" />
                          Sold Out
                        </div>
                      ) : (
                        <div className="px-2 py-1 rounded-full text-[9px] font-medium bg-green-100 text-green-800 flex items-center shadow-sm">
                          <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                          Available
                        </div>
                      )}
                    </div>
                    
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-2 left-2 z-10">
                      <div className="flex items-center gap-0.5 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px] shadow-sm border border-white/10">
                        <PhilippinePeso className="h-3 w-3" />
                        <span className="font-bold">{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Information Section - Square Right Side */}
                <div className="p-4 relative bg-gradient-to-br from-white to-[#F5EFE7]/20 w-[180px] h-[180px] flex flex-col">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all z-20 shadow-sm"
                    title="Delete Menu Item"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                  
                  {/* Menu Name with Icon */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-[#5D3A1F] truncate">{item.menuname}</h3>
                  </div>
                  
                  {/* Category Tag and Prep Time */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[10px] text-[#8B5A2B]">
                      <Tag className="h-3 w-3" />
                      <span className="truncate max-w-[80px]">{getCategoryLabel(item.category)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{item.preperationtime}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-[11px] text-gray-600 line-clamp-2 mb-auto">{item.description}</p>
                  
                  {/* Footer Effect */}
                  <div className="mt-2 mb-2">
                    <div className="h-px w-full bg-gradient-to-r from-[#DEB887]/30 to-transparent"></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedMenuItem(item);
                        setShowMenuItemDetails(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] px-2 py-1.5 h-8 text-[11px] font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-1 focus:ring-[#A67C52] transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleUpdateMenuItem(item)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#A67C52] bg-white text-[#8B5A2B] hover:bg-[#A67C52]/10 transition-all duration-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-[#A67C52]/20 p-3 mb-4">
              <Utensils className="h-6 w-6 text-[#8B5A2B]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No menu items found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no menu items matching your current filters.</p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setSearchQuery("");
              }}
              className="text-sm font-medium text-[#8B5A2B] hover:text-[#6B4226]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {/* Modal Components */}
      {selectedMenuItem && showMenuItemDetails && (
        <MenuDetailsModal 
          show={showMenuItemDetails}
          onClose={() => setShowMenuItemDetails(false)}
          menuItem={selectedMenuItem}
          onDelete={handleDeleteMenuItem}
          onUpdate={handleUpdateMenuItem}
          onStatusUpdate={handleStatusUpdate}
          getCategoryLabel={getCategoryLabel}
        />
      )}
      
      <AddMenuModal 
        show={showAddMenuForm}
        onClose={() => setShowAddMenuForm(false)}
        onSubmit={handleAddMenuItem}
      />
      
      <UpdateMenuModal 
        show={showUpdateMenuForm}
        onClose={() => setShowUpdateMenuForm(false)}
        onSubmit={handleUpdateMenuItemSubmit}
        selectedMenuItem={selectedMenuItem}
      />
    </SuperAdminLayout>
  );
}