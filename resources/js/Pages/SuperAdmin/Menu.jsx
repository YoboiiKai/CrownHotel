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
  Tag
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
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
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Brandy
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("whiskey");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Whiskey
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("vodka");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Vodka
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("wine");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Wine
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("tequila");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Tequila
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("rum");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Rum
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("beer");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Beer
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("soju");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
                    >
                      Soju
                    </button>
                    <button
                      onClick={() => {
                        setFilterCategory("gin");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700"
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
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Menu Item</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "all" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("all")}
          >
            All Items
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "breakfast" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("breakfast")}
          >
            Breakfast
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "seafood" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("seafood")}
          >
            Seafood
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "chicken" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("chicken")}
          >
            Chicken
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "pork" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("pork")}
          >
            Pork
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "pasta" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("pasta")}
          >
            Pasta
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "vegetables" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("vegetables")}
          >
            Vegetables
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "snacks" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("snacks")}
          >
            Snacks
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "coffee" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("coffee")}
          >
            Coffee
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "cocktails" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("cocktails")}
          >
            CockTails
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "tower" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("tower")}
          >
            Tower
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "beverages" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("beverages")}
          >
            Beverages
          </button>
        </div>

        {/* Menu Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all group relative transform hover:-translate-y-1 duration-300"
            >
              {/* Delete Button at Top Right */}
              <button
                onClick={() => handleDeleteMenuItem(item.id)}
                className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all z-10 opacity-80 hover:opacity-100"
                title="Delete Menu Item"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>

              {/* Menu Item Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image ? `/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-sm font-semibold text-white truncate">{item.menuname}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs">
                      <PhilippinePeso className="h-3 w-3" />
                      <span>{item.price}</span>
                    </div>
                    {item.status === 'sold_out' ? (
                      <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center shadow-sm">
                        <XCircle className="h-3 w-3 mr-0.5" />
                        Sold Out
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 flex items-center shadow-sm">
                        <CheckCircle className="h-3 w-3 mr-0.5" />
                        Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                {/* Category and Prep Time */}
                <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3">
                  <div className="flex items-center mr-2 bg-amber-50 px-2 py-1 rounded-md">
                    <Tag className="h-3 w-3 mr-1 text-amber-600" />
                    <span className="font-medium text-amber-700">{getCategoryLabel(item.category)}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{item.preperationtime} prep time</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedMenuItem(item);
                      setShowMenuItemDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Utensils className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleUpdateMenuItem(item)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Update</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Utensils className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No menu items found</h3>
            <p className="text-sm text-gray-500 mb-4">There are no menu items matching your current filters.</p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setSearchQuery("");
              }}
              className="text-sm font-medium text-amber-600 hover:text-amber-800"
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