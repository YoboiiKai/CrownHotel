import React, { useState } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
  Plus,
  Trash,
  Edit,
  X,
  Search,
  Filter,
  ChevronDown,
  DollarSign,
  Clock,
  Utensils,
  Coffee
} from "lucide-react";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
      price: 12.99,
      category: "main_course",
      prepTime: "15 min",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Traditional pizza with tomato sauce, mozzarella, and fresh basil",
      price: 14.99,
      category: "main_course",
      prepTime: "20 min",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream",
      price: 8.99,
      category: "dessert",
      prepTime: "15 min",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, croutons, parmesan cheese, and Caesar dressing",
      price: 9.99,
      category: "appetizer",
      prepTime: "10 min",
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 5,
      name: "Iced Coffee",
      description: "Chilled coffee served with ice, cream, and your choice of flavored syrup",
      price: 4.99,
      category: "beverage",
      prepTime: "5 min",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      id: 6,
      name: "Seafood Pasta",
      description: "Linguine pasta with shrimp, mussels, and calamari in a light tomato sauce",
      price: 18.99,
      category: "main_course",
      prepTime: "25 min",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ]);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [showMenuItemDetails, setShowMenuItemDetails] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    prepTime: "",
    image: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMenuItem = (e) => {
    e.preventDefault();
    setMenuItems([...menuItems, { ...formData, id: menuItems.length + 1 }]);
    setFormData({ name: "", description: "", price: "", category: "", prepTime: "", image: "" });
    setShowAddMenuForm(false);
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const categories = {
      appetizer: "Appetizer",
      main_course: "Main Course",
      dessert: "Dessert",
      beverage: "Beverage"
    };
    return categories[category] || category;
  };

  // Filter menu items based on category and search query
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryLabel(item.category).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SuperAdminLayout>
      {/* Menu Item Details Modal */}
      {showMenuItemDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={showMenuItemDetails.image}
                alt={showMenuItemDetails.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setShowMenuItemDetails(null)}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white">{showMenuItemDetails.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white">
                    {getCategoryLabel(showMenuItemDetails.category)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">{showMenuItemDetails.price}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{showMenuItemDetails.prepTime} prep time</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{showMenuItemDetails.description}</p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => {
                    handleDeleteMenuItem(showMenuItemDetails.id);
                    setShowMenuItemDetails(null);
                  }}
                  className="flex items-center justify-center gap-1 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => {
                    // Edit functionality would go here
                    setShowMenuItemDetails(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Form Modal */}
      {showAddMenuForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Menu Item</h3>
                <button onClick={() => setShowAddMenuForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddMenuItem}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter item name" />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter item price" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200">
                      <option value="">Select a category</option>
                      <option value="appetizer">Appetizer</option>
                      <option value="main_course">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                    <input type="text" id="prepTime" name="prepTime" value={formData.prepTime} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="e.g. 15 min" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter item description" rows="3"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Enter image URL" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => setShowAddMenuForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg">Add Menu Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {/* Action Bar */}
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
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all">
                <Filter className="h-4 w-4 text-gray-400" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
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
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "appetizer" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("appetizer")}
          >
            Appetizers
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "main_course" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("main_course")}
          >
            Main Courses
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "dessert" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("dessert")}
          >
            Desserts
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "beverage" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setFilterCategory("beverage")}
          >
            Beverages
          </button>
        </div>

        {/* Menu Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Menu Item Image */}
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {getCategoryLabel(item.category)}
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                {/* Menu Item Info */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-amber-600" />
                      <span className="font-medium text-amber-600 text-sm">{item.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{item.prepTime} prep time</p>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowMenuItemDetails(item)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <Utensils className="h-3 w-3" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Coffee className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No menu items found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter to find what you're looking for, or add a new menu item.
            </p>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}