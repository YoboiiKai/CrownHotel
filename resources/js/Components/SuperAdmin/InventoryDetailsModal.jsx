import React, { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  Package, 
  Tag, 
  Hash, 
  DollarSign, 
  MapPin, 
  Building, 
  Calendar, 
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function InventoryDetailsModal({ 
  show, 
  onClose, 
  item, 
  onStatusChange
}) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  if (!show || !item) return null;
  
  // Helper functions
  const getCategoryLabel = (category) => {
    const categories = {
      food: "Food & Beverage",
      housekeeping: "Housekeeping",
      equipment: "Equipment",
      amenities: "Guest Amenities",
      maintenance: "Maintenance",
      office: "Office Supplies"
    }
    return categories[category] || category
  }
  
  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return { status: "out-of-stock", color: "bg-red-100 text-red-800" }
    } else if (item.quantity < item.minStockLevel) {
      return { status: "low-stock", color: "bg-amber-100 text-amber-800" }
    } else {
      return { status: "in-stock", color: "bg-green-100 text-green-800" }
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Handle status change for inventory item
  const handleStatusChange = (newStatus) => {
    setIsChangingStatus(true);
    
    // Call the API to update the status
    const updatedItem = {...item, status: newStatus};
    
    // Make API request to update status
    axios.post(`/api/inventory/${item.id}/status`, {
      status: newStatus,
      _method: 'PUT'
    })
    .then(response => {
      toast.success(`Inventory status changed to ${newStatus}`);
      // Call the onStatusChange callback with the updated item
      if (typeof onStatusChange === 'function') {
        onStatusChange(updatedItem);
      }
    })
    .catch(error => {
      console.error('Error updating inventory status:', error);
      toast.error('Failed to update inventory status. Please try again.');
    })
    .finally(() => {
      setIsChangingStatus(false);
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Modal Header with Gradient Icon */}
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Inventory Item Details</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">View and manage inventory item information</p>
            </div>
          </div>
          
          {/* Item Header with Status */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 mb-6 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{item.itemName}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <Hash className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {item.itemCode}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatus(item).color}`}>
                  {getStockStatus(item).status === "out-of-stock" 
                    ? "Out of Stock" 
                    : getStockStatus(item).status === "low-stock" 
                      ? "Low Stock" 
                      : "In Stock"}
                </div>
                {item.quantity < item.minStockLevel && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Below minimum
                  </span>
                )}
              </div>
            </div>
            
            {/* Stock Level Visualization */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium text-gray-700">Stock Level</p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{item.quantity}</span> / {item.minStockLevel} {item.unit}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.quantity <= 0 
                      ? 'bg-red-600' 
                      : item.quantity < item.minStockLevel 
                        ? 'bg-amber-600' 
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(100, (item.quantity / item.minStockLevel) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Category & Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Item Details Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2 mb-4">Item Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <p className="text-sm font-medium text-gray-800">{getCategoryLabel(item.category)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Quantity</p>
                      <p className="text-sm font-medium text-gray-800">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Min Stock Level</p>
                      <p className="text-sm font-medium text-gray-800">{item.minStockLevel} {item.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-medium text-gray-800">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location & Supplier Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2 mb-4">Location & Supplier</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Storage Location</p>
                      <p className="text-sm font-medium text-gray-800">
                        {item.location.charAt(0).toUpperCase() + item.location.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Supplier</p>
                      <p className="text-sm font-medium text-gray-800">{item.supplier || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Dates & Description */}
            <div className="space-y-6">
              {/* Dates Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2 mb-4">Dates</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Restocked</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(item.lastRestocked)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created At</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
                <div className="flex items-center mb-2">
                  <Tag className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                  <h5 className="text-xs font-semibold text-gray-900">Description</h5>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">
                  <p className="text-gray-700 italic">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col pt-3 border-t border-gray-100 mt-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {item.quantity <= item.minStockLevel && (
                <button 
                  onClick={() => handleStatusChange('restocked')}
                  disabled={isChangingStatus}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all disabled:opacity-70"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {isChangingStatus ? 'Updating...' : 'Mark as Restocked'}
                </button>
              )}
              
              <button
                onClick={onClose}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}