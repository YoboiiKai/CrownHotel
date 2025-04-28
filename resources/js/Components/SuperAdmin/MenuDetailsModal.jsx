import React, { useState } from "react";
import { X, PhilippinePeso, Clock, Tag, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MenuDetailsModal({ 
  show,
  onClose,
  menuItem,
  onDelete,
  onUpdate,
  onStatusUpdate,
  getCategoryLabel 
}) {
  const [isMarkingAvailable, setIsMarkingAvailable] = useState(false);
  const [isMarkingSoldOut, setIsMarkingSoldOut] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(menuItem?.status || 'available');

  if (!show || !menuItem) return null;

  const handleMarkAvailable = async () => {
    setIsMarkingAvailable(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/menu/${menuItem.id}/status`, {
        status: 'available'
      });
      
      const updatedMenuItem = response.data.menu || {...menuItem, status: 'available'};
      setStatus('available');
      
      if (onStatusUpdate) {
        onStatusUpdate(updatedMenuItem);
      } else {
        toast.success("Menu item marked as Available successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error marking menu item as available:", error);
      setError("Failed to mark menu item as available. Please try again.");
      toast.error("Failed to update menu item status. Please try again.");
    } finally {
      setIsMarkingAvailable(false);
    }
  };

  const handleMarkSoldOut = async () => {
    setIsMarkingSoldOut(true);
    setError(null);
    
    try {
      const response = await axios.put(`/api/menu/${menuItem.id}/status`, {
        status: 'sold_out'
      });
      
      const updatedMenuItem = response.data.menu || {...menuItem, status: 'sold_out'};
      setStatus('sold_out');
      
      if (onStatusUpdate) {
        onStatusUpdate(updatedMenuItem);
      } else {
        toast.success("Menu item marked as Sold Out successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error marking menu item as sold out:", error);
      setError("Failed to mark menu item as sold out. Please try again.");
      toast.error("Failed to update menu item status. Please try again.");
    } finally {
      setIsMarkingSoldOut(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slideIn">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={menuItem.image ? `/${menuItem.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
            alt={menuItem.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white">{menuItem.menuname}</h2>
            <div className="flex items-center gap-2 mt-1">
              {status === 'sold_out' ? (
                <span className="px-2 py-1 bg-red-500/90 rounded-full text-xs font-medium text-white flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  Sold Out
                </span>
              ) : (
                <span className="px-2 py-1 bg-green-500/90 rounded-full text-xs font-medium text-white flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Available
                </span>
              )}
              <span className="px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {getCategoryLabel(menuItem.category)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <PhilippinePeso className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{menuItem.price}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{menuItem.preperationtime} prep time</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600">{menuItem.description}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 pb-2">Menu Item Actions</h4>
            
            <div className="flex flex-wrap gap-3">
              {status === 'sold_out' ? (
                <button 
                  onClick={handleMarkAvailable}
                  disabled={isMarkingAvailable}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isMarkingAvailable ? "Processing..." : "Mark as Available"}
                </button>
              ) : (
                <button 
                  onClick={handleMarkSoldOut}
                  disabled={isMarkingSoldOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-sm hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                >
                  <XCircle className="h-4 w-4" />
                  {isMarkingSoldOut ? "Processing..." : "Mark as Sold Out"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}