import React from "react";
import {
  X,
  PhilippinePeso,
  Clock,
  Check,
  Minus,
  Plus,
  ShoppingCart
} from "lucide-react";

export default function MenuItemDetailsModal({
  showMenuItemDetails,
  setShowMenuItemDetails,
  cart,
  addToCart,
  removeFromCart,
  getCategoryLabel
}) {
  // Remove the null check to ensure the modal always renders
  // The visibility will be controlled by CSS based on the showMenuItemDetails prop
  
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${showMenuItemDetails ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Only render content if showMenuItemDetails is true */}
        {showMenuItemDetails && (
          <>
            {/* Menu item image */}
            <div className="relative h-48 w-full">
              <img
                src={showMenuItemDetails.image ? `/${showMenuItemDetails.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                alt={showMenuItemDetails.menuname}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white mb-1">{showMenuItemDetails.menuname}</h2>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {getCategoryLabel(showMenuItemDetails.category)}
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{showMenuItemDetails.preperationtime} minutes preparation time</span>
                  </div>
                </div>
              </div>
              {/* Close button moved inside the image section, top right */}
              <button
                onClick={() => setShowMenuItemDetails(null)}
                className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-gray-600 hover:bg-white hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Menu item details */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <PhilippinePeso className="h-4 w-4 text-amber-600" />
                  <span className="text-lg font-bold text-amber-600">{showMenuItemDetails.price}</span>
                </div>
                {showMenuItemDetails.status === 'sold_out' ? (
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    Sold Out
                  </div>
                ) : (
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Available
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 text-sm mb-6">{showMenuItemDetails.description}</p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => {
                      const existingItem = cart.find(item => item.id === showMenuItemDetails.id);
                      if (existingItem && existingItem.quantity > 1) {
                        removeFromCart(showMenuItemDetails.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={!cart.find(item => item.id === showMenuItemDetails.id) || cart.find(item => item.id === showMenuItemDetails.id)?.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-medium">
                    {cart.find(item => item.id === showMenuItemDetails.id)?.quantity || 0}
                  </span>
                  <button
                    onClick={() => addToCart(showMenuItemDetails)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
}
