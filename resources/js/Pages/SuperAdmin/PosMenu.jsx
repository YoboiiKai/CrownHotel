import React, { useState, useEffect } from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
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
  Filter,
  Eye
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
    background: #8B5A2B;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6B4226;
  }
  
  .pos-table th,
  .pos-table td {
    padding: 0.5rem;
    text-align: left;
  }
  
  .pos-table tbody tr:hover {
    background-color: #f5f5f4;
  }
`;

export default function PosMenu() {
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
  const [tableNumber, setTableNumber] = useState("");
  const [serviceType, setServiceType] = useState("room"); // room, table
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false); // Senior citizen discount toggle
  const [isSubmitting, setIsSubmitting] = useState(false); // Track order submission state
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash, card, mobile
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, processing, success, failed

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
  const filteredItems = menuItems.filter((item) => {
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
      // Toast removed
    } else {
      // Add new item to cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
      // Toast removed
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
  const handleOrderSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add items before placing an order.");
      return;
    }
    
    // Validate room or table number based on service type
    if (serviceType === 'room' && !roomNumber.trim()) {
      toast.error("Please enter a room number for room service.");
      return;
    } else if (serviceType === 'table' && !tableNumber.trim()) {
      toast.error("Please enter a table number for table service.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          menu_id: item.id,
          name: item.menuname,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        service_type: serviceType,
        room_number: serviceType === 'room' ? roomNumber : null,
        table_number: serviceType === 'table' ? tableNumber : null,
        customerName: 'Guest', // Adding required field
        notes: orderNotes,
        subtotal: parseFloat(calculateSubtotal()),
        discount: parseFloat(calculateDiscount()),
        total: parseFloat(calculateTotal()),
        is_senior_citizen: isSeniorCitizen,
        payment_method: paymentMethod
      };
      
      console.log('Submitting order data:', orderData);
      
      // If payment method is not cash, show payment form
      if (paymentMethod !== 'cash') {
        setShowPaymentForm(true);
        setPaymentStatus('processing');
        
        // Here you would integrate with payment gateway
        // This is a placeholder for the actual payment processing
        // In a real implementation, you would redirect to payment gateway or show a form
        
        // Simulate payment processing for now
        setTimeout(() => {
          // Payment successful
          setPaymentStatus('success');
          
          // Continue with order submission
          submitOrderToServer(orderData);
        }, 2000);
        
        return;
      }
      
      // If payment method is cash, submit order directly
      await submitOrderToServer(orderData);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit your order. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitOrderToServer = async (orderData) => {
    try {
      // Send order to API
      const response = await axios.post('/api/orders', orderData);
      console.log('Order response:', response.data);
      
      // Show success message
      setOrderSuccess(true);
      setShowOrderConfirmation(true);
      toast.success("Order placed successfully!");
      
      // Reset payment status
      setPaymentStatus(null);
      setShowPaymentForm(false);
      
      // Clear cart after successful order
      // Note: We don't clear immediately to allow the user to see what they ordered
      // The cart will be cleared when they close the confirmation modal
      
    } catch (error) {
      console.error('Error submitting order to server:', error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(`Failed to place order: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        console.error("Request error:", error.request);
        toast.error("No response received from server. Please try again.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
      setPaymentStatus('failed');
    }
  };

  return (
    <SuperAdminLayout>
      {/* Apply custom scrollbar styles */}
      <style>{scrollbarStyles}</style>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      

      {/* Main Content with Side-by-Side Layout */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 min-h-screen">
        {/* Menu Section - Left Side */}
        <div className="lg:w-3/4 flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#A67C52]/20 transition-all"
                />
              </div>
            </div>
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
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "appetizer" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("appetizer")}
            >
              Appetizers
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "main_course" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("main_course")}
            >
              Main Courses
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "dessert" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("dessert")}
            >
              Desserts
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${filterCategory === "beverage" ? "text-[#8B5A2B] border-b-2 border-[#8B5A2B]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setFilterCategory("beverage")}
            >
              Beverages
            </button>
          </div>

          {/* Menu Items Container */}
          <div className="pr-2 pb-4">
            {/* Menu Item Cards - Landscape Layout with Square Image and Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden border border-[#DEB887]/30 bg-gradient-to-br from-[#F5EFE7] to-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
                >
                  {/* Card Content - Landscape Layout */}
                  <div className="flex flex-row h-[120px]">
                    {/* Square Image Container - Left Side */}
                    <div className="w-[120px] h-[120px] relative flex-shrink-0 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10">
                      {/* Image */}
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={item.image ? item.image.startsWith('/') ? item.image : `/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={item.menuname}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2 z-10">
                          {item.status === 'sold_out' ? (
                            <div className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-red-100 text-red-800 flex items-center shadow-sm">
                              <X className="h-2 w-2 mr-0.5" />
                              Sold Out
                            </div>
                          ) : (
                            <div className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-green-100 text-green-800 flex items-center shadow-sm">
                              <Check className="h-2 w-2 mr-0.5" />
                              Available
                            </div>
                          )}
                        </div>
                        
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-2 left-2 z-10">
                          <div className="flex items-center gap-0.5 bg-white/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-white text-[8px] shadow-sm border border-white/10">
                            <PhilippinePeso className="h-2.5 w-2.5" />
                            <span className="font-bold">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Information Section - Square Right Side */}
                    <div className="p-2 relative bg-gradient-to-br from-white to-[#F5EFE7]/20 w-[120px] h-[120px] flex flex-col">
                      {/* Menu Name */}
                      <div className="mb-0.5">
                        <h3 className="text-xs font-semibold text-[#5D3A1F] truncate">{item.menuname}</h3>
                      </div>
                      
                      {/* Category Tag and Prep Time */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-0.5 text-[8px] text-[#8B5A2B]">
                          <span className="truncate max-w-[60px]">{getCategoryLabel(item.category)}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[8px] text-gray-500">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{item.preperationtime || "15 min"}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-[9px] text-gray-600 line-clamp-2 mb-auto">{item.description}</p>
                      
                      {/* Footer Effect */}
                      <div className="mt-1 mb-1">
                        <div className="h-px w-full bg-gradient-to-r from-[#DEB887]/30 to-transparent"></div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowMenuItemDetails(item)}
                          className="flex-1 flex items-center justify-center gap-0.5 rounded-md bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] px-1 py-0.5 h-6 text-[8px] font-medium text-white shadow-sm hover:from-[#8B5A2B] hover:to-[#6B4226] focus:outline-none focus:ring-1 focus:ring-[#A67C52] transition-all"
                        >
                          <Eye className="h-2 w-2" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={item.status === 'sold_out'}
                          className={`h-6 w-6 flex items-center justify-center rounded-md ${item.status === 'sold_out' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border border-[#A67C52] bg-white text-[#8B5A2B] hover:bg-[#A67C52]/10'} transition-all duration-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]`}
                        >
                          <ShoppingCart className="h-2 w-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-[#F5EFE7] p-3 mb-4">
                  <Utensils className="h-6 w-6 text-[#8B5A2B]" />
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
        <div className="lg:w-1/4 max-w-md">
          <div className="rounded-lg border border-[#DEB887]/30 bg-white shadow-md sticky top-4 h-[calc(100vh-100px)] flex flex-col">
            {/* Cart Header */}
            <div className="p-3 border-b border-[#DEB887]/30 bg-gradient-to-r from-[#A67C52]/10 to-[#F5EFE7]/50">
              <h2 className="text-base font-semibold text-[#5D3A1F] flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#A67C52] to-[#8B5A2B] flex items-center justify-center shadow-sm">
                  <ShoppingCart className="h-3 w-3 text-white" />
                </div>
                Your Order
                {cart.length > 0 && (
                  <span className="ml-auto bg-white text-[#6B4226] text-[10px] font-medium rounded-full px-2 py-0.5 border border-[#DEB887]/30 shadow-sm flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center mr-1">
                      <span className="text-[8px] text-[#8B5A2B] font-bold">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                    </span>
                    <span>items</span>
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Cart Items Section - Scrollable */}
              <div className="p-3 flex-1 overflow-y-auto custom-scrollbar mb-2">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[180px] text-center">
                    <div className="rounded-full bg-gradient-to-r from-[#A67C52]/10 to-[#F5EFE7] p-3 mb-3 shadow-sm">
                      <ShoppingCart className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <p className="text-[#5D3A1F] text-sm mb-1 font-medium">Your cart is empty</p>
                    <p className="text-xs text-[#8B5A2B]/70">Add items from the menu to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 pb-2 border-b border-[#DEB887]/20 group hover:bg-[#F5EFE7]/30 p-1.5 rounded-md transition-all">
                        {/* Item Image */}
                        <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-[#DEB887]/20 relative">
                          <img 
                            src={item.image ? item.image.startsWith('/') ? item.image : `/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"} 
                            alt={item.menuname} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                          />
                          {/* Quantity Badge */}
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#8B5A2B] text-white text-[8px] font-bold flex items-center justify-center shadow-md border border-white">
                            {item.quantity}
                          </div>
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-medium text-[#5D3A1F] truncate pr-1">{item.menuname}</h3>
                            {/* Remove Button - Always visible but subtle */}
                            <button
                              onClick={() => removeFromCart(item.id, true)}
                              className="h-4 w-4 flex items-center justify-center rounded-full bg-white/80 text-red-400 border border-red-100/50 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                              title="Remove from cart"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1.5">
                            {/* Price */}
                            <div className="flex items-center gap-0.5 bg-[#F5EFE7]/80 px-1.5 py-0.5 rounded-md shadow-sm">
                              <PhilippinePeso className="h-2.5 w-2.5 text-[#8B5A2B]" />
                              <span className="text-[10px] font-bold text-[#8B5A2B]">{item.price}</span>
                              <span className="text-[8px] text-[#8B5A2B]/70 ml-0.5">× {item.quantity}</span>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-white rounded-md shadow-sm border border-[#DEB887]/20 px-1 py-0.5">
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="h-5 w-5 flex items-center justify-center rounded-sm bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 text-[#8B5A2B] hover:from-[#A67C52]/20 hover:to-[#8B5A2B]/20 transition-all"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <button 
                                onClick={() => addToCart(item)}
                                className="h-5 w-5 flex items-center justify-center rounded-sm bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white hover:from-[#8B5A2B] hover:to-[#6B4226] transition-all"
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
              <div className="border-t border-[#DEB887]/30 p-3 bg-gradient-to-b from-white to-[#F5EFE7]/50 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  {/* Service Type Selection */}
                  <div className="bg-white rounded-md p-2 shadow-sm border border-[#DEB887]/20">
                    <label className="block text-xs font-medium text-[#5D3A1F] mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#8B5A2B]">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Service Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className={`flex items-center justify-center p-2 rounded-md cursor-pointer transition-all ${serviceType === 'room' ? 'bg-[#F5EFE7] border-[#DEB887] border' : 'bg-white border border-[#DEB887]/20 hover:bg-[#F5EFE7]/30'}`}
                        onClick={() => setServiceType('room')}
                      >
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${serviceType === 'room' ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' : 'bg-[#F5EFE7]/50 text-[#8B5A2B]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7v11m0-7h18m0-7v18" />
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-medium text-[#5D3A1F]">Room Service</span>
                      </div>
                      
                      <div 
                        className={`flex items-center justify-center p-2 rounded-md cursor-pointer transition-all ${serviceType === 'table' ? 'bg-[#F5EFE7] border-[#DEB887] border' : 'bg-white border border-[#DEB887]/20 hover:bg-[#F5EFE7]/30'}`}
                        onClick={() => setServiceType('table')}
                      >
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${serviceType === 'table' ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' : 'bg-[#F5EFE7]/50 text-[#8B5A2B]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-medium text-[#5D3A1F]">Table Service</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Room or Table Number based on service type */}
                  <div className="bg-white rounded-md p-2 shadow-sm border border-[#DEB887]/20">
                    <label htmlFor={serviceType === 'room' ? "roomNumber" : "tableNumber"} className="block text-xs font-medium text-[#5D3A1F] mb-1 flex items-center">
                      {serviceType === 'room' ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#8B5A2B]">
                            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M2 10h20"></path>
                          </svg>
                          Room Number
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#8B5A2B]">
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                          Table Number
                        </>
                      )}
                    </label>
                    {serviceType === 'room' ? (
                      <input 
                        type="text" 
                        id="roomNumber"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full rounded-md border border-[#DEB887]/30 px-2 py-1.5 text-xs text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20 bg-[#F5EFE7]/20"
                        placeholder="Enter room number"
                      />
                    ) : (
                      <input 
                        type="text" 
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full rounded-md border border-[#DEB887]/30 px-2 py-1.5 text-xs text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20 bg-[#F5EFE7]/20"
                        placeholder="Enter table number"
                      />
                    )}
                  </div>
                  
                  {/* Senior Citizen Discount */}
                  <div className="flex items-center bg-white rounded-md p-2 shadow-sm border border-[#DEB887]/20">
                    <input
                      type="checkbox"
                      id="seniorDiscount"
                      checked={isSeniorCitizen}
                      onChange={() => setIsSeniorCitizen(!isSeniorCitizen)}
                      className="h-3 w-3 text-[#8B5A2B] focus:ring-[#A67C52] border-[#DEB887]/30 rounded"
                    />
                    <label htmlFor="seniorDiscount" className="ml-2 block text-xs text-[#5D3A1F]">
                      Apply Senior Citizen Discount (20%)
                    </label>
                  </div>
                  
                  {/* Special Instructions */}
                  <div className="bg-white rounded-md p-2 shadow-sm border border-[#DEB887]/20">
                    <label htmlFor="orderNotes" className="block text-xs font-medium text-[#5D3A1F] mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea 
                      id="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full rounded-md border border-[#DEB887]/30 px-2 py-1.5 text-xs text-[#5D3A1F] focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#A67C52]/20 bg-[#F5EFE7]/20"
                      placeholder="Any special requests or dietary requirements?"
                      rows="2"
                    ></textarea>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="bg-white rounded-md p-2 shadow-sm border border-[#DEB887]/20">
                    <label className="block text-xs font-medium text-[#5D3A1F] mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#8B5A2B]">
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div 
                        className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${paymentMethod === 'cash' ? 'bg-[#F5EFE7] border-[#DEB887] border' : 'bg-white border border-[#DEB887]/20 hover:bg-[#F5EFE7]/30'}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${paymentMethod === 'cash' ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' : 'bg-[#F5EFE7]/50 text-[#8B5A2B]'}`}>
                          <PhilippinePeso className="h-3 w-3" />
                        </div>
                        <span className="text-[10px] font-medium text-[#5D3A1F]">Cash</span>
                      </div>
                      
                      <div 
                        className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-[#F5EFE7] border-[#DEB887] border' : 'bg-white border border-[#DEB887]/20 hover:bg-[#F5EFE7]/30'}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${paymentMethod === 'card' ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' : 'bg-[#F5EFE7]/50 text-[#8B5A2B]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-medium text-[#5D3A1F]">Card</span>
                      </div>
                      
                      <div 
                        className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${paymentMethod === 'mobile' ? 'bg-[#F5EFE7] border-[#DEB887] border' : 'bg-white border border-[#DEB887]/20 hover:bg-[#F5EFE7]/30'}`}
                        onClick={() => setPaymentMethod('mobile')}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${paymentMethod === 'mobile' ? 'bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] text-white' : 'bg-[#F5EFE7]/50 text-[#8B5A2B]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-medium text-[#5D3A1F]">Mobile</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-[#F5EFE7]/70 to-white rounded-md p-2 shadow-sm border border-[#DEB887]/30 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5D3A1F]/70">Subtotal</span>
                      <span className="font-medium text-[#5D3A1F]">₱{calculateSubtotal()}</span>
                    </div>
                    
                    {isSeniorCitizen && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">Senior Discount (20%)</span>
                        <span className="font-medium text-green-600">-₱{calculateDiscount()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#DEB887]/20">
                      <span className="text-sm font-medium text-[#5D3A1F]">Total</span>
                      <span className="text-base font-bold text-[#8B5A2B]">₱{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  {/* Footer Effect */}
                  <div className="h-px w-full bg-gradient-to-r from-[#DEB887]/30 to-transparent mb-2"></div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearCart}
                      className="flex-none h-10 px-3 rounded-lg border border-[#DEB887]/30 bg-white text-[#5D3A1F] text-xs font-medium hover:bg-gradient-to-r hover:from-[#F5EFE7] hover:via-[#DEB887]/20 hover:to-[#F5EFE7]/10 hover:text-[#8B5A2B] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
                      disabled={cart.length === 0}
                    >
                      <X className="h-4 w-4 transition-transform group-hover:rotate-45" />
                    </button>
                    <button
                      onClick={handleOrderSubmit}
                      className={`flex-1 h-10 px-4 rounded-lg text-white text-xs font-medium shadow-sm flex items-center justify-center gap-2 ${
                        cart.length === 0 || isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] hover:from-[#8B5A2B] hover:to-[#6B4226]/90 active:scale-95 transition-all duration-200"
                      }`}
                      disabled={cart.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span className="font-semibold">Complete Order</span>
                        </>
                      )}
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
      
      {/* Payment Processing Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] p-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                {paymentMethod === 'card' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                )}
                {paymentMethod === 'card' ? 'Card Payment' : 'Mobile Payment'}
              </h3>
            </div>
            
            <div className="p-4">
              {paymentStatus === 'processing' ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 border-4 border-[#F5EFE7] border-t-[#8B5A2B] rounded-full animate-spin mb-4"></div>
                  <p className="text-[#5D3A1F] font-medium">Processing Payment</p>
                  <p className="text-gray-500 text-sm mt-2">Please do not close this window...</p>
                </div>
              ) : paymentStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">Payment Successful</p>
                  <p className="text-gray-500 text-sm mt-2">Your order is being processed.</p>
                </div>
              ) : paymentStatus === 'failed' ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-red-600 font-medium">Payment Failed</p>
                  <p className="text-gray-500 text-sm mt-2">Please try again or choose a different payment method.</p>
                  
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setPaymentStatus('processing');
                        // Simulate payment retry
                        setTimeout(() => {
                          setPaymentStatus('success');
                          submitOrderToServer({
                            items: cart.map(item => ({
                              menu_id: item.id,
                              quantity: item.quantity,
                              price: item.price,
                              subtotal: item.price * item.quantity
                            })),
                            service_type: serviceType,
                            room_number: serviceType === 'room' ? roomNumber : null,
                            table_number: serviceType === 'table' ? tableNumber : null,
                            customerName: 'Guest',
                            notes: orderNotes,
                            subtotal: parseFloat(calculateSubtotal()),
                            discount: parseFloat(calculateDiscount()),
                            total: parseFloat(calculateTotal()),
                            is_senior_citizen: isSeniorCitizen,
                            payment_method: paymentMethod,
                            payment_status: 'completed'
                          });
                        }, 2000);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] text-white rounded-md text-sm font-medium"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => {
                        setShowPaymentForm(false);
                        setPaymentStatus(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Payment form fields would go here */}
                  <div className="bg-[#F5EFE7]/30 p-4 rounded-md border border-[#DEB887]/30">
                    <p className="text-sm text-[#5D3A1F]">This is a placeholder for the payment gateway integration.</p>
                    <p className="text-xs text-gray-500 mt-1">In a production environment, this would connect to a secure payment processor.</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#5D3A1F]">Total Amount:</span>
                      <span className="font-bold text-[#8B5A2B]">₱{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setPaymentStatus('processing');
                        // Simulate payment processing
                        setTimeout(() => {
                          setPaymentStatus('success');
                          submitOrderToServer({
                            items: cart.map(item => ({
                              menu_id: item.id,
                              quantity: item.quantity,
                              price: item.price,
                              subtotal: item.price * item.quantity
                            })),
                            service_type: serviceType,
                            room_number: serviceType === 'room' ? roomNumber : null,
                            table_number: serviceType === 'table' ? tableNumber : null,
                            customerName: 'Guest',
                            notes: orderNotes,
                            subtotal: parseFloat(calculateSubtotal()),
                            discount: parseFloat(calculateDiscount()),
                            total: parseFloat(calculateTotal()),
                            is_senior_citizen: isSeniorCitizen,
                            payment_method: paymentMethod,
                            payment_status: 'completed'
                          });
                        }, 2000);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-[#A67C52] via-[#8B5A2B] to-[#6B4226] text-white rounded-md text-sm font-medium"
                    >
                      Process Payment
                    </button>
                    <button 
                      onClick={() => {
                        setShowPaymentForm(false);
                        setPaymentStatus(null);
                        setIsSubmitting(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}