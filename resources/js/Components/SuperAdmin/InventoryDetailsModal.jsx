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
  XCircle,
  Utensils,
  ArrowDownUp,
  Box,
  Info,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackagePlus,
  PackageMinus,
  PackageSearch,
  Package2
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
      return { status: "low-stock", color: "bg-[#F5EFE7] text-[#8B5A2B]" }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-tr border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Package2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Inventory Details</h3>
                <p className="text-xs text-white/80">View and manage inventory item information</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Item Header with Status */}
          <div className="p-5 bg-gradient-to-r from-[#A67C52]/10 to-[#8B5A2B]/10 rounded-lg border border-[#DEB887]/30 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center"></div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-[#5D3A1F]">{item.itemName}</h4>
                  <p className="text-sm text-[#6B4226]/80 mt-1 flex items-center">
                    <Hash className="h-3.5 w-3.5 mr-1" />
                    {item.itemCode}
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
                    <span className="inline-flex items-center rounded-full bg-[#F5EFE7] px-2.5 py-0.5 text-xs font-medium text-[#8B5A2B]">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Below minimum
                    </span>
                  )}
                </div>
              </div>
              
              {/* Stock Level Visualization */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-[#6B4226]">Stock Level</p>
                  <p className="text-xs text-[#6B4226]/80">
                    <span className="font-medium">{item.quantity}</span> / {item.minStockLevel} {item.unit}
                  </p>
                </div>
                <div className="w-full bg-[#E5D3B3] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.quantity <= 0 
                        ? 'bg-red-600' 
                        : item.quantity < item.minStockLevel 
                          ? 'bg-[#8B5A2B]' 
                          : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(100, (item.quantity / (item.minStockLevel * 1.5)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Item Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Item Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                  <h4 className="text-sm font-medium text-[#5D3A1F]">Item Details</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <Tag className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Category</p>
                      <p className="text-sm font-medium text-[#5D3A1F]">{getCategoryLabel(item.category)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <Package className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Current Quantity</p>
                      <p className="text-sm font-medium text-[#5D3A1F]">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <AlertTriangle className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Min Stock Level</p>
                      <p className="text-sm font-medium text-[#5D3A1F]">{item.minStockLevel} {item.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <DollarSign className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Price</p>
                      <p className="text-sm font-medium text-[#5D3A1F]">₱{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location & Supplier Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                  <h4 className="text-sm font-medium text-[#5D3A1F]">Location & Supplier</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <MapPin className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Storage Location</p>
                      <p className="text-sm font-medium text-[#5D3A1F] truncate">
                        {item.location ? item.location.charAt(0).toUpperCase() + item.location.slice(1) : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                      <Building className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B4226]/70 mb-0.5">Supplier</p>
                      <p className="text-sm font-medium text-[#5D3A1F] truncate">{item.supplier || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Empty since we moved Dates to full width */}
            <div className="space-y-6">
              {/* Content moved to full width section below */}
            </div>
          </div>
          
          {/* Dates Section - Full Width */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Dates</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  <Calendar className="h-5 w-5 text-[#8B5A2B]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">Last Restocked</p>
                  <p className="text-sm font-medium text-[#5D3A1F]">
                    {item.lastRestocked ? formatDate(item.lastRestocked) : 'Never'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  <Calendar className="h-5 w-5 text-[#8B5A2B]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">Created At</p>
                  <p className="text-sm font-medium text-[#5D3A1F]">
                    {item.created_at ? formatDate(item.created_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description Section - Full Width */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Description</h4>
            </div>
            
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg p-4 border border-[#DEB887]/30 shadow-sm w-full">
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 text-[#8B5A2B] mr-2" />
                <h5 className="text-xs font-medium text-[#5D3A1F]">Item Description</h5>
              </div>
              
              <div className="rounded-lg p-3 border border-[#DEB887]/20 text-sm text-[#5D3A1F] italic">
                {item.description || 'No description provided for this item.'}
              </div>
            </div>
          </div>
          
          {/* Footer - Action Buttons */}
          <div className="space-y-4 pt-6 border-t border-[#DEB887]/30 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Inventory Actions</h4>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {item.quantity <= item.minStockLevel && (
                <button 
                  onClick={() => handleStatusChange('restocked')}
                  disabled={isChangingStatus}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                >
                  <PackagePlus className="h-4 w-4" />
                  {isChangingStatus ? 'Updating...' : 'Mark as Restocked'}
                </button>
              )}
              
              <button
                onClick={onClose}
                className="ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#5D3A1F] bg-white border border-[#DEB887]/40 rounded-lg shadow-sm hover:bg-[#F5EFE7]/50 focus:outline-none focus:ring-2 focus:ring-[#DEB887] focus:ring-offset-1 transition-all duration-300"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}