import React, { useState } from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  Search,
  Filter,
  ChevronDown,
  DollarSign,
  Tag,
  Clock,
  Utensils,
  Coffee,
  Star,
  Heart,
  Send,
  Check
} from "lucide-react";

export default function Menu() {
  // Menu items data
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

  // State for UI controls
  const [showMenuItemDetails, setShowMenuItemDetails] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  // Cart functions
  const addToCart = (item) => {
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
    } else {
      // Add new item to cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
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
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Handle order submission
  const handleOrderSubmit = () => {
    if (cart.length === 0) return;
    
    if (!roomNumber.trim()) {
      alert("Please enter your room number to proceed with the order.");
      return;
    }
    
    // Here you would typically send the order to your backend
    // For now, we'll just simulate a successful order
    setShowOrderConfirmation(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrderSuccess(true);
      // Reset cart after successful order
      setTimeout(() => {
        clearCart();
        setShowOrderConfirmation(false);
        setOrderSuccess(false);
        setShowCart(false);
      }, 3000);
    }, 1500);
  };

  return (
    <ClientLayout>
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
                    addToCart(showMenuItemDetails);
                    setShowMenuItemDetails(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
              <button 
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full bg-amber-100 p-3 mb-4">
                    <ShoppingCart className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                  <p className="text-gray-500 text-center max-w-xs">
                    Browse our menu and add some delicious items to your cart.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3 text-amber-600" />
                          <span className="text-sm font-medium text-amber-600">{item.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="p-1 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input 
                    type="text" 
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Enter your room number"
                  />
                </div>
                
                <div>
                  <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea 
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Any special requests or dietary requirements?"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-between py-2 border-t border-b border-gray-200">
                  <span className="text-base font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-amber-600">${calculateTotal()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-amber-900"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            {!orderSuccess ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
                <p className="text-gray-600">Please wait while we process your order...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-green-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-6">Your order will be delivered to Room {roomNumber} shortly.</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      clearCart();
                      setShowOrderConfirmation(false);
                      setOrderSuccess(false);
                      setShowCart(false);
                    }}
                    className="py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-amber-900"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
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
          </div>
          
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all w-full sm:w-auto justify-center relative"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
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
              <div 
                className="relative h-36 w-full overflow-hidden cursor-pointer"
                onClick={() => setShowMenuItemDetails(item)}
              >
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
                    <h3 
                      className="text-sm font-semibold text-gray-900 truncate cursor-pointer hover:text-amber-600"
                      onClick={() => setShowMenuItemDetails(item)}
                    >
                      {item.name}
                    </h3>
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
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
                  >
                    <Utensils className="h-3 w-3" />
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-1.5 text-xs font-medium text-white shadow-sm hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>Add to Cart</span>
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
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}