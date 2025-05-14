import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  Search,
  PhilippinePeso,
  Clock,
  Utensils,
  Coffee,
  Check,
  Trash2,
  Filter
} from "lucide-react";
import MenuItemDetailsModal from "@/Components/SuperAdmin/MenuItemDetailsModal";
import OrderConfirmationModal from "@/Components/SuperAdmin/OrderConfirmationModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom styles for the scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d97706;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #b45309;
  }
  
  .pos-table th,
  .pos-table td {
    padding: 0.5rem;
    text-align: left;
  }
  
  .pos-table tbody tr:hover {
    background-color: #fef3c7;
  }
`;

export default function AdminPosMenu() {
  // Menu items data
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for UI controls
  const [showMenuItemDetails, setShowMenuItemDetails] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false); // Senior citizen discount toggle
  const [isSubmitting, setIsSubmitting] = useState(false); // Track order submission state

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/menu?_t=${new Date().getTime()}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to fetch menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
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
    // First check if item exists to prevent errors with undefined items
    if (!item) return false;
    
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      (item.menuname ? item.menuname.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (item.category ? getCategoryLabel(item.category).toLowerCase().includes(searchQuery.toLowerCase()) : false);
    return matchesCategory && matchesSearch;
  });

  // Cart functions
  const addToCart = (item) => {
    // Check if item is sold out
    if (item.status === 'sold_out') {
      toast.error(`${item.menuname} is sold out and cannot be added to cart.`);
      return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item already exists in cart, increase quantity
      setCart(
        cart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        )
      );
      toast.success(`Added another ${item.menuname} to cart.`);
    } else {
      // Add new item to cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
      toast.success(`${item.menuname} added to cart.`);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem.quantity === 1) {
      // Remove item completely if quantity is 1
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      // Decrease quantity if more than 1
      setCart(
        cart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setOrderNotes("");
    setRoomNumber("");
  };

  // Calculate total price
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Apply 20% senior citizen discount if applicable
    const discount = isSeniorCitizen ? subtotal * 0.2 : 0;
    return (subtotal - discount).toFixed(2);
  };

  // Calculate subtotal (before discount)
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!isSeniorCitizen) return 0;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return (subtotal * 0.2).toFixed(2);
  };

  // Handle order submission
  const handleOrderSubmit = () => {
    if (cart.length === 0) return;
    
    if (!roomNumber.trim()) {
      toast.error("Please enter a room number to proceed with the order.");
      return;
    }
    
    // Prepare order data with multiple items
    const orderData = {
      roomNumber: roomNumber,
      items: cart.map(item => ({
        menuItemId: item.id,
        name: item.menuname,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: parseFloat(calculateSubtotal()),
      discount: parseFloat(calculateDiscount()),
      total: parseFloat(calculateTotal()),
      notes: orderNotes,
      isSeniorCitizen: isSeniorCitizen
    };
    
    setIsSubmitting(true);
    setShowOrderConfirmation(true);
    
    // Send order to backend
    axios.post('/api/orders', orderData)
      .then(response => {
        setOrderSuccess(true);
        toast.success("Order placed successfully!");
        
        // Reset cart after successful order
        setTimeout(() => {
          clearCart();
          setShowOrderConfirmation(false);
          setOrderSuccess(false);
        }, 3000);
      })
      .catch(error => {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
        setShowOrderConfirmation(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AdminLayout>
      <Head title="POS Menu" />
      {/* Apply custom scrollbar styles */}
      <style>{scrollbarStyles}</style>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      

      {/* Main Content with Side-by-Side Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu Section - Left Side */}
        <div className="lg:w-3/4">
          <div className="mb-6">
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
            </div>
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

          {/* Menu Items Container with Fixed Height and Scrolling */}
          <div className="h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
            {/* Menu Item Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Menu Item Image */}
                  <div className="relative">
                    <img
                      src={item.image ? `/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={item.menuname}
                      className="h-28 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {/* Price moved to top left */}
                    <div className="absolute top-2 left-2">
                      <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
                        <PhilippinePeso className="h-3 w-3 text-amber-600" />
                        <span className="font-semibold text-white text-sm">{item.price}</span>
                      </div>
                    </div>
                    {/* Status indicator in top right */}
                    <div className="absolute top-2 right-2">
                      {item.status === 'sold_out' ? (
                        <div className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 flex items-center">
                          <X className="h-2.5 w-2.5 mr-0.5" />
                          Sold Out
                        </div>
                      ) : (
                        <div className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 flex items-center">
                          <Check className="h-2.5 w-2.5 mr-0.5" />
                          Available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    {/* Category and Prep Time */}
                    <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2">
                      <div className="flex items-center mr-2 bg-amber-50 px-2 py-1 rounded-md">
                        
                        <span className="font-medium text-amber-700 text-[10px]">{getCategoryLabel(item.category)}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                        <Clock className="h-2.5 w-2.5 mr-1 text-gray-500" />
                        <span className="text-[10px]">{item.preperationtime || "15 min"} prep time</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xs font-semibold text-gray-900 mb-1 truncate">{item.menuname}</h3>
                    
                    {/* Description */}
                    <p className="text-[10px] text-gray-600 line-clamp-1 mb-2">{item.description}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setShowMenuItemDetails(item)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900"
                      >
                        <Utensils className="h-2.5 w-2.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.status === 'sold_out'}
                        className={`flex-1 flex items-center justify-center gap-1 rounded-lg ${
                          item.status === 'sold_out'
                            ? 'border border-gray-200 bg-gray-100 px-3 py-1.5 text-[10px] font-medium text-gray-400 cursor-not-allowed'
                            : 'border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all'
                        }`}
                      >
                        <ShoppingCart className={`h-2.5 w-2.5 ${item.status === 'sold_out' ? 'text-gray-400' : ''}`} />
                        <span>{item.status === 'sold_out' ? 'Sold Out' : 'Add'}</span>
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
                <p className="text-gray-500 text-center max-w-md">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-4 h-[calc(100vh-40px)] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
                Your Order
                {cart.length > 0 && (
                  <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-medium rounded-full px-2 py-0.5">
                    {cart.reduce((total, item) => total + item.quantity, 0)} items
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Cart Items Section - Scrollable */}
              <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-2">Your cart is empty</p>
                    <p className="text-xs text-gray-400">Add items from the menu to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image ? `/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"} alt={item.menuname} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] font-medium text-gray-900 truncate">{item.menuname}</h3>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <PhilippinePeso className="h-2.5 w-2.5 text-amber-600" />
                              <span className="text-[10px] font-medium text-amber-600">{item.price}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-0.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <span className="text-[10px] font-medium w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => addToCart(item)}
                                className="p-0.5 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Order Details Section - Always Visible */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="roomNumber" className="block text-xs font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input 
                      type="text" 
                      id="roomNumber"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter your room number"
                    />
                  </div>
                  

                  
                  {/* Senior Citizen Discount */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="seniorDiscount"
                      checked={isSeniorCitizen}
                      onChange={() => setIsSeniorCitizen(!isSeniorCitizen)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="seniorDiscount" className="ml-2 block text-xs text-gray-700">
                      Apply Senior Citizen Discount (20%)
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="orderNotes" className="block text-xs font-medium text-gray-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea 
                      id="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Any special requests or dietary requirements?"
                      rows="2"
                    ></textarea>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₱{calculateSubtotal()}</span>
                    </div>
                    
                    {isSeniorCitizen && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">Senior Discount (20%)</span>
                        <span className="font-medium text-green-600">-₱{calculateDiscount()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-2 border-t border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Total</span>
                      <span className="text-base font-bold text-amber-600">₱{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-50"
                      disabled={cart.length === 0}
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleOrderSubmit}
                      className={`flex-1 py-2 px-4 rounded-lg text-white text-xs font-medium ${
                        cart.length === 0 || isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"
                      }`}
                      disabled={cart.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Save Order"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Menu Item Details Modal */}
      <MenuItemDetailsModal
        showMenuItemDetails={showMenuItemDetails}
        setShowMenuItemDetails={setShowMenuItemDetails}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        getCategoryLabel={getCategoryLabel}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        showOrderConfirmation={showOrderConfirmation}
        orderSuccess={orderSuccess}
        roomNumber={roomNumber}
        clearCart={clearCart}
        setShowOrderConfirmation={setShowOrderConfirmation}
        setOrderSuccess={setOrderSuccess}
        isSubmitting={isSubmitting}
      />
    </AdminLayout>
  );
}