import React, { useState } from "react";
import { 
  X, 
  Edit, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Utensils,
  Coffee,
  PhilippinePeso,
  CreditCard
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function OrderDetailsModal({ order, show, onClose, onStatusChange }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState(null);
  
  if (!order || !show) return null;
  
  // Helper function to get the correct image path based on order data
  const getImagePath = (order, item, index) => {
    // Based on the memory: "Images are stored in the public directory with paths saved in the database as 'Menu/' + imageName"
    const defaultPath = `Menu/${item.menuItemId}.jpg`;
    
    // If no images data at all, use default
    if (!order.images) {
      return defaultPath;
    }
    
    // Handle array format
    if (Array.isArray(order.images) && order.images[index]) {
      // If the path already includes 'Menu/', return as is
      if (order.images[index].includes('Menu/')) {
        return order.images[index];
      }
      // Otherwise, ensure it has the correct prefix
      return order.images[index].startsWith('Menu/') ? order.images[index] : `Menu/${order.images[index]}`;
    }
    
    // Handle object format with numeric keys
    if (typeof order.images === 'object' && !Array.isArray(order.images)) {
      // Try to get the image by index as string key
      if (order.images[index.toString()]) {
        const imagePath = order.images[index.toString()];
        return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
      }
      
      // Try to get the image by menuItemId
      if (order.images[item.menuItemId]) {
        const imagePath = order.images[item.menuItemId];
        return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
      }
    }
    
    // Handle string format (JSON string)
    if (typeof order.images === 'string') {
      try {
        const parsedImages = JSON.parse(order.images);
        
        if (Array.isArray(parsedImages) && parsedImages[index]) {
          const imagePath = parsedImages[index];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        } else if (parsedImages[index.toString()]) {
          const imagePath = parsedImages[index.toString()];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        } else if (parsedImages[item.menuItemId]) {
          const imagePath = parsedImages[item.menuItemId];
          return imagePath.startsWith('Menu/') ? imagePath : `Menu/${imagePath}`;
        }
      } catch (e) {
        // Silent fail for JSON parsing
      }
    }
    
    // Extract filename from menuItemId
    if (item.menuItemId) {
      // If menuItemId is a number, assume it's the image name
      if (!isNaN(item.menuItemId)) {
        return `Menu/${item.menuItemId}.jpg`;
      }
      
      // If menuItemId contains a filename pattern (numbers with .jpg extension)
      const filenameMatch = item.menuItemId.match(/(\d+\.jpg)$/);
      if (filenameMatch) {
        return `Menu/${filenameMatch[1]}`;
      }
    }
    
    // Fallback to default path
    return defaultPath;
  };
  
  // Format date for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
          color: 'bg-blue-100 text-blue-800',
          description: 'Order is waiting to be processed'
        };
      case 'processing':
        return {
          icon: <Utensils className="h-4 w-4" />,
          label: 'Processing',
          color: 'bg-amber-100 text-amber-800',
          description: 'Order is being prepared'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          description: 'Order has been delivered and completed'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          description: 'Order has been cancelled'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          description: 'Order status is unknown'
        };
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsChangingStatus(true);
    setError(null);
    
    try {
      const response = await axios.post(`/api/orders/${order.id}/status`, {
        status: newStatus,
        _method: 'PUT'
      });
      
      const updatedOrder = response.data.data || {...order, status: newStatus};
      
      if (onStatusChange) {
        onStatusChange(updatedOrder);
      } else {
        toast.success(`Order status changed to ${getStatusInfo(newStatus).label}`);
        onClose();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError("Failed to update order status. Please try again.");
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-xl overflow-tr border border-[#DEB887]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5D3A1F] to-[#8B5A2B] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Order Details</h3>
                <p className="text-xs text-white/80">View order information and status</p>
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
            {/* Order Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Order Information</h4>
            </div>
                
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  <Calendar className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                    <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">Order Date</p>
                  <p className="text-sm font-medium text-[#5D3A1F]">{formatDateTime(order.created_at)}</p>
                </div>
                    </div>
                    
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  <CreditCard className="h-5 w-5 text-[#8B5A2B]" />
                    </div>
                <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">Order ID</p>
                  <p className="text-sm font-medium text-[#5D3A1F]">#{order.id}</p>
                    </div>
                  </div>
                </div>
              </div>
          
          {/* Customer Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Customer Information</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  <User className="h-5 w-5 text-[#8B5A2B]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">Customer Name</p>
                  <p className="text-sm font-medium text-[#5D3A1F] truncate">{order.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A67C52]/20 shadow-sm mr-3">
                  {order.service_type === 'table' ? (
                    <Coffee className="h-5 w-5 text-[#8B5A2B]" />
                  ) : (
                  <MapPin className="h-5 w-5 text-[#8B5A2B]" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#6B4226]/70 mb-0.5">
                    {order.service_type === 'table' ? 'Table' : 'Room'}
                  </p>
                  <p className="text-sm font-medium text-[#5D3A1F]">
                    {order.service_type === 'table' ? 
                      (order.table_number || "N/A") : 
                      (order.room_number || "N/A")
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Order Items</h4>
                </div>
                
                  <div className="space-y-2">
                    {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg border border-[#DEB887]/30 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center">
                          {/* Food Image */}
                    <div className="w-12 h-12 rounded-m overflow-hidden mr-3 shadow-md group relative">
                            {/* Base gradient background with utensils icon as fallback */}
                        <div className="w-full h-full bg-gradient-to-r from-[#A67C52] to-[#8B5A2B] flex items-center justify-center">
                              <Utensils className="h-4 w-4 text-white" />
                            </div>
                            
                            {/* Display the actual menu item image */}
                            <img
                              src={`/${getImagePath(order, item, index)}`}
                              alt={item.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                // Try with storage path
                                const storagePath = `/storage/${getImagePath(order, item, index)}`;
                                e.target.src = storagePath;
                                
                                // Add a second error handler for the storage path
                                e.target.onerror = () => {
                                  // Try with a different format (just the filename)
                                  const filename = getImagePath(order, item, index).split('/').pop();
                                  if (filename) {
                                    const simplePath = `/storage/Menu/${filename}`;
                                    e.target.src = simplePath;
                                    
                                    // Final error handler
                                    e.target.onerror = () => {
                                      // If all paths fail, hide the image
                                      e.target.style.display = 'none';
                                    };
                                  } else {
                                    // If we can't extract a filename, hide the image
                                    e.target.style.display = 'none';
                                  }
                                };
                              }}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center">
                          <span className="inline-flex items-center justify-center bg-[#A67C52]/20 text-[#6B4226] font-medium rounded-full w-6 h-6 mr-2">{item.quantity}</span>
                              <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                          </div>
                        </div>
                    <span className="font-medium text-[#8B5A2B]">₱{parseFloat(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              
              {/* Payment Details - Compact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Payment Details</h4>
                </div>
                
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg p-4 border border-[#DEB887]/30 shadow-sm text-xs">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center">
                  <span className="text-[#6B4226]/60">Subtotal:</span>
                  <span className="text-[#5D3A1F] font-medium ml-1.5">
                    ₱{parseFloat(order.subtotal || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-end">
                  <span className="text-[#6B4226]/60">Discount:</span>
                  <span className="text-[#5D3A1F] font-medium ml-1.5">
                    ₱{parseFloat(order.discount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
              <div className="flex flex-col border-t border-[#DEB887]/30 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                    <span className="text-[#6B4226]/60">Senior Citizen:</span>
                        <span className={`font-medium ml-1.5 flex items-center ${order.isSeniorCitizen ? 'text-green-600' : 'text-gray-600'}`}>
                          {order.isSeniorCitizen ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-0.5" />
                              Yes
                            </>
                          ) : (
                            <>No</>                            
                          )}
                        </span>
                      </div>
                    </div>
                    
                <div className="flex items-center justify-between pt-2 border-t border-[#DEB887]/30">
                  <span className="text-[#6B4226]/60">Total:</span>
                  <span className="text-[#5D3A1F] font-bold ml-1.5 text-base">
                    ₱{parseFloat(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
              <h4 className="text-sm font-medium text-[#5D3A1F]">Status Information</h4>
                </div>
                
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg p-4 border border-[#DEB887]/30 shadow-sm text-xs">
                  <div className={`flex items-center p-2 rounded ${statusInfo.color}`}>
                    <div className="mr-2">
                      {statusInfo.icon}
                    </div>
                    <div>
                      <p className="font-medium">{statusInfo.label}</p>
                      <p className="text-xs mt-0.5">{statusInfo.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes (if any) */}
              {order.notes && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
                <h4 className="text-sm font-medium text-[#5D3A1F]">Notes</h4>
                  </div>
                  
              <div className="bg-gradient-to-br from-[#F5EFE7] to-white rounded-lg p-4 border border-[#DEB887]/30 shadow-sm text-xs">
                <p className="text-[#5D3A1F]">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
        
        {/* Account Actions */}
        <div className="space-y-4 pt-6 border-t border-[#DEB887]/30 px-6 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DEB887]"></div>
            <h4 className="text-sm font-medium text-[#5D3A1F]">Order Actions</h4>
          </div>
          <div className="flex flex-wrap gap-3">
          {/* Status Change Buttons */}
          {order.status === 'pending' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#8B5A2B] to-[#6B4226] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                onClick={() => handleStatusChange('processing')}
                disabled={isChangingStatus}
              >
                <Utensils className="h-4 w-4" />
                Start Processing
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#F44336] to-[#C62828] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isChangingStatus}
              >
                <XCircle className="h-4 w-4" />
                Cancel Order
              </button>
            </div>
          )}
          
          {order.status === 'processing' && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-300 disabled:opacity-70"
              onClick={() => handleStatusChange('completed')}
              disabled={isChangingStatus}
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Completed
            </button>
          )}
          
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#5D3A1F] bg-white border border-[#DEB887]/40 rounded-lg shadow-sm hover:bg-[#F5EFE7]/50 focus:outline-none focus:ring-2 focus:ring-[#DEB887] focus:ring-offset-1 transition-all duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}